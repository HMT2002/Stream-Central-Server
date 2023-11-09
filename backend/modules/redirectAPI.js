const fs = require('fs');
const path = require('path');
const helperAPI = require('./helperAPI');
const driveAPI = require('./driveAPI');
const firebaseAPI = require('./firebaseAPI');
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

const getAvailableVideoID = async (id) => {
  const availVideo = await Video.findOne({_id:id });
  return availVideo;
};

const getAvailableServer = async (video) => {
  const servers = await Server.find({ videos: video });
  return servers;
};

const getAvailableVideo = async (videoname, type) => {
  const availVideo = await Video.findOne({ videoname: videoname, type: type });
  return availVideo;
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

const availableStorage = async (video) => {
  // const video = await getAvailableVideoAndType(videoname, type);
  const availableServersStorage = await getAvailableServersStorage(video);
  return availableServersStorage;
};

const getAvailableVideoAndType = async (videoname, type) => {
  const availVideoAndType = await Video.findOne({ videoname: videoname, type: type });
  return availVideoAndType;
};

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

const checkConditionAndFilter = async (baseUrl) => {
  try {
    console.log(baseUrl);
    const { data } = await axios.get(baseUrl, {
      timeout: 500, // Set a timeout of 0,3 seconds
    });
    console.log(baseUrl);
    return { data };
  } catch (err) {
    // console.log( { ...err })
    return null;
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

const getMyNetworkAliveCondition = async (url, port) => {
  const baseUrl = 'http://' + url + port + '/is-this-alive';
  return checkConditionAndFilter(baseUrl);
};

const checkTestErrorCode = (result) => {
  if (result.code && result.code === 'ECONNREFUSED') {
    console.log({ url: result.config.url, message: 'ECONNREFUSED' });
    return null;
  } else {
    return result;
  }
};

const testSpeedResults = async (video) => {
  if (!video) {
    console.log('Video not found on database, check name');
    return [];
  }
  const availableServer = await getAvailableServer(video);
  if (availableServer.length === 0) {
    console.log('Not found any server');
    return [];
  }
  let testResults = [];
  for (let i = 0; i < availableServer.length; i++) {
    let speedDownload;
    if (video.type === 'HLS') {
      speedDownload = checkTestErrorCode(
        await getMyNetworkDownloadSpeedHls(availableServer[i].URL, availableServer[i].port, video.videoname)
      );
    } else if (video.type === 'DASH') {
      speedDownload = checkTestErrorCode(
        await getMyNetworkDownloadSpeedDash(availableServer[i].URL, availableServer[i].port, video.videoname)
      );
    }
    if (speedDownload !== null) {
      testResults.push({ ...speedDownload, URL: availableServer[i].URL, port: availableServer[i].port });
    }
  }

  return testResults;
};

const testServerIsFckingAlive = async () => {
  const availableServer = await getAllServers();
  if (availableServer.length === 0) {
    console.log('Not found any server');
    return null;
  }
  let testResults = [];
  for (let i = 0; i < availableServer.length; i++) {
    condition = await getMyNetworkAliveCondition(availableServer[i].URL, availableServer[i].port);
    console.log({ URL: availableServer[i].URL, port: availableServer[i].port, ...condition });
    if (condition !== null) {
      testResults.push({ ...condition, URL: availableServer[i].URL, port: availableServer[i].port });
    }
  }
  return testResults;
};

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

const availableVideoOnServer = async (video) => {
  const testResults = await testSpeedResults(video);
  const availableVideoOnServer = sortAvailableVideoOnServer(testResults);
  // console.log(availableVideoOnServer);
  if (availableVideoOnServer === null) {
    return [];
  }
  return availableVideoOnServer;
};

const availableStorageOnServer = async (video) => {
  // const availableStorageOnServer = await availableStorageTest(videoname, type);
  const availableStorageOnServer = await availableStorage(video);
  console.log(availableStorageOnServer);
  if (availableStorageOnServer === null) {
    return [];
  }
  return availableStorageOnServer;
};

const ReplicateWhenEnoughRequest = async (video) => {
  const availableStorage = await availableStorageOnServer(video);
  console.log(availableStorage);
  if (availableStorage.length === 0) {
    const message = 'There is no more available server, the video is on every server!';
    console.log(message);
    return message;
  }
  console.log(availableStorage);
  const index = 0;
  const toURL = availableStorage[index].URL;
  const toPort = availableStorage[index].port;
  const redirectURL = await ReplicateVideoFolder(video.videoname, video.type, toURL, toPort);

  const folderType = video.type === 'HLS' ? 'Hls' : 'Dash';
  await axios({
    method: 'post',
    url: redirectURL,
    data: { filename: video.videoname + folderType, url: toURL, port: toPort },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  return redirectURL;
};

const countVideoAccessing = async (videoname, url, port, type) => {
  console.log('Accessing video ' + videoname + ' on ' + url + port + ' with type ' + type);
};

const ReplicateVideoFolder = async (videoname, type, toURL, toPort) => {
  const video = await Video.findOne({ videoname, type });
  const availableServer = await getAvailableServer(video);
  console.log(availableServer);
  console.log(video);
  console.log({ videoname, type });
  if (availableServer.length === 0) {
    return null;
  }
  const index = 0;
  const url = availableServer[index].URL;
  const port = availableServer[index].port;
  // nên nhớ 2 port này khác nhau
  await addToServer(video, toURL, toPort);
  return 'http://' + url + port + '/api/v1/replicate/send-folder';
};

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
    const readStream = fs.createReadStream(filePath);
    var form = new FormData();
    form.append('myMultilPartFileChunk', readStream);
    form.append('arraychunkname', JSON.stringify(arrayChunkName));

    console.log('begin send to other node');
    console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
    console.log({ url, port });

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
    // console.timeLog(err);
  }
};

const createVideo = async (videoname, type,title) => {
  const video = await Video.create({ videoname, type ,title});
  return video;
};

const createServer = async (URL, port) => {
  const server = await Server.create({ URL, port });
  return server;
};

const getServerWithURLAndPort = async (URL, port) => {
  console.log({ URL, port });
  const server = await Server.findOne({ URL, port });
  return server;
};

const addToServer = async (video, URL, port) => {
  const server = await getServerWithURLAndPort(URL, port);
  if (server.videos.includes(video._id)) {
    console.log('Video already on server');
    return server;
  }
  server.videos.push(video);
  await server.save();
  return server;
};

const checkFolderOnServer = async (baseUrl) => {
  console.log(baseUrl);
  const { data } = await axios.get(baseUrl);
  return data;
};

module.exports = {
  checkFolderOnServer,
  addToServer,
  createVideo,
  SendFileToOtherNodeAndConvertToDash,
  SendFileToOtherNodeAndConvertToHls,
  ReplicateVideoFolder,
  ReplicateWhenEnoughRequest,
  availableStorageOnServer,
  availableVideoOnServer,
  testServerIsFckingAlive,
  testSpeedResults,
  getAvailableVideoAndType,
  getAvailableVideo,
  getAvailableServer,
  getAvailableVideoID,
};
