const fs = require('fs');
const path = require('path');
const users = JSON.parse(fs.readFileSync('./json-resources/users.json'));
const helperAPI = require('../modules/helperAPI');
const driveAPI = require('../modules/driveAPI');
const firebaseAPI = require('../modules/firebaseAPI');

const threads_test = JSON.parse(fs.readFileSync('./json-resources/threads_test.json'));

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

const availTestHls = [
  {
    url: 'localhost',
    port: ':9100',
    videoname: 'largetest.m3u8',
  },
  {
    url: 'localhost',
    port: ':9100',
    videoname: 'largesttest.m3u8',
  },
  {
    url: 'localhost',
    port: ':9200',
    videoname: 'largetest5.m3u8',
  },
  {
    url: 'localhost',
    port: ':9200',
    videoname: 'medium.m3u8',
  },
];

const availTestDash = [
  {
    url: 'localhost',
    port: ':9100',
    videoname: 'largetest',
  },
  {
    url: 'localhost',
    port: ':9100',
    videoname: 'largesttest',
  },
  {
    url: 'localhost',
    port: ':9200',
    videoname: 'largetest5',
  },
  {
    url: 'localhost',
    port: ':9100',
    videoname: 'mediumtest',
  },
];

const getAvailableHlsUrlAndPort = async () => {
  return availTestHls;
};
const getAvailableDashUrlAndPort = async () => {
  return availTestDash;
};

const getVideoAvailableLocation = async () => {
  return availTestHls;
};

exports.RedirectHls = catchAsync(async (req, res, next) => {
  console.log('redirect');
  const filename = req.params.filename;
  //   console.log(filename)
  const availableUrlAndPort = await getAvailableHlsUrlAndPort();
  const result = availableUrlAndPort.filter((x) => {
    console.log(x.videoname);
    return x.videoname.toString() === filename;
  });
  console.log(result);
  if (result.length == 0) {
    res.status(400).json({
      message: 'not found video',
    });
    return;
  }
  const url = result[0].url || 'localhost';
  const port = result[0].port || ':9100';
  const videoname = result[0].videoname || 'medium.m3u8';
  res.redirect('http://' + url + port + '/redirect/hls/' + videoname);
  res.end();
});

exports.RedirectDash = catchAsync(async (req, res, next) => {
  const filename = req.params.filename;
  console.log(filename)
  console.log('/////////////')
  const filenamebase = req.params.filenamebase;
  console.log(filenamebase)
  const availableUrlAndPort = await getAvailableDashUrlAndPort();
  const result = availableUrlAndPort.filter((x) => {
    console.log(x.videoname);
    return x.videoname.toString() === filename;
  });
  console.log(result);
  if (result.length == 0) {
    res.status(400).json({
      message: 'not found video',
    });
    return;
  }
  const url = result[0].url || 'localhost';
  const port = result[0].port || ':9100';
  const videoname = result[0].videoname || 'medium';
  res.redirect('http://' + url + port + '/videos/' + videoname+'/init.mpd');
  res.end();
});



exports.M4SHandler = catchAsync(async (req, res, next) => {
  console.log('m4s handler')
  console.log(req.url)
  console.log(req.params)
  console.log('/////////////')
  const url = 'localhost';
  const port = ':9100';
  const videoname = req.params.filenamebase;
  req.url=req.url.replace('/dash/','/videos/')
  console.log('here is the m4s url')
  console.log(req.url);


  res.redirect('http://' + url + port + req.url);

});


exports.RedirectLive = catchAsync(async (req, res, next) => {
  console.log('redirect');
  const availableUrlAndPort = await getAvailableUrlAndPort();
  const url = availableUrlAndPort[0].url || 'localhost';
  const port = availableUrlAndPort[0].port || ':9100';
  res.redirect('http://' + url + port);
  res.end();
});


exports.RedirectReplicateRequest = catchAsync(async (req, res, next) => {
  console.log('redirect post replicate');
  console.log(req.body);
  const availableUrlAndPort = await getAvailableUrlAndPort();
  const url = availableUrlAndPort[0].url || 'localhost';
  const port = availableUrlAndPort[0].port || ':9100';
  res.redirect(308,'http://' + url + port + '/api/v1/replicate/send');
  res.end();
});
