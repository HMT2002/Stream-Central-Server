const Thread = require('../models/mongo/Thread');
const Video = require('../models/mongo/Video');
const catchAsync = require('./../utils/catchAsync');
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
exports.Fu = catchAsync(async (req, res, next) => {
  await Video.deleteMany({ videoname: '0u6jYys' });
  res.status(200).json({
    status: 'success',
    requestTime: req.requestTime,
  });
});
