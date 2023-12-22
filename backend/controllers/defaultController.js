const Info = require('../models/mongo/Info');
const Thread = require('../models/mongo/Thread');
const Video = require('../models/mongo/Video');
const catchAsync = require('./../utils/catchAsync');
const cronjobAPI = require('./../modules/cronjobAPI');

exports.Default = catchAsync(async (req, res, next) => {
  const threads = await Thread.find({});
  console.log(threads);
  res.status(200).json({
    status: 'success',
    requestTime: req.requestTime,
    data: {
      threads: threads,
    },
  });
});

exports.TestAllAlive = catchAsync(async (req, res, next) => {
  const aliveServers = await cronjobAPI.GetAllAliveServer();
  res.status(200).json({
    status: 'success',
    requestTime: req.requestTime,
    data: {
      aliveServers,
    },
  });
});

exports.Fu = catchAsync(async (req, res, next) => {
  // await Video.deleteMany({videoname:'0u6jYys'})
  res.status(200).json({
    status: 'success',
    requestTime: req.requestTime,
  });
});

exports.VideoServers = catchAsync(async (req, res, next) => {
  const servers = await cronjobAPI.GetAllAliveServerFromAllVideo();
  res.status(200).json({
    status: 'success',
    requestTime: req.requestTime,
    data: {
      ...servers,
    },
  });
});
