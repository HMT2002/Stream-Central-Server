const express = require('express');
const fs = require('fs');
const redirectController = require('../controllers/redirectController');
const { upload, uploadVideo, uploadImage,uploadMultipartFile ,uploadMultipartFileChunk} = require('../modules/multerAPI.js');
const router = express.Router();

//ROUTE HANDLER
router.route('/speed-check-hls/:filename').get(redirectController.CheckSpeedHLS);
router.route('/speed-check-dash/:filename').get(redirectController.CheckSpeedDASH);

router.route('/get-available-server/hls').get(redirectController.GetAvailableServerHls);
router.route('/get-available-server/dash').get(redirectController.GetAvailableServerDash);
router.route('/recall').get(redirectController.ServerRecall);
// router.route('/recall').post(redirectController.ServerRecall);


router.route('/hls/:filename').options(redirectController.RedirectHls).get(redirectController.RedirectHls);
//cái thứ DASH này ngu thật sự, nó nghĩ để chung folder gốc hết cmnl hay gì
//bắt buộc phải làm kiểu này, đường dẫn đến file phải ghi lại đến 2 lần
router.route('/dash/:filenamebase/:filename*.m4s').get(redirectController.M4SHandler);
router.route('/dash/:filenamebase/:filename').get(redirectController.RedirectDash);

router.route('/live/:filename').get(redirectController.RedirectLiveGET);
// router.route('/live/:filename').post(redirectController.RedirectLivePOST);

// router.route('/live/:filename').get(redirectController.RedirectLive);

router.route('/replicate/send').post(redirectController.RedirectReplicateRequest);
router.route('/delete').post(redirectController.RedirectDeleteRequest);

router.route('/replicate/send-folder').post(redirectController.RedirectReplicateFolderRequest);
router.route('/delete-folder').post(redirectController.RedirectDeleteFolderRequest);


router.route('/upload-video-large-multipart-hls').post(uploadMultipartFileChunk, redirectController.UploadNewFileLargeMultilpartHls);
router.route('/upload-video-large-multipart-dash').post(uploadMultipartFileChunk, redirectController.UploadNewFileLargeMultilpartDash);

// router.route('/upload-video-large-multipart-concatenate').post( redirectController.UploadNewFileLargeMultilpartConcatenate,redirectController.UploadNewFileLargeGetVideoThumbnail);
// router.route('/upload-video-large-multipart-concatenate').post( redirectController.UploadNewFileLargeMultilpartConcatenate,redirectController.UploadNewFileLargeConvertToHls);


module.exports = router;
