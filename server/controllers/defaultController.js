const fs = require('fs');
const path = require('path');
const helperAPI = require('../modules/helperAPI');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
var FormData = require('form-data');
const axios = require('axios');

exports.Default = catchAsync(async (req, res, next) => {
  res.status(200).json({
    default: 'default',
  });
});

exports.CheckHlsFile = catchAsync(async (req, res, next) => {
  const filename = req.params.filename || 'mkvmedium';
  const videoPath = 'videos/convert/' + filename + '.m3u8';
  // console.log(filename)
  if (fs.existsSync(videoPath)) {
    res.status(200).json({
      existed: true,
      path: videoPath,
    });
    return;
  } else {
    const fullURL = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log(fullURL);

    res.redirect('http://localhost:9000/redirect/recall');

    // res.status(200).json({
    //   existed:false,
    //   path:videoPath,
    // });
    return;
  }
});

exports.CheckDashFile = catchAsync(async (req, res, next) => {
  const filename = req.params.filename || 'largetest5';
  const videoPath = 'videos/' + filename + '/init.mpd';
  if (fs.existsSync(videoPath)) {
    res.status(200).json({
      existed: true,
      path: videoPath,
    });
    return;
  } else {
    res.status(200).json({
      existed: false,
      path: videoPath,
    });
    return;
  }
});
