const express = require('express');
const fs = require('fs');
const redirectController = require('../controllers/redirectController');
const { upload, uploadVideo, uploadImage } = require('../modules/multerAPI.js');
const router = express.Router();

//ROUTE HANDLER
router.route('/hls/:filename').get(redirectController.RedirectHls);
router.route('/dash/:filename').get(redirectController.RedirectDash);
router.route('/live/:filename').get(redirectController.RedirectLive);

router.route('/replicate/send').post(redirectController.ReplicateRequest);



module.exports = router;
