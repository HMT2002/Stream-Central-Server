const fs = require('fs');
const path = require('path');
const users = JSON.parse(fs.readFileSync('./json-resources/users.json'));
const helperAPI = require('../modules/helperAPI');
const driveAPI = require('../modules/driveAPI');
const firebaseAPI = require('../modules/firebaseAPI');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

const User = require('./../models/mongo/User');
const Log = require('./../models/mongo/Log');
const Server = require('./../models/mongo/Server');
const Video = require('./../models/mongo/Video');

const fluentFfmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
fluentFfmpeg.setFfmpegPath(ffmpegPath);

const http = require('http');
const https = require('https');
let { URL, Url } = require('url');
const { error } = require('console');
const axios = require('axios');

const availTestServer = [
  {
    url: 'localhost',
    port: ':9100',
  },

  {
    url: 'localhost',
    port: ':9200',
  },
  {
    url: 'localhost',
    port: ':9300',
  },
];

const availTestHls = [
  {
    url: 'localhost',
    port: ':9100',
    videoname: 'largetest',
  },
  {
    url: 'localhost',
    port: ':9100',
    videoname: 'World Domination How-To',
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
    port: ':9200',
    videoname: 'largetest5',
  },
  {
    url: 'localhost',
    port: ':9300',
    videoname: 'largetest5',
  },
  {
    url: 'localhost',
    port: ':9100',
    videoname: 'medium',
  },
  {
    url: 'localhost',
    port: ':9100',
    videoname: 'medium2',
  },
  {
    url: 'localhost',
    port: ':9200',
    videoname: 'medium2',
  },
  {
    url: 'localhost',
    port: ':9300',
    videoname: 'medium2',
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
  {
    url: 'localhost',
    port: ':9100',
    videoname: 'medium2',
  },
  {
    url: 'localhost',
    port: ':9200',
    videoname: 'medium2',
  },
  {
    url: 'localhost',
    port: ':9300',
    videoname: 'medium2',
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
const getAvailableServer = async () => {
  const servers = await Server.find({});
  return servers;
};
const getAvailableHls = async (videoname) => {
  const availHls = await Video.findOne({ videoname: videoname, type: 'HLS' });
  return availHls;
};
const getAvailableDash = async (videoname) => {
  const availDash = await Video.findOne({ videoname: videoname, type: 'DASH' });
  return availDash;
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

const _protocol = (url) => {
  var u = new URL(url);
  return u.protocol === 'http:' ? http : https;
};

const getMyNetworkDownloadSpeedHls = async (url, port, videoname) => {
  const fileSizeInBytes = 1000000; // ~ 1 mb
  // return new Promise((resolve, reject) => {
  //   var options = {
  //     host: url,
  //     port: Number(port.replace(':', '')),
  //     path: '/videos/convert/' + videoname + '.m3u8',
  //     method: 'GET',
  //   };

  //   var req = http.request(options, function (res) {
  //     res.on('data', function (chunk) {
  //       console.log('suceed');
  //       resolve(chunk);
  //     });
  //   });

  //   req.on('error', function (error) {
  //     console.log(error.code);
  //     resolve(error.code);
  //   });
  // });
  const startTime = new Date().getTime();

  try {
    const baseUrl = 'http://' + url + port + '/videos/' + videoname + 'Hls/'+videoname+'.m3u8';

    const { data } = await axios.get(baseUrl);
    // console.log(data);
    const endTime = new Date().getTime();
    const duration = (endTime - startTime) / 1000;
    const bitsLoaded = fileSizeInBytes * 8;
    const bps = (bitsLoaded / duration).toFixed(2);
    const kbps = (bps / 1000).toFixed(2);
    const mbps = (kbps / 1000).toFixed(2);
    return {  duration, bps, kbps, mbps };
  } catch (err) {
    const endTime = new Date().getTime();
    const duration = (endTime - startTime) / 1000;
    return { ...err, duration };
  }
};

const checkTestErrorCode = (result) => {
  if (result.code && result.code === 'ECONNREFUSED') {
    return { url: result.config.url, message: 'ECONNREFUSED', duration: result.duration };
  } else {
    return result;
  }
};

exports.GetAvailableServerHls = catchAsync(async (req, res, next) => {
  console.log('check hls server');
  console.log(req.query);
  const videoname = req.query.videoname;
  const indexServer = req.query.index;
  if (!indexServer || !videoname) {
    res.status(200).json({
      message: 'Index server or videoname missing',
    });
    return;
  }
  const video = await getAvailableHls(videoname);
  console.log(video);

  //#region old query code
  //   // const features = new APIFeatures(Server.find({ videos: video }), req.query)
  //   // .filter()
  //   // .sort()
  //   // .limitFields()
  //   // .paginate()
  //   // .populateObjects()
  //   // .category()
  //   // .timeline();
  // const servers = await Server.find({ videos: video });
  // console.log(servers);
  // res.status(200).json({
  //   servers
  // });
  //#endregion

  if (!video) {
    res.status(200).json({
      message: 'Video not found on database, check name',
    });
    return;
  }
  const availableServer = await getAvailableServer();
  const numberOfServers = availableServer.length;
  console.log(numberOfServers);
  if (numberOfServers <= indexServer) {
    res.status(200).json({
      message: 'Server index exceed current available servers',
    });
    return;
  }
  const url = availableServer[indexServer].URL;
  const port = availableServer[indexServer].port;
  const baseUrl = 'http://' + url + port + '/api/default/check/hls/' + videoname;
  const { data } = await axios.get(baseUrl);
  res.status(200).json({
    ...data,
  });

  // res.redirect('http://' + url + port + '/api/default/check/hls/' + videoname);
});

exports.GetAvailableServerDash = catchAsync(async (req, res, next) => {
  console.log('check dash server');
  console.log(req.query);
  const videoname = req.query.videoname;
  const indexServer = req.query.index;
  if (!indexServer || !videoname) {
    res.status(200).json({
      message: 'Index server or videoname missing',
    });
    return;
  }
  const video = await getAvailableDash(videoname)
  console.log(video);
  if (!video) {
    res.status(200).json({
      message: 'Video not found on database, check name',
    });
    return;
  }
  const availableServer = await getAvailableServer();
  const numberOfServers = availableServer.length;
  if (numberOfServers <= indexServer) {
    res.status(200).json({
      message: 'Server index exceed current available servers',
    });
    return;
  }
  const url = availableServer[indexServer].URL;
  const port = availableServer[indexServer].port;
  const baseUrl = 'http://' + url + port + '/api/default/check/dash/' + videoname;

  const { data } = await axios.get(baseUrl);

  res.status(200).json({
    ...data,
  });

  // res.redirect('http://' + url + port + '/api/default/check/dash/' + videoname);
});

exports.ServerRecall = catchAsync(async (req, res, next) => {
  console.log('recall server');
  console.log(req.query);
  const referer = req.headers.referer;
  console.log(referer);

  const urlAndPort = req.query.url.split(':');
  const url = urlAndPort[0];
  const port = urlAndPort[1];
  const videoname = req.query.videoname;
  res.status(200).json({
    recall: 'recall here',
    path: 'path here',
    url,
    port,
    videoname,
  });
});

exports.CheckSpeed = catchAsync(async (req, res, next) => {
  console.log('check speed');
  const videoname = req.params.filename;
  const video = await getAvailableHls(videoname);
    if (!video) {
    res.status(200).json({
      message: 'Video not found on database, check name',
    });
    return;
  }
  const availableServer=await getAvailableServer();
  if(availableServer.length===0){
    res.status(200).json({
      message: 'Not found any server',
    });
    return;
    }
  let testResults=[]
  for (let i = 0; i < availableServer.length; i++) {
    const speedDownload = checkTestErrorCode(
      await getMyNetworkDownloadSpeedHls(availableServer[i].URL, availableServer[i].port, video.videoname)
    );
    testResults.push(speedDownload);
  }

  res.status(400).json({
    message: 'found video',
    downloadSpeeds: testResults,
  });
});

exports.RedirectHls = catchAsync(async (req, res, next) => {
  console.log('redirect');
  const filename = req.params.filename;
  const video = await getAvailableHls(filename);
  if (!video) {
    res.status(200).json({
      message: 'Video not found on database, check name',
    });
    return;
  }
  const index = 0;
  const url = result[index].url || 'localhost';
  const port = result[index].port || ':9100';
  const videoname = result[index].videoname || 'medium';
  res.redirect('http://' + url + port + '/videos/' + videoname + 'Hls/' + videoname + '.m3u8');
  res.end();
});

exports.RedirectDash = catchAsync(async (req, res, next) => {
  const filename = req.params.filename;
  console.log(filename);
  console.log('/////////////');
  const filenamebase = req.params.filenamebase;
  // console.log(filenamebase)
  const availableUrlAndPort = await getAvailableDashUrlAndPort();
  const result = availableUrlAndPort.filter((x) => {
    return x.videoname.toString() === filename;
  });
  console.log(result);
  if (result.length == 0) {
    res.status(400).json({
      message: 'not found video',
    });
    return;
  }
  const index = 0;
  const url = result[index].url || 'localhost';
  const port = result[index].port || ':9100';
  const videoname = result[index].videoname || 'medium';
  console.log('http://' + url + port + '/videos/' + videoname + '/init.mpd');
  res.redirect('http://' + url + port + '/videos/' + videoname + '/init.mpd');
  res.end();
});

exports.M4SHandler = catchAsync(async (req, res, next) => {
  console.log('m4s handler');
  // console.log('/////////////')
  const url = 'localhost';
  const port = ':9100';
  const videoname = req.params.filenamebase;
  req.url = req.url.replace('/dash/', '/videos/');
  // console.log('here is the m4s url')
  console.log('http://' + url + port + req.url);

  res.redirect('http://' + url + port + req.url);
});

exports.RedirectLiveGET = catchAsync(async (req, res, next) => {
  console.log('redirect');
  const index = 4;
  const availableUrlAndPort = await getAvailableRTMPUrlAndPort();
  const url = availableUrlAndPort[index].url || '192.168.1.99';
  const port = availableUrlAndPort[index].port || ':1936';
  const videoname = availableUrlAndPort[index].videoname || 'steinop';
  console.log(videoname);
  console.log('rtmp://' + url + port + '/live/' + videoname);
  res.redirect('rtmp://' + url + port + '/live/' + videoname);
  res.end();
});

///////////////////////////////////////////////////////////////////////
exports.RedirectLivePOST = catchAsync(async (req, res, next) => {
  console.log('redirect');
  const index = 4;
  const availableUrlAndPort = await getAvailableRTMPUrlAndPort();
  const url = availableUrlAndPort[index].url || '192.168.1.99';
  const port = availableUrlAndPort[index].port || ':1936';
  const videoname = availableUrlAndPort[index].videoname || 'steinop';
  console.log(videoname);
  console.log('rtmp://' + url + port + '/live/' + videoname);
  res.redirect('rtmp://' + url + port + '/live/' + videoname);
  res.end();
});

exports.RedirectReplicateRequest = catchAsync(async (req, res, next) => {
  console.log('redirect post replicate');
  console.log(req.body);
  const availableServer=await getAvailableServer();
  const index=0;
  const url = availableServer[index].URL || 'localhost';
  const port = availableServer[index].port || ':9100';
  res.redirect(308, 'http://' + url + port + '/api/v1/replicate/send');
  res.end();
});
exports.RedirectDeleteRequest = catchAsync(async (req, res, next) => {
  console.log('redirect post replicate');
  console.log(req.body);
  const availableUrlAndPort = await getAvailableHlsUrlAndPort();
  const url = availableUrlAndPort[0].url || 'localhost';
  const port = availableUrlAndPort[0].port || ':9100';
  res.redirect(308, 'http://' + url + port + '/api/v1/delete/');
  res.end();
});

exports.RedirectReplicateFolderRequest = catchAsync(async (req, res, next) => {
  console.log('redirect post replicate');
  console.log(req.body);
  const availableServer=await getAvailableServer();
  const index=0;
  const url = availableServer[index].URL || 'localhost';
  const port = availableServer[index].port || ':9100';
  res.redirect(308, 'http://' + url + port + '/api/v1/replicate/send-folder');
  res.end();
});
exports.RedirectDeleteFolderRequest = catchAsync(async (req, res, next) => {
  console.log('redirect post replicate');
  console.log(req.body);
  const availableUrlAndPort = await getAvailableHlsUrlAndPort();
  const url = availableUrlAndPort[0].url || 'localhost';
  const port = availableUrlAndPort[0].port || ':9100';
  res.redirect(308, 'http://' + url + port + '/api/v1/delete/folder');
  res.end();
});
