import React, { useContext, useEffect, useState, useRef } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import SubtitlesOctopus from '../components/subtitles/subtitles-octopus';
import videojs from 'video.js';
import toWebVTT from 'srt-webvtt';
import Card from '../components/UI elements/Card';
import Hls from 'hls.js';
import ReactPlayer from 'react-player';
import FormData from 'form-data';
import {
  POSTVideoUploadAction,
  POSTThreadAction,
  POSTLargeVideoUploadAction,
  POSTLargeVideoMultipartUploadHlsAction,
  POSTLargeVideoMultipartUploadDashAction,
  POSTLargeVideoMultipartUploadConcatenateAction,
  OPTIONSLargeVideoMultipartUploadAction,
  OPTIONSLargeVideoMultipartUploadConcatenateAction,
  POSTLargeVideoMultipartUploadDashActionVer2,
} from '../APIs/thread-apis';
import Button from '../components/UI elements/Button';

import Utils from '../Utils';

import '../styles/ThreadPage.css';
import axios from 'axios';
const play = {
  fill: true,
  fluid: true,
  autoplay: true,
  controls: true,
  preload: 'metadata',
  loop: true,
  sources: [
    {
      // src: "/videos/convert/7.m3u8",
      src: '',
      type: 'application/x-mpegURL',
    },
  ],
};

const getHlsUrl = async (filename) => {
  console.log(filename);
  var url = '/redirect/hls/' + filename;

  const { data } = await axios({
    method: 'get',
    url: url,
    headers: { myaxiosfetch: '123' },
  });
  console.log(data);
  var subserverurl = data.subserverurl;
  return subserverurl;
};

const getDashUrl = async (filename) => {
  var url = '/redirect/dash/' + filename + '/' + filename;

  const { data } = await axios({
    method: 'get',
    url: url,
    headers: { myaxiosfetch: '123' },
  });
  console.log(data);
  var subserverurl = data.subserverurl;
  return subserverurl;
};

const chunkFormData = (chunk, chunkIndex, chunkName, arrayChunkName, filename, ext) => {
  // const formData = new FormData();
  // formData.append('myMultilPartFileChunk', chunk);
  // formData.append('myMultilPartFileChunkIndex', chunkIndex);
  // formData.append('arraychunkname', arrayChunkName);

  // formData.append('type', 'blob');
  // formData.append('index', chunkIndex);
  // formData.append('chunkname', chunkName);
  // formData.append('filename', filename);
  // formData.append('arrayChunkName', arrayChunkName);
  // formData.append('ext', ext);

  const formData = axios.toFormData({
    myMultilPartFileChunk: chunk,
    myMultilPartFileChunkIndex: chunkIndex,
    arraychunkname: arrayChunkName,
    filename: filename + '.' + ext,
  });
  return formData;
};

async function uploadChunkHls(chunk, chunkIndex, chunkName, arrayChunkName, filename, ext, title, infoID) {
  try {
    const formData = chunkFormData(chunk, chunkIndex, chunkName, arrayChunkName, filename, ext);
    console.log(arrayChunkName);
    const responseHls = await POSTLargeVideoMultipartUploadHlsAction(
      formData,
      chunkIndex,
      chunkName,
      arrayChunkName,
      filename,
      ext,
      title,
      infoID
    );
    console.log(responseHls);
  } catch (error) {
    console.log(error);
  }
}

async function uploadChunkDash(chunk, chunkIndex, chunkName, arrayChunkName, filename, ext, title, infoID) {
  try {
    const formData = chunkFormData(chunk, chunkIndex, chunkName, arrayChunkName, filename, ext);
    console.log(arrayChunkName);
    const responseDash = await POSTLargeVideoMultipartUploadDashAction(
      formData,
      chunkIndex,
      chunkName,
      arrayChunkName,
      filename,
      ext,
      title,
      infoID
    );
    console.log(responseDash);
  } catch (error) {
    console.log(error);
  }
}

async function uploadChunkDashVer2(
  chunk,
  chunkIndex,
  chunkName,
  arrayChunkName,
  filename,
  ext,
  title,
  infoID,
  fullUploadURL
) {
  try {
    const formData = chunkFormData(chunk, chunkIndex, chunkName, arrayChunkName, filename, ext);
    console.log(arrayChunkName);
    const responseDash = await POSTLargeVideoMultipartUploadDashActionVer2(
      formData,
      chunkIndex,
      chunkName,
      arrayChunkName,
      filename,
      ext,
      title,
      infoID,
      fullUploadURL
    );
    console.log(responseDash);
  } catch (error) {
    console.log(error);
  }
}

