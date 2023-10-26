const fs = require('fs');
const path = require('path');
const users = JSON.parse(fs.readFileSync('./json-resources/users.json'));
const helperAPI = require('../modules/helperAPI');
const driveAPI = require('../modules/driveAPI');
const firebaseAPI = require('../modules/firebaseAPI');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
var FormData = require('form-data');

const User = require('./../models/mongo/User');
const Log = require('./../models/mongo/Log');
const Server = require('./../models/mongo/Server');
const Video = require('./../models/mongo/Video');

const fluentFfmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
fluentFfmpeg.setFfmpegPath(ffmpegPath);

const axios = require('axios');

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

const getAvailableServer = async (video) => {
  const servers = await Server.find({ videos: video });
  return servers;
};

const getAvailableServersStorage = async (video) => {
  const servers = await Server.find({ videos: { $nin: [video._id] } });
  return servers;
};

const getAllServers = async () => {
  const servers = await Server.find();
  return servers;
};

const availableStorageTest = async (videoname, type) => {
  // const video = await getAvailableVideoAndType(videoname, type);
  // if (!video) {
  //   console.log('Video not found on database, check name');
  //   return null;
  // }
  const allServer = await getAllServers();

  let testResults = [];
  for (let i = 0; i < allServer.length; i++) {
    let speedDownload;
    if (type === 'HLS') {
      speedDownload = checkTestErrorCode(
        await getMyNetworkStorageSpeed(allServer[i].URL, allServer[i].port, videoname + 'Hls')
      );
    } else if (type === 'DASH') {
      speedDownload = checkTestErrorCode(
        await getMyNetworkStorageSpeed(allServer[i].URL, allServer[i].port, videoname + 'Dash')
      );
    }
    testResults.push({ ...speedDownload, URL: allServer[i].URL, port: allServer[i].port });
  }
  return testResults;
};

const availableStorage = async (videoname, type) => {
  const video = await getAvailableVideoAndType(videoname, type);
  // if (!video) {
  //   console.log('Video not found on database, check name');
  //   return null;
  // }
  const availableServersStorage = await getAvailableServersStorage(video);
  return availableServersStorage;
};

const getAvailableVideoAndType = async (videoname, type) => {
  console.log(videoname);
  const availVideoAndType = await Video.findOne({ videoname: videoname, type: type });

  return availVideoAndType;
};
// const getAvailableHls = async (videoname) => {
//   console.log(videoname)
//   const availHls = await Video.findOne({ videoname: videoname, type: 'HLS' });

//   return availHls;
// };
// const getAvailableDash = async (videoname) => {
//   const availDash = await Video.findOne({ videoname: videoname, type: 'DASH' });
//   return availDash;
// };
const getAvailableRTMPUrlAndPort = async () => {
  return availTestRTMP;
};
// const getAvailableDeleteUrlAndPort = async () => {
//   return availTestDelete;
// };
// const getVideoAvailableLocation = async () => {
//   return availTestHls;
// };

// const _protocol = (url) => {
//   var u = new URL(url);
//   return u.protocol === 'http:' ? http : https;
// };

const calculateTime = async (baseUrl) => {
  try {
    const fileSizeInBytes = 100000; // ~ 0,1 mb
    const startTime = new Date().getTime();
    const { data } = await axios.get(baseUrl, {
      timeout: 300, // Set a timeout of 0,3 seconds
    });
    // console.log(data);
    const endTime = new Date().getTime();
    const duration = (endTime - startTime) / 1000;
    const bitsLoaded = fileSizeInBytes * 8;
    const bps = (bitsLoaded / duration).toFixed(2);
    const kbps = (bps / 1000).toFixed(2);
    const mbps = (kbps / 1000).toFixed(2);
    return { duration, bps, kbps, mbps };
  } catch (err) {
    // const endTime = new Date().getTime();
    // const duration = (endTime - startTime) / 1000;
    return { ...err };
  }
};

const calculateTimeStorage = async (baseUrl) => {
  try {
    const startTime = new Date().getTime();
    const { data } = await axios.get(baseUrl, {
      timeout: 500, // Set a timeout of 0,5 seconds
    });
    // console.log(data);
    const endTime = new Date().getTime();
    const duration = (endTime - startTime) / 1000;
    return { ...data, duration };
  } catch (err) {
    // const endTime = new Date().getTime();
    // const duration = (endTime - startTime) / 1000;
    return { ...err };
  }
};

