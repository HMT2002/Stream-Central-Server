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

router.route('/get-available-server-for-video/hls/:filename').get(redirectController.AvailableServerForVideoHls);
router.route('/get-available-server-for-video/dash/:filename').get(redirectController.AvailableServerForVideoDash);


router.route('/hls/:filename').get(redirectController.RedirectHls);
//cái thứ DASH này ngu thật sự, nó nghĩ để chung folder gốc hết cmnl hay gì
//bắt buộc phải làm kiểu này, đường dẫn đến file phải ghi lại đến 2 lần
router.route('/dash/:filenamebase/:filename*.m4s').get(redirectController.M4SHandler);
router.route('/dash/:filenamebase/:filename').get(redirectController.RedirectDash);


router.route('/replicate/send').post(redirectController.RedirectReplicateRequest);
router.route('/delete').post(redirectController.RedirectDeleteRequest);
router.route('/replicate/send-folder').post(redirectController.RedirectReplicateFolderRequest);
router.route('/delete-folder').post(redirectController.RedirectDeleteFolderRequest);
//4 cái trên đều truyền vào body json như này
// {
//     "filename":"2wR6bkUHls",
//     "url":"http://localhost",
//     "port":":9100"
// }

router.route('/upload-video-large-multipart-hls').post(uploadMultipartFileChunk, redirectController.UploadNewFileLargeMultilpartHls);
router.route('/upload-video-large-multipart-dash').post(uploadMultipartFileChunk, redirectController.UploadNewFileLargeMultilpartDash);
// 2 cái trên thì có formData và headers hơi nhức đầu tí
// const formData = new FormData();
// formData.append('myMultilPartFileChunk', chunk);
// formData.append('myMultilPartFileChunkIndex', chunkIndex);
// formData.append('arraychunkname', arrayChunkName);
//     {
//     method: 'POST',
//     body: formData,
//     headers: {
//       type: 'blob',
//       index: index,
//       chunkname: chunkName,
//       filename: filename,
//       arrayChunkName,
//       ext,
//     },


module.exports = router;
