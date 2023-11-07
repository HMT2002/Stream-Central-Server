const fs = require('fs');
const path = require('path');
const moment = require('moment');

const Thread = require('../models/mongo/Thread');
const User = require('../models/mongo/User');
const Comment = require('../models/mongo/Comment');
const Like = require('../models/mongo/Like');
const Notification = require('../models/mongo/Notification');
const Info = require('../models/mongo/Info');

const driveAPI = require('../modules/driveAPI');
const helperAPI = require('../modules/helperAPI');
const imgurAPI = require('../modules/imgurAPI');
const redirectAPI = require('../modules/redirectAPI');
//const onedriveAPI = require('../modules/onedriveAPI');

const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const NotificationFactory = require('../utils/notificationFactory');

const fluentFfmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
fluentFfmpeg.setFfmpegPath(ffmpegPath);
const ffmpeg = require('ffmpeg');
const axios = require('axios');

exports.GetTV = catchAsync(async (req, res, next) => {
  const baseUrl = 'https://api.themoviedb.org/3/tv/' + req.params.id + '?language=en-US';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZjI3NmIxYTFmMjY4YmMzMTRhZDYwNTUwNTZkMmI3OCIsInN1YiI6IjY1M2Y1MmM3NTkwN2RlMDBhYzAyNWUxMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.PotdEPOO-3gllIB-zv01LrmAUSSlr7g_6mwiEngvMmE',
    },
  };
  const { data: tv } = await axios.get(baseUrl, options);

  res.status(200).json({
    status: 'ok',
    data: tv,
  });
});

exports.QueryTV = catchAsync(async (req, res, next) => {
  const baseUrl =
    'https://api.themoviedb.org/3/search/tv?query=' + req.params.query + '&include_adult=false&language=en-US&page=1';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZjI3NmIxYTFmMjY4YmMzMTRhZDYwNTUwNTZkMmI3OCIsInN1YiI6IjY1M2Y1MmM3NTkwN2RlMDBhYzAyNWUxMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.PotdEPOO-3gllIB-zv01LrmAUSSlr7g_6mwiEngvMmE',
    },
  };
  const { data: tv } = await axios.get(baseUrl, options);
  res.status(200).json({
    status: 'ok',
    data: tv,
  });
});

exports.GetMovie = catchAsync(async (req, res, next) => {
  const baseUrl = 'https://api.themoviedb.org/3/movie/' + req.params.id + '?language=en-US';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZjI3NmIxYTFmMjY4YmMzMTRhZDYwNTUwNTZkMmI3OCIsInN1YiI6IjY1M2Y1MmM3NTkwN2RlMDBhYzAyNWUxMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.PotdEPOO-3gllIB-zv01LrmAUSSlr7g_6mwiEngvMmE',
    },
  };
  const { data: movie } = await axios.get(baseUrl, options);

  res.status(200).json({
    status: 'ok',
    data: movie,
  });
});

exports.QueryMovie = catchAsync(async (req, res, next) => {
  const baseUrl =
    'https://api.themoviedb.org/3/search/movie?query=' +
    req.params.query +
    '&include_adult=false&language=en-US&page=1';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZjI3NmIxYTFmMjY4YmMzMTRhZDYwNTUwNTZkMmI3OCIsInN1YiI6IjY1M2Y1MmM3NTkwN2RlMDBhYzAyNWUxMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.PotdEPOO-3gllIB-zv01LrmAUSSlr7g_6mwiEngvMmE',
    },
  };
  const { data: movie } = await axios.get(baseUrl, options);
  res.status(200).json({
    status: 'ok',
    data: movie,
  });
});

exports.CreateInfo = catchAsync(async (req, res, next) => {
  try {
    const infoID = req.body.infoID;
    const baseUrlTV = 'https://api.themoviedb.org/3/tv/' + infoID + '?language=en-US';
    const baseUrlMovie = 'https://api.themoviedb.org/3/movie/' + infoID + '?language=en-US';
    const type = req.body.type;
    const videoname = req.body.videoname;
    const filmType = req.headers.type;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZjI3NmIxYTFmMjY4YmMzMTRhZDYwNTUwNTZkMmI3OCIsInN1YiI6IjY1M2Y1MmM3NTkwN2RlMDBhYzAyNWUxMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.PotdEPOO-3gllIB-zv01LrmAUSSlr7g_6mwiEngvMmE',
      },
    };
    if (filmType === 'TV') {
      const { data } = await axios.get(baseUrlTV, options);
      req.body.details = data;
    } else {
      const { data } = await axios.get(baseUrlMovie, options);
      req.body.details = data;
    }
    // console.log(req.body.details);
    const video =await redirectAPI.getAvailableVideo( videoname, type );
    req.body.video = video;
    const user = req.user;
    req.body.user = user;
    console.log('////////////////////')
    console.log(user)
    const newInfo = await Info.create({ ...req.body });

    res.status(200).json({
      status: 'ok',
      newInfo,
    });
  } catch (err) {
    next(new AppError('Something wrong.', 400));
  }
});

exports.CreateInfoMovie = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'ok',
    data: tv,
  });
});

exports.CreateInfoTV = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'ok',
    data: tv,
  });
});
