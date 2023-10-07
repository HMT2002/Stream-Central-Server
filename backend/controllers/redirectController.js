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

const fluentFfmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
fluentFfmpeg.setFfmpegPath(ffmpegPath);

const availTestHls = [
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
    videoname: 'medium',
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
    port: ':9100',
    videoname: 'largetest5',
  },
  {
    url: 'localhost',
    port: ':9100',
    videoname: 'mediumtest',
  },
  {
    url: 'localhost',
    port: ':9100',
    videoname: 'test',
  },
  {
    url: 'localhost',
    port: ':9100',
    videoname: 'test2',
  },
];

const availTestRTMP = [
  {
    url: 'localhost',
    port: ':1936',
    videoname: 'stein',
  },
  {
    url: 'localhost',
    port: ':1936',
    videoname: 'stein',
  },
  {
    url: 'localhost',
    port: ':1936',
    videoname: 'stein',
  },
  {
    url: 'localhost',
    port: ':1936',
    videoname: 'steinop',
  },
  {
    url: 'localhost',
    port: ':1936',
    videoname: 'mediumtest',
  },
  {
    url: 'localhost',
    port: ':1936',
    videoname: 'largetest5',
  },
];

const availTestDelete = [
  {
    url: 'localhost',
    port: ':9100',
    videoname: 'steinoptest.mp4',
  },
];

const getAvailableHlsUrlAndPort = async () => {
  return availTestHls;
};
const getAvailableDashUrlAndPort = async () => {
  return availTestDash;
};
const getAvailableRTMPUrlAndPort = async () => {
  return availTestRTMP;
};
const getAvailableDeleteUrlAndPort = async () => {
  return availTestDelete;
};
const getVideoAvailableLocation = async () => {
  return availTestHls;
};

exports.RedirectHls = catchAsync(async (req, res, next) => {
  console.log('redirect');
  const filename = req.params.filename;
  console.log(filename)
  console.log('//////////////')
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
  const index=0;
  const url = result[index].url || 'localhost';
  const port = result[index].port || ':9100';
  const videoname = result[index].videoname+'.m3u8' || 'medium.m3u8';
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
  const index=0;
  const url = result[index].url || 'localhost';
  const port = result[index].port || ':9100';
  const videoname = result[index].videoname || 'medium';
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


exports.RedirectLiveGET = catchAsync(async (req, res, next) => {
  console.log('redirect');
  const index=4;
  const availableUrlAndPort = await getAvailableRTMPUrlAndPort();
  const url = availableUrlAndPort[index].url || '192.168.1.99';
  const port = availableUrlAndPort[index].port || ':1936';
  const videoname = availableUrlAndPort[index].videoname || 'steinop';
  console.log(videoname)
  console.log('rtmp://' + url + port+'/live/'+videoname)
  res.redirect('rtmp://' + url + port+'/live/'+videoname);
  res.end();
});







///////////////////////////////////////////////////////////////////////
exports.RedirectLivePOST = catchAsync(async (req, res, next) => {
  console.log('redirect');
  const index=4;
  const availableUrlAndPort = await getAvailableRTMPUrlAndPort();
  const url = availableUrlAndPort[index].url || '192.168.1.99';
  const port = availableUrlAndPort[index].port || ':1936';
  const videoname = availableUrlAndPort[index].videoname || 'steinop';
  console.log(videoname)
  console.log('rtmp://' + url + port+'/live/'+videoname);
  res.redirect('rtmp://' + url + port+'/live/'+videoname);
  res.end();
});


exports.RedirectReplicateRequest = catchAsync(async (req, res, next) => {
  console.log('redirect post replicate');
  console.log(req.body);
  const availableUrlAndPort = await getAvailableHlsUrlAndPort();
  const url = availableUrlAndPort[0].url || 'localhost';
  const port = availableUrlAndPort[0].port || ':9100';
  res.redirect(308,'http://' + url + port + '/api/v1/replicate/send');
  res.end();
});
exports.RedirectDeleteRequest = catchAsync(async (req, res, next) => {
  console.log('redirect post replicate');
  console.log(req.body);
  const availableUrlAndPort = await getAvailableHlsUrlAndPort();
  const url = availableUrlAndPort[0].url || 'localhost';
  const port = availableUrlAndPort[0].port || ':9100';
  res.redirect(308,'http://' + url + port + '/api/v1/delete/');
  res.end();
});
