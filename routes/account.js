const router = require('express').Router();
const multer = require('multer');

const upload = multer();
const uniqid = require('uniqid');
const low = require('lowdb');

const FileSync = require('lowdb/adapters/FileSync', {
  serialize: (data) => encrypt(JSON.stringify(data)),
  deserialize: (data) => JSON.parse(decrypt(data)),
});

router.post('/', upload.none(), (request, response) => {
  const { _method, name } = request.body;
  if (_method === 'PUT') {
    createAccount(response, name);
  }
  if (_method === 'DELETE') {
    removeAccount(response, request.body.id);
  }
});

router.get('/:id?', upload.none(), (request, response) => {
  const db = low(new FileSync('db.json'));
  const user = db.get('users').find({ isAuthorized: true });

  const sumAccountSum = (account_id) => {
    const transactions = db.get('transactions').filter({ account_id }).value();
    return transactions.reduce((sum, a) => (a.type === 'EXPENSE' ? sum - a.sum : sum + a.sum), 0);
  };

  const userValue = user.value();
  const { id } = request.params;

  if (id) {
    const account = db.get('accounts').find({ id }).value();
    account.sum = sumAccountSum(account.id);
    response.json({ success: true, data: account });
  } else {
    const accounts = db.get('accounts').filter({ user_id: userValue.id }).value();
    accounts.forEach((account) => {
      account.sum = sumAccountSum(account.id);
    });
    response.json({ success: true, data: accounts });
  }
});

function createAccount(response, name) {
  const db = low(new FileSync('db.json'));
  const userValue = db.get('users').find({ isAuthorized: true }).value();
  const createdAccount = { name, user_id: userValue.id, id: uniqid() };
  db.get('accounts').push(createdAccount).write();
  response.json({ success: true, account: createdAccount });
}

function removeAccount(response, id) {
  const db = low(new FileSync('db.json'));
  const accounts = db.get('accounts');
  const removingAccount = accounts.find({ id });
  if (removingAccount.value()) {
    accounts.remove({ id }).write();
    response.json({ success: true });
  } else {
    response.json({ success: false });
  }
}

module.exports = router;