const loadSubtitleRed5 = async (player, VideoJS_player) => {
  try {
    console.log(player);
    const video = player.current;
    const subASSResponse = await fetch('http://localhost:5080/oflaDemo/ハルジオン.ass', {
      method: 'GET',
    });
    const subSRTResponse = await fetch('http://localhost:5080/oflaDemo/ハルジオン.srt', {
      method: 'GET',
    });
    if (subSRTResponse.status != 500) {
      //oke, cho đến hiện tại chỉ có libass là hỗ trợ hiển thị sub ass thôi, còn srt chả thấy thư viện hay gói nào hỗ trợ hết.
      //nếu người dùng bất đắc dĩ đăng file sub srt thì theo quy trình sau:
      //server nhận SRT , dùng ffmpeg để tổng hợp từ file sub srt và video ra thành hls kèm sub
      console.log(subSRTResponse);
      // const srtSub = await subSRTResponse.text();
      // console.log(srtSub);
      const vtt = await subSRTResponse.blob();
      console.log(vtt);
      const WebVTT_sutitle = await toWebVTT(vtt); // this function accepts a parameer of SRT subtitle blob/file object
      // cái trên là lấy 1
      console.log(WebVTT_sutitle);

      // const localURL = await URL.createObjectURL(vtt);
      VideoJS_player.addRemoteTextTrack({ src: WebVTT_sutitle, kind: 'subtitles', label: 'Vietnamese' }, false);
      // ayda, ngộ là ngộ hiểu rồi nha, be stream file srt về response cho fe, fe chuyển stream nhận đc thành 1 obj blob
      // Dùng obj blob đó cùng phương thức toWebVTT thành blob nguồn(src) cho _player videojs blob:http://localhost:3000/xxxxx-xxx-xxxxxxx-xxxxxxx
    }

    // nếu để ASS ở dưới thì ưu tiên ASS hơn, sẽ tìm cách xét độ ưu tiên sau
    if (subASSResponse.status != 500) {
      var options = {
        video: video, // HTML5 video element
        subUrl: 'http://localhost:5080/oflaDemo/ハルジオン.ass', // Link to subtitles
        // fonts: ['/test/font-1.ttf', '/test/font-2.ttf'], // Links to fonts (not required, default font already included in build)
        fonts: ['/Arial.ttf', '/TimesNewRoman.ttf'],
        workerUrl: process.env.PUBLIC_URL + '/subtitles-octopus-worker.js', // Link to WebAssembly-based file "libassjs-worker.js"
        legacyWorkerUrl: process.env.PUBLIC_URL + '/subtitles-octopus-worker.js', // Link to non-WebAssembly worker
      };
      const SubtitlesOctopus_subtitle = new SubtitlesOctopus(options);
      console.log(SubtitlesOctopus_subtitle);
    }
  } catch (error) {
    console.log(error);
  }
};
const loadSubtitle = async (player, VideoJS_player, videoname) => {
  try {
    console.log(player);
    const video = player.getInternalPlayer();
    console.log(video);
    const subASSResponse = await fetch('/videos/' + videoname + '.ass', {
      method: 'GET',
    });
    const subSRTResponse = await fetch('/videos/' + videoname + '.srt', {
      method: 'GET',
    });
    if (subSRTResponse.status != 500) {
      //oke, cho đến hiện tại chỉ có libass là hỗ trợ hiển thị sub ass thôi, còn srt chả thấy thư viện hay gói nào hỗ trợ hết.
      //nếu người dùng bất đắc dĩ đăng file sub srt thì theo quy trình sau:
      //server nhận SRT , dùng ffmpeg để tổng hợp từ file sub srt và video ra thành hls kèm sub
      console.log(subSRTResponse);
      // const srtSub = await subSRTResponse.text();
      // console.log(srtSub);
      const vtt = await subSRTResponse.blob();
      console.log(vtt);
      const WebVTT_sutitle = await toWebVTT(vtt); // this function accepts a parameer of SRT subtitle blob/file object
      // cái trên là lấy 1
      console.log(WebVTT_sutitle);

      // const localURL = await URL.createObjectURL(vtt);
      // VideoJS_player.addRemoteTextTrack({ src: WebVTT_sutitle, kind: 'subtitles', label: 'Vietnamese' }, false);
      // ayda, ngộ là ngộ hiểu rồi nha, be stream file srt về response cho fe, fe chuyển stream nhận đc thành 1 obj blob
      // Dùng obj blob đó cùng phương thức toWebVTT thành blob nguồn(src) cho _player videojs blob:http://localhost:3000/xxxxx-xxx-xxxxxxx-xxxxxxx
    }

    // nếu để ASS ở dưới thì ưu tiên ASS hơn, sẽ tìm cách xét độ ưu tiên sau
    if (subASSResponse.status != 500) {
      var options = {
        video: video, // HTML5 video element
        subUrl: '/videos/' + videoname + '.ass', // Link to subtitles
        // fonts: ['/test/font-1.ttf', '/test/font-2.ttf'], // Links to fonts (not required, default font already included in build)
        fonts: ['/Arial.ttf', '/TimesNewRoman.ttf'],
        workerUrl: process.env.PUBLIC_URL + '/subtitles-octopus-worker.js', // Link to WebAssembly-based file "libassjs-worker.js"
        legacyWorkerUrl: process.env.PUBLIC_URL + '/subtitles-octopus-worker.js', // Link to non-WebAssembly worker
      };
      const SubtitlesOctopus_subtitle = new SubtitlesOctopus(options);
      console.log(SubtitlesOctopus_subtitle);
    }
  } catch (error) {
    console.log(error);
  }
};

