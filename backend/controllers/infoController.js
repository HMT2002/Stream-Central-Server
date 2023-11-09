const fs = require('fs');
const path = require('path');
const moment = require('moment');

const Thread = require('../models/mongo/Thread');
const User = require('../models/mongo/User');
const Comment = require('../models/mongo/Comment');
const Like = require('../models/mongo/Like');
const Notification = require('../models/mongo/Notification');
const Info = require('../models/mongo/Info');

const redirectAPI = require('../modules/redirectAPI');
const infoAPI = require('../modules/infoAPI');

//const onedriveAPI = require('../modules/onedriveAPI');

const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const axios = require('axios');

exports.GetAll = catchAsync(async (req, res, next) => {
  const tv = await infoAPI.GetAll();

  res.status(200).json({
    status: 'ok',
    data: tv,
  });
});

exports.GetTV = catchAsync(async (req, res, next) => {
  const tv = await infoAPI.GetTV(req.params.id);

  res.status(200).json({
    status: 'ok',
    data: tv,
  });
});

exports.QueryTV = catchAsync(async (req, res, next) => {
  const tv = await infoAPI.QueryTV(req.params.query);

  res.status(200).json({
    status: 'ok',
    data: tv,
  });
});

exports.GetMovie = catchAsync(async (req, res, next) => {
  const movie = await infoAPI.GetMovie(req.params.id);

  res.status(200).json({
    status: 'ok',
    data: movie,
  });
});

exports.GetFilm = catchAsync(async (req, res, next) => {
  const movie = await infoAPI.GetFilm(req.params.id);

  res.status(200).json({
    status: 'ok',
    data: movie,
  });
});

exports.QueryMovie = catchAsync(async (req, res, next) => {
  const movie = await infoAPI.QueryMovie(req.params.query);

  res.status(200).json({
    status: 'ok',
    data: movie,
  });
});

exports.CreateInfo = catchAsync(async (req, res, next) => {
  const filmID = req.body.filmID;
  req.body.videos.forEach(async (id) => {
    const video = await redirectAPI.getAvailableVideoID(id);
    id = video;
  });
  const testInfo = await Info.findOne({ filmID });
  if (testInfo) {
    next(new AppError('This info already belong to other film.', 409));
    return;
  }
  const user = req.user;
  req.body.user = user;

  try {
    const newInfo = await Info.create({ ...req.body });
    res.status(200).json({
      status: 'ok',
      newInfo,
    });
  } catch (err) {
    console.log(err)
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
