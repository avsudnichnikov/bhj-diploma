const router = require('express').Router();
const multer = require('multer');

const upload = multer();
const uniqid = require('uniqid');

const low = require('lowdb');

const FileSync = require('lowdb/adapters/FileSync', {
  serialize: (data) => encrypt(JSON.stringify(data)),
  deserialize: (data) => JSON.parse(decrypt(data)),
});

router.get('/', upload.none(), (request, response) => {
  const db = low(new FileSync('db.json'));
  const transactions = db.get('transactions').filter({ account_id: request.query.account_id }).value();
  response.json({ success: true, data: transactions });
});

router.post('/:id?', upload.none(), (request, response) => {
  const db = low(new FileSync('db.json'));
  const transactions = db.get('transactions');
  const { _method } = request.body;
  if (_method === 'DELETE') {
    const { id } = request.params;
    console.log(request.body);
    const removingTransaction = transactions.find({ id });
    if (removingTransaction.value()) {
      transactions.remove({ id }).write();
      response.json({ success: true });
    } else {
      response.json({ success: false });
    }
  }
  if (_method === 'PUT') {
    const reg = /^-?\d+(\.?\d+)?$/;
    const {
      type, name, sum, account_id,
    } = request.body;
    const currentUser = db.get('users').find({ isAuthorized: true }).value();
    if (!currentUser) {
      response.json({ success: false, error: 'Необходима авторизация' });
    } else if (reg.test(sum)) {
      transactions.push({
        id: uniqid(),
        type: type.toLowerCase(),
        name,
        sum: +sum,
        account_id,
        user_id: currentUser.id,
        created_at: new Date().toISOString(),
      }).write();
      response.json({ success: true });
    } else {
      response.json({ success: false, error: 'Недопустимые символы в поле Сумма' });
    }
  }
});

module.exports = router;