const VideoPageVer4 = () => {
  const params = useParams();
  const threadVideoRef = useRef();
  const videoNode = useRef(null);
  const [player, setPlayer] = useState(null);
  const [play_source, setPlaySource] = useState(null);
  const [threadVideo, setThreadVideo] = useState(null);

  const [reactPlayerURL, setReactPlayerURL] = useState('');
  const [isPlayingDash, setIsPlaying] = useState(false);
  const [info, setInfo] = useState({ videos: [] });
  const [episode, setEpisode] = useState(0);
  const [played, setPlayed] = useState(0);
  const videoReactPlayer = useRef();

  const CreateNewThreadHandler = async () => {
    try {
      console.log('press create new thread btn');
      const file = threadVideo;
      const chunkSize = 30 * 1024 * 1024; // Set the desired chunk size (30MB in this example)
      const fileSize = fileSize;
      const totalChunks = Math.ceil(fileSize / chunkSize);
      // let chunkNameHls = Utils.RandomString(7);
      // let arrayChunkNameHls = [];
      // for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      //   arrayChunkNameHls.push(chunkNameHls + '_' + chunkIndex);
      // }

      // // Iterate over the chunks and upload them sequentially
      // for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      //   const start = chunkIndex * chunkSize;
      //   const end = Math.min(start + chunkSize, fileSize);
      //   const chunk = file.slice(start, end);
      //   console.log(start);
      //   console.log(end);
      //   // Make an API call to upload the chunk to the backend
      //   const ext = file.name.split('.')[1];
      //   await uploadChunkHls(chunk, chunkIndex, arrayChunkNameHls[chunkIndex], arrayChunkNameHls, chunkNameHls, ext);
      // }

      let chunkName = Utils.RandomString(7);
      let arrayChunkName = [];
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        arrayChunkName.push(chunkName + '_' + chunkIndex);
      }

      // // Iterate over the chunks and upload them sequentially
      // for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      //   const start = chunkIndex * chunkSize;
      //   const end = Math.min(start + chunkSize, fileSize);
      //   const chunk = file.slice(start, end);
      //   console.log(start);
      //   console.log(end);
      //   // Make an API call to upload the chunk to the backend
      //   const ext = file.name.split('.')[1];

      //   await uploadChunkHls(chunk, chunkIndex, arrayChunkName[chunkIndex], arrayChunkName, chunkName, ext);
      // }

      var chunkIndex = 0;

      const requestUploadURL = await fetch('/redirect/request-upload-url-dash', {
        method: 'POST',
        mode: 'cors', // no-cors, *cors, same-origin

        body: JSON.stringify({
          filename: chunkName,
          fileSize: fileSize,
        }),
        headers: {
          'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
          filename: chunkName,
          fileSize: fileSize,
        },
      });
      const checkResult = await requestUploadURL.json();
      console.log(checkResult);
      if (checkResult.status === 200) {
        console.log(chunkName);

        const index = 0;
        const uploadURL = checkResult.aliveServers[index].URL;
        const uploadPort = checkResult.aliveServers[index].port || '';
        const fullUploadURL = checkResult.aliveServers[index].uploadURL;
        console.log({ uploadURL, uploadPort, fullUploadURL });
        async function uploadLoop() {
          //  create a loop function
          setTimeout(async function () {
            //  call a 3s setTimeout when the loop is called
            console.log('looping'); //  your code here

            const start = chunkIndex * chunkSize;
            const end = Math.min(start + chunkSize, fileSize);
            const chunk = file.slice(start, end);
            console.log(start);
            console.log(end);
            // Make an API call to upload the chunk to the backend
            const ext = file.name.split('.')[1];
            const title = chunkName;
            const infoID = '654ef92c9f7e923ef27cf32c';
            await uploadChunkDashVer2(
              chunk,
              chunkIndex,
              arrayChunkName[chunkIndex],
              arrayChunkName,
              chunkName,
              ext,
              title,
              infoID,
              fullUploadURL
            );

            chunkIndex++; //  increment the counter
            if (chunkIndex < totalChunks) {
              //  if the counter < totalChunks, call the loop function
              uploadLoop(); //  ..  again which will trigger another
            } //  ..  setTimeout()
          }, 500);
        }
        uploadLoop();
      }

      // const formData = new FormData();
      // formData.append('myMultilPartFile', threadVideo);
      // const response = await POSTLargeVideoMultipartUploadAction(formData);
      // console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  const VideoChangeHandler = async (event) => {
    if (event.target.files.length > 0) {
      const localURL = await URL.createObjectURL(event.target.files[0]);
      setThreadVideo(event.target.files[0]);
      console.log(event.target.files[0]);
    }
  };

  useEffect(() => {
    const LoadVideo = async () => {
      try {
        var urlDash = await getDashUrl(params.videoname);

        setReactPlayerURL(() => {
          return urlDash;
        });
      } catch (error) {
        console.log(error);
      }
    };
    LoadVideo();
  }, []);

  return (
    <React.Fragment>
      <Card className="thread-page__thread">
        <ReactPlayer
          className="w-full bg-gray-900 h-3/5"
          ref={videoReactPlayer}
          url={reactPlayerURL}
          width="80%"
          height="500px"
          autoPlay
          controls
          playing={isPlayingDash}
          onReady={() => {
            const innerPalyer = videoReactPlayer.current.getInternalPlayer();
            console.log(innerPalyer);
            loadSubtitle(videoReactPlayer.current, null, params.videoname);
          }}
          // onSeek={() => console.log('Seeking!')}
          // onBuffer={() => console.log('onBuffer')}
          // onBufferEnd={() => console.log('onBufferEnd')}
          onProgress={(progress) => {
            setPlayed(progress.playedSeconds);
            if (played === 5) {
              // loadSubtitle(videoReactPlayer.current, null, params.videoname);
            }
          }}
          onError={async (event, data, instance, global) => {
            console.log({ event, data, instance, global });
            if (event) {
              console.log('There are Error in videoReactPlayer');
              setIsPlaying(() => {
                return false;
              }); /// dòng này thì chạy đc
              var urlDash = await getDashUrl(params.videoname);

              setReactPlayerURL(() => {
                return urlDash;
              });

              videoReactPlayer.current.seekTo(played); /// cái dòng này không seekTo cái khúc đang coi dở
              setIsPlaying(() => {
                return true; /// dòng này thì chạy đc
              });
            }
          }}
          config={{
            forceDASH: true,
          }}
        />{' '}
      </Card>

      <input ref={threadVideoRef} type="file" accept="video/*|mkv/*.mkv" onChange={VideoChangeHandler} />
      <Button className="workshop-new-thread-tab__complete-btn" content="Upload" onClick={CreateNewThreadHandler} />
    </React.Fragment>
  );
};

export default VideoPageVer4;
