const express = require('express');
const defaultController = require('../controllers/defaultController');
const authController = require('../controllers/authController');

const router = express.Router();

//ROUTE HANDLER
router.route('/').get(defaultController.Default);
router.route('/forget-password').post(authController.ForgetPassword);
router.route('/reset-password/:token').patch(authController.ResetPassword);
router.route('/fu').post(defaultController.Fu);

router.route('/all-alive-server').get(defaultController.TestAllAlive);
router.route('/video-server').get(defaultController.VideoServers);

module.exports = router;
