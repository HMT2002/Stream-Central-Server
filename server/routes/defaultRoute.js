const express = require('express');
const defaultController = require('../controllers/defaultController');

const router = express.Router();

//ROUTE HANDLER

router.route('/check/hls/:filename').get(defaultController.CheckHlsFile);
router.route('/check/dash/:filename').get(defaultController.CheckDashFile);


module.exports = router;
