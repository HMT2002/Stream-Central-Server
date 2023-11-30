const fs = require('fs');
const path = require('path');
const users = JSON.parse(fs.readFileSync('./json-resources/users.json'));
const helperAPI = require('../modules/helperAPI');
const driveAPI = require('../modules/driveAPI');
const firebaseAPI = require('../modules/firebaseAPI');
const redirectAPI = require('../modules/redirectAPI');
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

exports.GetAvailableServerHls = catchAsync(async (req, res, next) => {
  console.log('check hls server');
  console.log(req.query);
  const videoname = req.query.videoname;
  const indexServer = req.query.index || 0;

  const video = await redirectAPI.getAvailableVideoAndType(videoname, 'HLS');

  const server = await redirectAPI.availableVideoOnServer(video);

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
  const video = await redirectAPI.getAvailableVideoAndType(videoname, 'DASH');

  const server = await redirectAPI.availableVideoOnServer(video);

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

exports.CheckSpeedHLS = catchAsync(async (req, res, next) => {
  console.log('check speed');
  const videoname = req.params.filename;
  const testResults = await redirectAPI.testSpeedResults(videoname, 'HLS');

  res.status(400).json({
    message: 'found video',
    downloadSpeeds: testResults,
  });
});

exports.CheckSpeedDASH = catchAsync(async (req, res, next) => {
  console.log('check speed');
  const videoname = req.params.filename;
  const testResults = await redirectAPI.testSpeedResults(videoname, 'DASH');
  res.status(400).json({
    message: 'found video',
    downloadSpeeds: testResults,
  });
});

exports.AllVideoOnServer = catchAsync(async (req, res, next) => {
  console.log('AvailableServerForVideoHls');
  const servers = await Server.find({}).populate('videos');
  if (servers.length === 0) {
    res.status(200).json({
      message: 'Not found any servers',
    });
    return;
  }
  res.status(200).json({
    servers,
  });
});

exports.RedirectHls = catchAsync(async (req, res, next) => {
  console.log('redirect');
  const videoname = req.params.filename;
  const video = await redirectAPI.getAvailableVideoAndType(videoname, 'HLS');
  const server = await redirectAPI.availableVideoOnServer(video);
  if (server.length === 0) {
    res.status(200).json({
      message: 'Not found Server with Video, check name or server connections',
    });
    return;
  }

  const videoNumberOfRequest = video.numberOfRequest;
  video.numberOfRequest += 0.5;
  await video.save();

  if (videoNumberOfRequest === 50 || videoNumberOfRequest === 100) {
    console.log('Request Reached! ' + videoNumberOfRequest);
    const replicateResult = await redirectAPI.ReplicateWhenEnoughRequest(video);
    console.log(replicateResult);
  }

  const index = 0;
  const url = server[index].URL || 'localhost';
  const port = server[index].port || ':9100';
  const oriURL = 'http://' + url + port + '/videos/' + videoname + 'Hls/' + videoname + '.m3u8';
  if (req.headers.myaxiosfetch) {
    res.status(200).json({
      subserverurl: oriURL,
    });
    res.end();
    return;
  }
  res.redirect(oriURL);
  res.end();
});

exports.RedirectLive = catchAsync(async (req, res, next) => {
  console.log('redirect live');
  const videoname = req.params.filename;
  // console.log(video);
  // const server = await redirectAPI.availableLiveOnServer(videoname);
  // if (server.length === 0) {
  //   res.status(200).json({
  //     message: 'Not found Live server, check name or server connections',
  //   });
  //   return;
  // }

  const index = 0;
  // const url = server[index].URL || 'localhost';
  // const port = server[index].port || ':1936';
  const url = 'localhost';
  const port = ':1936';
  const oriURL = 'rtmp://' + url + port + '/live/' + videoname;
  if (req.headers.myaxiosfetch) {
    res.status(200).json({
      subserverurl: oriURL,
    });
    res.end();
    return;
  }
  console.log(oriURL);

  res.redirect(oriURL);
  // res.end();
});

exports.AvailableServerForVideoHls = catchAsync(async (req, res, next) => {
  console.log('AvailableServerForVideoHls');
  const videoname = req.params.filename;
  console.log(videoname);
  const video = await redirectAPI.getAvailableVideoAndType(videoname, 'HLS');

  const servers = await redirectAPI.availableVideoOnServer(video);
  if (servers.length === 0) {
    res.status(200).json({
      message: 'Not found Server with Video, check name or server connections',
    });
    return;
  }
  res.status(200).json({
    servers,
  });
});

exports.AvailableServerForVideoDash = catchAsync(async (req, res, next) => {
  console.log('AvailableServerForVideoDash');
  const videoname = req.params.filename;
  console.log(videoname);
  const video = await redirectAPI.getAvailableVideoAndType(videoname, 'DASH');

  const servers = await redirectAPI.availableVideoOnServer(video);
  if (servers.length === 0) {
    res.status(200).json({
      message: 'Not found Server with Video, check name or server connections',
    });
    return;
  }
  res.status(200).json({
    servers,
  });
});

exports.RedirectDash = catchAsync(async (req, res, next) => {
  const videoname = req.params.filename;
  const video = await redirectAPI.getAvailableVideoAndType(videoname, 'DASH');

  const server = await redirectAPI.availableVideoOnServer(video);
  if (server.length === 0) {
    res.status(200).json({
      message: 'Not found Server with Video, check name or server connections',
    });
    return;
  }

  const videoNumberOfRequest = video.numberOfRequest;
  video.numberOfRequest += 0.5;
  await video.save();

  if (videoNumberOfRequest === 50 || videoNumberOfRequest === 100) {
    console.log('Request Reached! ' + videoNumberOfRequest);
    const replicateResult = await redirectAPI.ReplicateWhenEnoughRequest(video);
    console.log(replicateResult);
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

exports.M4SHandler = catchAsync(async (req, res, next) => {
  console.log('m4s handler');
  // console.log(req);
  const filebasename = req.params.filenamebase;
  const video = await redirectAPI.getAvailableVideoAndType(filebasename, 'DASH');

  const server = await redirectAPI.availableVideoOnServer(video);
  if (server.length === 0) {
    res.status(200).json({
      message: 'Not found Server with Video, check name or server connections',
    });
    return;
  }
  const index = 0;
  const url = server[index].URL || 'localhost';
  const port = server[index].port || ':9100';
  req.url = req.url.replace('/dash/', '/videos/');
  req.url = req.url.replace(filebasename, filebasename + 'Dash');
  const oriURL = 'http://' + url + port + req.url;
  console.log(oriURL);

  res.redirect(oriURL);
  res.end();
});

exports.RedirectReplicateRequest = catchAsync(async (req, res, next) => {
  console.log('redirect post replicate');
  console.log(req.body);
  const filename = req.body.filename || 'mkvmedium';
  const videoname = filename.split('Hls')[0].split('Dash')[0];
  console.log(videoname);
  const video = await Video.findOne({ videoname });
  const availableServer = await redirectAPI.getAvailableServer(video);
  const index = 0;
  const url = availableServer[index].URL || 'localhost';
  const port = availableServer[index].port || ':9100';
  console.log({ url, port });
  res.redirect(308, 'http://' + url + port + '/api/v1/replicate/send');
  res.end();
});

exports.RedirectDeleteRequest = catchAsync(async (req, res, next) => {
  console.log('redirect post delete');
  console.log(req.body);
  const url = req.body.url || 'localhost';
  const port = req.body.port || ':9100';
  res.redirect(308, 'http://' + url + port + '/api/v1/delete');
  res.end();
});

exports.RedirectReplicateFolderRequest = catchAsync(async (req, res, next) => {
  console.log('redirect post replicate folder');
  console.log(req.body);
  const filename = req.body.filename || 'mkvmediumHls';
  const toURL = req.body.url;
  const toPort = req.body.port;
  const videoname = filename.split('Hls')[0].split('Dash')[0];
  const type = filename.split(videoname)[1] === 'Hls' ? 'HLS' : 'DASH';
  // const videoname=filename.split('Hls')[0].split('Dash')[0];
  // console.log(videoname)
  // const video=await Video.findOne({videoname});
  // const availableServer = await getAvailableServer(video);
  // const index = 0;
  // console.log(availableServer)
  // const url =availableServer[index].URL||'localhost';
  // const port =availableServer[index].port||':9100';
  // // nên nhớ 2 port này khác nhau
  // await addToServer(video,toURL,toPort);
  // res.redirect(308, 'http://' + url + port + '/api/v1/replicate/send-folder');

  const redirectURL = await redirectAPI.ReplicateVideoFolder(videoname, type, toURL, toPort);
  if (!redirectURL) {
    res.status(200).json({
      message: 'Not found any available server to replicate',
    });
    return;
  }
  res.redirect(308, redirectURL);
  res.end();
});

exports.RedirectDeleteFolderRequest = catchAsync(async (req, res, next) => {
  console.log('redirect post replicate');
  console.log(req.body);
  const url = req.body.url || 'localhost';
  const port = req.body.port || ':9100';
  res.redirect(308, 'http://' + url + port + '/api/v1/delete/folder');
  res.end();
});

exports.UploadNewFileLargeMultilpartHls = catchAsync(async (req, res, next) => {
  // const result= await redirectAPI.UploadNewFileLargeMultilpartHls(req);
  // res.status(201).json(result);

  console.log('Dealing with request UploadNewFileLargeMultilpartHls');
  console.log(req.headers);
  let { file, destination, ext, arrayChunkName, filename, orginalname, chunkname, title, infoID } =
    redirectAPI.sumUp(req);

  // const file = req.file;
  // const destination = file.destination;
  // const ext = req.headers.ext;
  // let arrayChunkName = req.body.arraychunkname.split(',');
  // let filename = req.headers.filename + '_' + req.headers.index;
  // let orginalname = req.headers.filename + '.' + ext;
  // let chunkname = req.headers.chunkname;
  // let title=req.headers.title;
  // let infoID=req.headers.infoID;

  let flag = true;
  arrayChunkName.forEach((chunkName) => {
    if (!fs.existsSync(destination + chunkName)) {
      flag = false;
    }
  });
  const aliveServers = await redirectAPI.checkFileISExistedOnServerYet(filename, 'HLS');
  console.log(aliveServers);
  if (aliveServers.existed === true) {
    res.status(200).json({
      message: 'Folder already existed on sub server',
      aliveServers,
    });
    return;
  }
  const index = 0;
  const url = aliveServers[index].URL || 'localhost';
  const port = aliveServers[index].port || ':9100';
  // const baseUrl = 'http://' + url + port + '/api/v1/check/folder/' + filename + 'Hls';
  // const check = await redirectAPI.checkFolderOnServer(baseUrl);
  // if (check.existed === true) {
  //   res.status(200).json({
  //     message: 'Folder already existed on sub server',
  //     check,
  //   });
  //   return;
  // }

  if (flag) {
    console.log('file is completed');
    // var chunkIndex = 0;
    // async function uploadLoop() {
    //   //  create a loop function
    //   setTimeout(async function () {
    //     //  call a 3s setTimeout when the loop is called
    //     console.log('looping'); //  your code here
    //     await redirectAPI.SendFileToOtherNodeAndConvertToHls(
    //       'http://' + url,
    //       port,
    //       arrayChunkName,
    //       arrayChunkName[chunkIndex],
    //       destination,
    //       ext,
    //       orginalname
    //     );

    //     chunkIndex++; //  increment the counter
    //     if (chunkIndex < arrayChunkName.length) {
    //       //  if the counter < totalChunks, call the loop function
    //       uploadLoop(); //  ..  again which will trigger another
    //     } //  ..  setTimeout()
    //   }, 500);
    // }
    // await uploadLoop();

    await redirectAPI.upload(index, url, port, arrayChunkName, ext, destination, orginalname, 'HLS');

    const newVideo = await redirectAPI.createVideo(req.headers.filename, 'HLS', title);
    const addVideoToServer = await redirectAPI.addToServer(newVideo, url, port);
    const addVideoToInfo = await redirectAPI.addToInfo(newVideo, infoID);

    res.status(201).json({
      message: 'success full upload',
      filename,
      destination,
      full: true,
      addVideoToServer,
      addVideoToInfo,
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

  let { file, destination, ext, arrayChunkName, filename, orginalname, chunkname, title, infoID } =
    redirectAPI.sumUp(req);
  let flag = true;
  arrayChunkName.forEach((chunkName) => {
    if (!fs.existsSync(destination + chunkName)) {
      flag = false;
    }
  });
  const aliveServers = await redirectAPI.checkFileISExistedOnServerYet(filename, 'DASH');
  console.log(aliveServers);
  if (aliveServers.existed === true) {
    res.status(200).json({
      message: 'Folder already existed on sub server',
      aliveServers,
    });
    return;
  }
  const index = 0;
  const url = aliveServers[index].URL || 'localhost';
  const port = aliveServers[index].port || ':9100';
  if (flag) {
    console.log('file is completed');

    await redirectAPI.upload(index, url, port, arrayChunkName, ext, destination, orginalname, 'DASH');
    const newVideo = await redirectAPI.createVideo(req.headers.filename, 'DASH', title);
    const addVideoToServer = await redirectAPI.addToServer(newVideo, url, port);
    const addVideoToInfo = await redirectAPI.addToInfo(newVideo, infoID);

    res.status(201).json({
      message: 'success full upload',
      filename,
      destination,
      full: true,
      addVideoToServer,
      addVideoToInfo,
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
  const video = await redirectAPI.getAvailableVideoAndType(videoname, type);
  const server = await redirectAPI.availableStorageOnServer(video);
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
  const availableServer = await redirectAPI.getAvailableServer();
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
