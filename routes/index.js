const router = require('express').Router();
const user = require('./user');
const account = require('./account');
const transaction = require('./transaction');

router.use('/user', user);
router.use('/account', account);
router.use('/transaction', transaction);

router.get('/apitest', (request, response) => {
  response.json({ success: false });
});

module.exports = router;
