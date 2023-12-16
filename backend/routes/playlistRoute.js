const express = require('express');
const fs = require('fs');
const videoController = require('../controllers/videoController.js');
const actionController = require('../controllers/actionController.js');
const authController = require('../controllers/authController.js');

const {
  upload,
  uploadVideo,
  uploadImage,
  uploadMultipartFile,
  uploadMultipartFileChunk,
} = require('../modules/multerAPI.js');
const router = express.Router();
const tempHls = fs.readFileSync('./public/client.html', 'utf-8');

//ROUTE HANDLER

router
  .route('/add-playlist')
  .post(
    authController.protect,
    authController.restrictTo('admin', 'user', 'content-creator'),
    actionController.GetVideoByIDForPlaylist,
    actionController.GetInfoByID,
    actionController.AddVideoToPlaylist
  );

  router
  .route('/delete-playlist')
  .post(
    actionController.DeletePlaylist
  );
router
  .route('/create-playlist')
  .post(
    authController.protect,
    authController.restrictTo('admin', 'user', 'content-creator'),
    actionController.CreatePlaylist
  );


router
  .route('/get-all-playlist')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'user', 'content-creator'),
    actionController.GetUserAllPlaylist
  );

module.exports = router;