const getMyNetworkDownloadSpeedHls = async (url, port, videoname) => {
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
  const baseUrl = 'http://' + url + port + '/videos/' + videoname + 'Hls/' + videoname + '.m3u8';
  return calculateTime(baseUrl);
};

const getMyNetworkDownloadSpeedDash = async (url, port, videoname) => {
  const baseUrl = 'http://' + url + port + '/videos/' + videoname + 'Dash/init.mpd';
  return calculateTime(baseUrl);
};

const getMyNetworkStorageSpeed = async (url, port, videofolder) => {
  const baseUrl = 'http://' + url + port + '/api/v1/check/folder/' + videofolder;
  return calculateTimeStorage(baseUrl);
};

const checkTestErrorCode = (result) => {
  if (result.code && result.code === 'ECONNREFUSED') {
    return { url: result.config.url, message: 'ECONNREFUSED' };
  } else {
    return result;
  }
};

exports.GetAvailableServerHls = catchAsync(async (req, res, next) => {
  console.log('check hls server');
  console.log(req.query);
  const videoname = req.query.videoname;
  const indexServer = req.query.index || 0;

  // if (!indexServer || !videoname) {
  //   res.status(200).json({
  //     message: 'Index server or videoname missing',
  //   });
  //   return;
  // }
  // const video = await getAvailableHls(videoname);
  // console.log(video);

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

  // if (!video) {
  //   res.status(200).json({
  //     message: 'Video not found on database, check name',
  //   });
  //   return;
  // }
  // const availableServer = await getAvailableServer();
  // const numberOfServers = availableServer.length;
  // console.log(numberOfServers);
  // if (numberOfServers <= indexServer) {
  //   res.status(200).json({
  //     message: 'Server index exceed current available servers',
  //   });
  //   return;
  // }
  const server = await availableVideoOnServer(videoname, 'HLS');

  const url = server[indexServer].URL;
  const port = server[indexServer].port;
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
  const indexServer = req.query.index || 0;
  // if (!indexServer || !videoname) {
  //   res.status(200).json({
  //     message: 'Index server or videoname missing',
  //   });
  //   return;
  // }
  // const video = await getAvailableDash(videoname);
  // console.log(video);
  // if (!video) {
  //   res.status(200).json({
  //     message: 'Video not found on database, check name',
  //   });
  //   return;
  // }
  // const availableServer = await getAvailableServer();
  // const numberOfServers = availableServer.length;
  // if (numberOfServers <= indexServer) {
  //   res.status(200).json({
  //     message: 'Server index exceed current available servers',
  //   });
  //   return;
  // }

  const server = await availableVideoOnServer(videoname, 'DASH');

  const url = server[indexServer].URL;
  const port = server[indexServer].port;
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

const testSpeedResults = async (videoname, type) => {
  const video = await getAvailableVideoAndType(videoname, type);
  if (!video) {
    console.log('Video not found on database, check name');
    return null;
  }
  const availableServer = await getAvailableServer(video);
  if (availableServer.length === 0) {
    console.log('Not found any server');
    return null;
  }
  let testResults = [];
  for (let i = 0; i < availableServer.length; i++) {
    let speedDownload;
    if (type === 'HLS') {
      speedDownload = checkTestErrorCode(
        await getMyNetworkDownloadSpeedHls(availableServer[i].URL, availableServer[i].port, videoname)
      );
    } else if (type === 'DASH') {
      speedDownload = checkTestErrorCode(
        await getMyNetworkDownloadSpeedDash(availableServer[i].URL, availableServer[i].port, videoname)
      );
    }

    testResults.push({ ...speedDownload, URL: availableServer[i].URL, port: availableServer[i].port });
  }
  return testResults;
};

exports.CheckSpeedHLS = catchAsync(async (req, res, next) => {
  console.log('check speed');
  const videoname = req.params.filename;
  const testResults = await testSpeedResults(res, videoname, 'HLS');

  res.status(400).json({
    message: 'found video',
    downloadSpeeds: testResults,
  });
});

exports.CheckSpeedDASH = catchAsync(async (req, res, next) => {
  console.log('check speed');
  const videoname = req.params.filename;
  const testResults = await testSpeedResults(res, videoname, 'DASH');
  res.status(400).json({
    message: 'found video',
    downloadSpeeds: testResults,
  });
});

const sortAvailableVideoOnServer = (results) => {
  if (results === null || results.length === 0) {
    return null;
  }
  try {
    return results
      .filter((downloadSpeed) => {
        return downloadSpeed.duration;
      })
      .sort((a, b) => a.duration - b.duration);
  } catch (err) {
    console.log(err);
    return null;
  }
};

const availableVideoOnServer = async (videoname, type) => {
  const testResults = await testSpeedResults(videoname, type);
  const availableVideoOnServer = sortAvailableVideoOnServer(testResults);
  console.log('111111111111111111111111');
  console.log(availableVideoOnServer);
  if (availableVideoOnServer === null) {
    return [];
  }
  return availableVideoOnServer;
};

const availableStorageOnServer = async (videoname, type) => {
  // const availableStorageOnServer = await availableStorageTest(videoname, type);
  const availableStorageOnServer =await availableStorage(videoname,type);
  console.log('2222222222222222222222222');
  console.log(availableStorageOnServer);
  if (availableStorageOnServer === null) {
    return [];
  }
  return availableStorageOnServer;
};

exports.RedirectHls = catchAsync(async (req, res, next) => {
  console.log('redirect');
  const videoname = req.params.filename;
  console.log(videoname);
  // const video = await getAvailableHls(videoname);
  // // console.log(video);
  // if (!video) {
  //   res.status(200).json({
  //     message: 'Video not found on database, check name',
  //   });
  //   return;
  // }
  // const availableServer = await getAvailableServer();
  // if (availableServer.length === 0) {
  //   res.status(200).json({
  //     message: 'Not found any server',
  //   });
  //   return;
  // }
  // const testResults = await testSpeedHlsResults(availableServer, video);
  // const availableVideoOnServer = sortAvailableVideoOnServer(testResults);
  // console.log(availableVideoOnServer);
  const server = await availableVideoOnServer(videoname, 'HLS');
  if (server.length === 0) {
    res.status(200).json({
      message: 'Not found Server with Video, check name or server connections',
    });
    return;
  }
  const index = 0;
  const url = server[index].URL || 'localhost';
  const port = server[index].port || ':9100';

  const oriURL = 'http://' + url + port + '/videos/' + videoname + 'Hls/' + videoname + '.m3u8';
  if (req.headers.myaxiosfetch) {
    res.status(200).json({
      url: oriURL,
    });
    res.end();
    return;
  }
  res.redirect(oriURL);
  res.end();
});

exports.RedirectDash = catchAsync(async (req, res, next) => {
  const videoname = req.params.filename;
  // const video = await getAvailableDash(videoname);
  // if (!video) {
  //   res.status(200).json({
  //     message: 'Video not found on database, check name',
  //   });
  //   return;
  // }
  // const availableServer = await getAvailableServer();
  // if (availableServer.length === 0) {
  //   res.status(200).json({
  //     message: 'Not found any server',
  //   });
  //   return;
  // }
  // const testResults = await testSpeedDashResults(availableServer, video);
  // const availableVideoOnServer = sortAvailableVideoOnServer(testResults);
  // console.log(availableVideoOnServer);
  const server = await availableVideoOnServer(videoname, 'DASH');
  if (server.length === 0) {
    res.status(200).json({
      message: 'Not found Server with Video, check name or server connections',
    });
    return;
  }
  const index = 0;
  const url = server[index].URL || 'localhost';
  const port = server[index].port || ':9100';
  const oriURL = 'http://' + url + port + '/videos/' + videoname + 'Dash/init.mpd';
  if (req.headers.myaxiosfetch) {
    console.log('req.headers.myaxiosfetch existed');
    console.log(oriURL);
    res.status(200).json({
      subserverurl: oriURL,
    });
    res.end();
    return;
  }
  console.log(oriURL);
  res.redirect(oriURL);
  res.end();
});

const countVideoAccessing = async (videoname, url, port, type) => {
  console.log('Accessing video ' + videoname + ' on ' + url + port + ' with type ' + type);
};

exports.M4SHandler = catchAsync(async (req, res, next) => {
  console.log('m4s handler');
  const url = 'localhost';
  const port = ':9100';
  const filebasename = req.params.filenamebase;
  req.url = req.url.replace('/dash/', '/videos/');
  req.url = req.url.replace(filebasename, filebasename + 'Dash');
  const oriURL = 'http://' + url + port + req.url;
  console.log(oriURL);

  res.redirect(oriURL);
  res.end();
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
  const availableServer = await getAvailableServer();
  const index = 0;
  // const url = availableServer[index].URL || 'localhost';
  // const port = availableServer[index].port || ':9100';
  const url = 'localhost';
  const port = ':9100';
  console.log({ url, port });
  res.redirect(308, 'http://' + url + port + '/api/v1/replicate/send');
  res.end();
});

exports.RedirectDeleteRequest = catchAsync(async (req, res, next) => {
  console.log('redirect post replicate');
  console.log(req.body);
  const availableServer = await getAvailableServer();
  const index = 0;
  // const url = availableServer[index].URL || 'localhost';
  // const port = availableServer[index].port || ':9100';
  const url = 'localhost';
  const port = ':9100';
  res.redirect(308, 'http://' + url + port + '/api/v1/delete');
  res.end();
});

exports.RedirectReplicateFolderRequest = catchAsync(async (req, res, next) => {
  console.log('redirect post replicate');
  console.log(req.body);
  const availableServer = await getAvailableServer();
  const index = 0;
  // const url = availableServer[index].URL || 'localhost';
  // const port = availableServer[index].port || ':9100';
  const url = 'localhost';
  const port = ':9100';
  res.redirect(308, 'http://' + url + port + '/api/v1/replicate/send-folder');
  res.end();
});
exports.RedirectDeleteFolderRequest = catchAsync(async (req, res, next) => {
  console.log('redirect post replicate');
  console.log(req.body);
  const availableServer = await getAvailableServer();
  const index = 0;
  // const url = availableServer[index].URL || 'localhost';
  // const port = availableServer[index].port || ':9100';
  const url = 'localhost';
  const port = ':9100';
  res.redirect(308, 'http://' + url + port + '/api/v1/delete/folder');
  res.end();
});

const sendConcateRequest = async (fullUrl, arrayChunkName, orginalname) => {
  return await axios({
    method: 'post',
    url: fullUrl,
    data: {
      arraychunkname: arrayChunkName,
      filename: orginalname,
    },
  })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
};

const SendFileToOtherNodeAndConvertToHls = async (
  url,
  port,
  arrayChunkName,
  filename,
  destination,
  ext,
  orginalname
) => {
  try {
    const filePath = './' + destination + filename;
    console.log('sending file ' + filePath);

    console.log(filePath);
    console.log(fs.existsSync(filePath));
    const readStream = fs.createReadStream(filePath);
    var form = new FormData();
    form.append('myMultilPartFileChunk', readStream);
    form.append('arraychunkname', JSON.stringify(arrayChunkName));
    console.log('begin send to other node');

    // const { data:send } = await axios({
    //   method: 'post',
    //   url: url + port + '/api/v1/replicate/receive',
    //   data: form,
    //   headers: { ...form.getHeaders(), chunkname: filename, ext },
    //   maxContentLength: Infinity,
    //   maxBodyLength: Infinity,
    // });
    // if(send.message == 'enough for concate'){
    //   const { data:concate } = await axios({
    //     method: 'post',
    //     url: url + port + '/api/v1/replicate/concate-hls',
    //     data: {
    //       arraychunkname: arrayChunkName,
    //       filename: filename,
    //     },
    //   });
    //   console.log(concate);
    // }

    await axios({
      method: 'post',
      url: url + port + '/api/v1/replicate/receive',
      data: form,
      headers: { ...form.getHeaders(), chunkname: filename, ext },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    })
      .then(function (response) {
        const data = response.data;
        console.log(data);
        if (data.message == 'enough for concate') {
          setTimeout(async () => {
            await sendConcateRequest(url + port + '/api/v1/replicate/concate-hls', arrayChunkName, orginalname);
          }, 5000);
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    console.log('begin delete');
    fs.unlinkSync(filePath);
    console.log('complete delete ' + filePath);
  } catch (err) {
    console.timeLog(err);
  }
};

const SendFileToOtherNodeAndConvertToDash = async (
  url,
  port,
  arrayChunkName,
  filename,
  destination,
  ext,
  orginalname
) => {
  try {
    const filePath = './' + destination + filename;
    console.log('sending file ' + filePath);

    console.log(filePath);
    console.log(fs.existsSync(filePath));
    const readStream = fs.createReadStream(filePath);
    var form = new FormData();
    form.append('myMultilPartFileChunk', readStream);
    form.append('arraychunkname', JSON.stringify(arrayChunkName));

    // const { data } = await axios({
    //   method: 'post',
    //   url: url + port + '/api/v1/replicate/receive',
    //   data: form,
    //   headers: { ...form.getHeaders(), chunkname: filename, ext },
    //   maxContentLength: Infinity,
    //   maxBodyLength: Infinity,
    // });

    console.log('begin send to other node');

    await axios({
      method: 'post',
      url: url + port + '/api/v1/replicate/receive',
      data: form,
      headers: { ...form.getHeaders(), chunkname: filename, ext },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    })
      .then(function (response) {
        console.log(response.data);
        const data = response.data;
        if (data.message == 'enough for concate') {
          setTimeout(async () => {
            await sendConcateRequest(url + port + '/api/v1/replicate/concate-dash', arrayChunkName, orginalname);
          }, 5000);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    console.log('begin delete');
    fs.unlinkSync(filePath);
    console.log('complete delete ' + filePath);
  } catch (err) {
    console.timeLog(err);
  }
};

const ConcateFile = async (filename, arrayChunkName, ext, destination) => {
  console.log('file is completed, begin concat');
  arrayChunkName.forEach(async (chunkName) => {
    const data = fs.readFileSync('./' + destination + chunkName);
    fs.appendFileSync('./' + destination + filename + '.' + ext, data);
    console.log('complete append');
    console.log('begin send to other node');
    console.log('begin delete');
    fs.unlinkSync('./' + destination + chunkName);
    console.log('complete delete ' + chunkName);
  });
  console.log({
    path: destination + filename + '.' + ext,
    destination,
    filename: filename + '.' + ext,
  });
};

const createVideo = async (videoname, type) => {
  const video = await Video.create({  videoname, type });
  return video;
};

const createServer = async (URL, port) => {
  const server = await Server.create({ URL,  port });
  return server;
};

const getServerWithURLAndPort=async(URL,port)=>{
  console.log('87897')
  console.log({URL,port})
  const server = await Server.findOne({ URL,port});
  console.log(server)
  return server;
}

const addToServer = async (video, URL,port) => {
  const fullServer = await getServerWithURLAndPort( URL,port);
  fullServer.videos.push(video);
  await fullServer.save()
  return fullServer;
};

const checkFolderOnServer=async(baseUrl)=>{
  console.log(baseUrl);
  const { data } = await axios.get(baseUrl);
  return data;
}

exports.UploadNewFileLargeMultilpartHls = catchAsync(async (req, res, next) => {
  console.log('Dealing with request UploadNewFileLargeMultilpartHls');
  console.log(req.headers);
  const file = req.file;
  const destination = file.destination;
  const ext = req.headers.ext;
  let arrayChunkName = req.body.arraychunkname.split(',');
  let flag = true;
  let filename = req.headers.filename + '_' + req.headers.index;
  let orginalname = req.headers.filename + '.' + ext;
  let chunkname = req.headers.chunkname;
  arrayChunkName.forEach((chunkName) => {
    if (!fs.existsSync(destination + chunkName)) {
      flag = false;
    }
  });

  // const availableStoreServer= await availableStorageOnServer(req.headers.filename,'HLS');
  // if(availableStoreServer.length===0){
  //   res.status(200).json({
  //     message: 'File is everywhere on the servers system!',
  //   });
  //   return;
  // }
  const index = 0;
  const url = req.body.url || 'http://localhost';
  const port = req.body.port || ':9100';
  // const url = availableStoreServer[index].URL || 'http://localhost';
  // const port = availableStoreServer[index].port || ':9100';
  const baseUrl = url + port + '/api/v1/check/folder/' + filename + 'Hls';
  const check=await checkFolderOnServer(baseUrl);
  if (check.existed === true) {
    res.status(200).json({
      message: 'Folder already existed on sub server',
      check,
    });
    return;
  }

  if (flag) {
    console.log('file is completed');
    arrayChunkName.forEach(async (chunkName) => {
      console.log({ index, url, port, chunkName, ext, destination, orginalname });
      await SendFileToOtherNodeAndConvertToHls(url, port, arrayChunkName, chunkName, destination, ext, orginalname);
    });

    const newVideo = await createVideo(req.headers.filename, 'HLS');
    const addVideoToServer=await addToServer(newVideo,url.split('//')[1],port);


    res.status(201).json({
      message: 'success full upload',
      filename,
      destination,
      full: true,
      addVideoToServer,
    });
  } else {
    console.log('file is not completed');

    res.status(201).json({
      message: 'success upload chunk',
      chunkname,
      destination,
      full: false,
    });
  }

  // res.redirect('http://' + url + port + '/api/v1/video/upload-video-large-multipart');
});

exports.UploadNewFileLargeMultilpartDash = catchAsync(async (req, res, next) => {
  console.log('Dealing with request UploadNewFileLargeMultilpartDash');
  console.log(req.headers);
  const file = req.file;
  const destination = file.destination;
  const ext = req.headers.ext;
  let arrayChunkName = req.body.arraychunkname.split(',');
  let flag = true;
  let filename = req.headers.filename + '_' + req.headers.index;
  let orginalname = req.headers.filename + '.' + ext;
  let chunkname = req.headers.chunkname;
  arrayChunkName.forEach((chunkName) => {
    if (!fs.existsSync(destination + chunkName)) {
      flag = false;
    }
  });

  // const availableStoreServer= await availableStorageOnServer(req.headers.filename,'DASH');
  // if(availableStoreServer.length===0){
  //   res.status(200).json({
  //     message: 'File is everywhere on the servers system!',
  //   });
  //   return;
  // }
  const index = 0;
  const url = req.body.url || 'http://localhost';
  const port = req.body.port || ':9100';
  // const url = availableStoreServer[index].URL || 'http://localhost';
  // const port = availableStoreServer[index].port || ':9100';

  const baseUrl = url + port + '/api/v1/check/folder/' + filename + 'Dash';
  const check=await checkFolderOnServer(baseUrl);
  if (check.existed === true) {
    res.status(200).json({
      message: 'Folder already existed on sub server',
      check,
    });
    return;
  }
  if (flag) {
    console.log('file is completed');
    arrayChunkName.forEach(async (chunkName) => {
      console.log({ index, url, port, chunkName, ext, destination, orginalname });
      await SendFileToOtherNodeAndConvertToDash(url, port, arrayChunkName, chunkName, destination, ext, orginalname);
    });

    const newVideo = await createVideo(req.headers.filename, 'DASH');
    const addVideoToServer=await addToServer(newVideo,url.split('//')[1],port);


    res.status(201).json({
      message: 'success full upload',
      filename,
      destination,
      full: true,
      addVideoToServer,
    });
  } else {
    console.log('file is not completed');

    res.status(201).json({
      message: 'success upload chunk',
      chunkname,
      destination,
      full: false,
    });
  }

  // res.redirect('http://' + url + port + '/api/v1/video/upload-video-large-multipart');
});

exports.GetAvailableStorageForVideo = catchAsync(async (req, res, next) => {
  console.log('Dealing with request GetAvailableStorageForVideo');
  const videoname = req.body.videoname || 'GSpR1T8';
  const type = req.body.type || 'HLS';
  const server = await availableStorageOnServer(videoname, type);
  if (server.length === 0) {
    console.log('There is no more available storage, the video and type is everywhere! ' + videoname + ' ' + type);
  }
  const index = 0;
  const url = server[index].URL || 'http://localhost';
  const port = server[index].port || ':9100';
  res.status(200).json({
    message: 'All avaiable servers',
    server,
    videoname,
    type,
  });
});

exports.SendFolderFileToOtherNode = catchAsync(async (req, res, next) => {
  console.log('replicate folder controller');
  const filename = req.body.filename || 'World Domination How-ToHls';
  const videoPath = 'videos/' + filename + '/';
  const url = req.body.url || 'http://localhost';
  const port = req.body.port || ':9200';

  const baseUrl = url + port + '/api/v1/check/folder/' + filename;
  console.log(baseUrl);
  const { data: check } = await axios.get(baseUrl);
  console.log(check);
  if (check.existed === true) {
    res.status(200).json({
      message: 'Folder already existed on sub server',
      check,
    });
    return;
  }
  if (!fs.existsSync(videoPath)) {
    res.status(200).json({
      message: 'File not found',
      path: videoPath,
    });
    return;
  }
  console.log('File found!: ' + videoPath);
  const dir = 'videos/' + filename;
  console.log(dir);
  const fileList = fs.readdirSync(dir);
  console.log(fileList);
  for (let i = 0; i < fileList.length; i++) {
    const filePath = videoPath + '/' + fileList[i];
    console.log(filePath);
    console.log(fs.existsSync(filePath));
    const readStream = fs.createReadStream(filePath);
    var form = new FormData();
    form.append('myFolderFile', readStream);
    const { data } = await axios({
      method: 'post',
      url: url + port + '/api/v1/replicate/receive-folder',
      data: form,
      headers: { ...form.getHeaders(), filename: fileList[i], folder: filename },
    });
    console.log(data);
  }
  res.status(200).json({
    message: 'Folder sent!',
    videoPath,
  });
  return;
});

exports.UploadNewFileLargeMultilpartConcatenate = catchAsync(async (req, res, next) => {
  const availableServer = await getAvailableServer();
  if (availableServer.length === 0) {
    res.status(200).json({
      message: 'Not found any server',
    });
    return;
  }
  const index = 0;
  const url = 'localhost';
  const port = ':9100';
});

exports.UploadNewFileLargeConvertToHls = catchAsync(async (req, res, next) => {
  const file = req.file;
  const filePath = file.path;
  const destination = file.destination;
  const filenameWithoutExt = file.filename.split('.')[0];
  const outputFolder = destination + filenameWithoutExt + 'Hls';
  const outputResult = outputFolder + '/' + filenameWithoutExt + '.m3u8';
  fs.access(outputFolder, (error) => {
    // To check if the given directory
    // already exists or not
    if (error) {
      // If current directory does not exist
      // then create it
      fs.mkdir(outputFolder, (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log('New Directory created successfully !!');
        }
      });
    } else {
      console.log('Given Directory already exists !!');
    }
  });
  console.log(file);
  console.log('Do ffmpeg shit');

  await new ffmpeg()
    .addInput(filePath)
    .outputOptions([
      // '-map 0:v',
      // '-map 0:v',
      // '-map 0:a',
      // '-map 0:a',
      // '-s:v:0 426x240',
      // '-c:v:0 libx264',
      // '-b:v:0 400k',
      // '-c:a:0 aac',
      // '-b:a:0 64k',
      // '-s:v:1 640x360',
      // '-c:v:1 libx264',
      // '-b:v:1 700k',
      // '-c:a:1 aac',
      // '-b:a:1 96k',
      // //'-var_stream_map', '"v:0,a:0 v:1,a:1"',
      // '-master_pl_name '+filenameWithoutExt+'_master.m3u8',
      // '-f hls',
      // '-max_muxing_queue_size 1024',
      // '-hls_time 4',
      // '-hls_playlist_type vod',
      // '-hls_list_size 0',
      // // '-hls_segment_filename ./videos/output/v%v/segment%03d.ts',

      '-c:v copy',
      '-c:a copy',
      //'-var_stream_map', '"v:0,a:0 v:1,a:1"',
      '-level 3.0',
      '-start_number 0',
      '-master_pl_name ' + filenameWithoutExt + '_master.m3u8',
      '-f hls',
      '-hls_list_size 0',
      '-hls_time 10',
      '-hls_playlist_type vod',
      // '-hls_segment_filename ./videos/output/v%v/segment%03d.ts',
    ])
    .output(outputResult)
    .on('start', function (commandLine) {
      console.log('Spawned Ffmpeg with command: ' + commandLine);
    })
    .on('error', function (err, stdout, stderr) {
      console.error('An error occurred: ' + err.message, err, stderr);
    })
    .on('progress', function (progress) {
      console.log('Processing: ' + progress.percent + '% done');
      console.log(progress);
      /*percent = progress.percent;
      res.write('<h1>' + percent + '</h1>');*/
    })
    .on('end', function (err, stdout, stderr) {
      console.log('Finished processing!' /*, err, stdout, stderr*/);
      fs.unlinkSync(filePath, function (err) {
        if (err) throw err;
        console.log(filePath + ' deleted!');
      });
    })
    .run();
});
