const router = require('express').Router();
const multer = require('multer');
const upload = multer();
const uniqid = require('uniqid');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync', {
    serialize: (data) => encrypt(JSON.stringify(data)),
    deserialize: (data) => JSON.parse(decrypt(data))
});
const db = low(new FileSync('db.json'));

const getUser = () => db.get('users').find({isAuthorized: true});

router.post('/', upload.none(), function (request, response) {
    const {_method, name} = request.body;
    if (_method === 'PUT') {
        createAccount(response, name);
    }
    if (_method === 'DELETE') {
        removeAccount(response, request.body.id);
    }
});

router.get('/:id?', upload.none(), function (request, response) {
    const user = getUser();

    const sumAccountSum = (account_id) => {
        const transactions = db.get('transactions').filter({account_id: account_id}).value();
        return transactions.reduce((sum, a) => a.type === 'EXPENSE' ? sum - a.sum : sum + a.sum, 0);
    }

    const userValue = user.value();
    const id = request.params.id;

    if (id) {
        const account = db.get('accounts').find({id}).value();
        account.sum = sumAccountSum(account.id);
        response.json({success: true, data: account});
    } else {
        const accounts = db.get('accounts').filter({user_id: userValue.id}).value();
        accounts.forEach((account) => {
            account.sum = sumAccountSum(account.id);
        });
        response.json({success: true, data: accounts});
    }
});

function createAccount(response, name) {
    let userValue = getUser().value();
    let createdAccount = {name, user_id: userValue.id, id: uniqid()};
    db.get('accounts').push(createdAccount).write();
    response.json({success: true, account: createdAccount});
}

function removeAccount(response, id) {
    let accounts = db.get('accounts');
    let removingAccount = accounts.find({id});
    if (removingAccount.value()) {
        accounts.remove({id}).write();
        response.json({success: true});
    } else {
        response.json({success: false});
    }
}

module.exports = router;
