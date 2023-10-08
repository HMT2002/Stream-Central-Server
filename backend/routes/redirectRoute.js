const express = require('express');
const fs = require('fs');
const redirectController = require('../controllers/redirectController');
const { upload, uploadVideo, uploadImage } = require('../modules/multerAPI.js');
const router = express.Router();

//ROUTE HANDLER
router.route('/speed-check/:filename').get(redirectController.CheckSpeed);

router.route('/hls/:filename').get(redirectController.RedirectHls);
router.route('/dash/:filenamebase/:filename*.m4s').get(redirectController.M4SHandler);
router.route('/dash/:filenamebase/:filename').get(redirectController.RedirectDash);

router.route('/live/:filename').get(redirectController.RedirectLiveGET);
// router.route('/live/:filename').post(redirectController.RedirectLivePOST);

// router.route('/live/:filename').get(redirectController.RedirectLive);

router.route('/replicate/send').post(redirectController.RedirectReplicateRequest);
router.route('/delete').post(redirectController.RedirectDeleteRequest);



module.exports = router;
