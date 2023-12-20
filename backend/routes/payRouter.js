const express = require('express');
const router = express.Router();
const paymentCotroller=require('../controllers/payController')

router.route('/').get(paymentCotroller.payment);
router.route('/success').get(paymentCotroller.success);

module.exports = router;
