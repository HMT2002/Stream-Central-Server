const express = require('express');
const infoController = require('../controllers/infoController.js');

const authController = require('../controllers/authController.js');
const { upload, uploadVideo } = require('../modules/multerAPI.js');

const router = express.Router();

//router.param('slug', threadController.CheckSlug);

//ROUTE HANDLER
router.route('/').get(infoController.GetAll).post(authController.protect, infoController.CreateInfo);

router.route('/tv/search/:query').get(infoController.QueryTV);

router.route('/tv/:id').get(infoController.GetTV);

router.route('/movie/search/:query').get(infoController.QueryMovie);

router.route('/movie/:id').get(infoController.GetMovie);

router.route('/film/:id').get(infoController.GetFilm);

module.exports = router;
