import React, { useContext, useEffect, useState, useRef } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import SubtitlesOctopus from '../components/subtitles/subtitles-octopus';
import videojs from 'video.js';
import toWebVTT from 'srt-webvtt';
import Card from '../components/UI elements/Card';
import Hls from 'hls.js';
import axios from 'axios';

import {
  POSTVideoUploadAction,
  POSTThreadAction,
  POSTLargeVideoUploadAction,
  POSTLargeVideoMultipartUploadAction,
  POSTLargeVideoMultipartUploadConcatenateAction,
} from '../APIs/thread-apis';
import Button from '../components/UI elements/Button';

import Utils from '../Utils';
import ReactPlayer from 'react-player';

import dashjs from 'dashjs';
import ControlBar from '../components/dashControlBar/ControlBar';
import '../components/dashControlBar/controlbar.css';
import '../components/dashControlBar/icomoon.ttf';
import '../styles/VideoDemo.css';

const getHlsUrl = async (filename) => {
  console.log(filename);
  var url = '/redirect/hls/' + filename;

  const { data } = await axios({
    method: 'get',
    url: url,
    headers: { myaxiosfetch: '123' },
  });
  console.log(data);
  var url = data.subserverurl || 'http://localhost:9100/videos/GSpR1T8Hls/GSpR1T8.m3u8';
  return url;
};
const getDashUrl = async (filename) => {
  var url = '/redirect/dash/' + filename + '/' + filename;

  const { data } = await axios({
    method: 'get',
    url: url,
    headers: { myaxiosfetch: '123' },
  });
  console.log(data);
  var url = data.subserverurl || 'http://localhost:9100/videos/l8NSKXODash/init.mpd';
  return url;
};

const VideoDemo = () => {
  const params = useParams();
  const filename = params.filename;
  const [source, setSource] = useState('/videos/MY Heart Rate.mp4');
  const [reactPlayerURLDash, setReactPlayerURLDash] = useState('');
  const [reactPlayerURLHls, setReactPlayerURLHls] = useState('');

  const videoNormal = useRef();

  const videoDashLinux = useRef();
  const videoDashWindow = useRef(null);
  const playerDashWindow = useRef(null);

  const videoHLS = useRef();

  const videoReactPlayer = useRef();
  useEffect(() => {
    const LoadVideo = async () => {
      try {
        // const config = {
        //   startPosition: 0, // can be any number you want
        // };
        // const urlHls = '/redirect/hls/' + filename;
        // const hls = new Hls(config);
        // hls.loadSource(urlHls);
        // hls.attachMedia(videoHLS.current);
        // hls.subtitleDisplay = true;
        // var obj_play_HLS = {
        //   fill: true,
        //   fluid: true,
        //   autoplay: true,
        //   controls: true,
        //   loop: true,
        // };
        // const _playerHLS = videojs(videoHLS.current, obj_play_HLS, function onPlayerReady() {
        //   videojs.log('Your player is ready!');
        //   const defaultVolume = 0.4;
        //   this.volume(defaultVolume);
        //   this.on('ended', function () {
        //     videojs.log('Awww...over so soon?!');
        //   });
        // });

        // const videoDashWindowCurrent = videoDashWindow.current;

        // if (videoDashWindowCurrent) {
        //   var urlDash = '/redirect/dash/' + filename + '/' + filename;

        //   const { data } = await axios({
        //     method: 'get',
        //     url: urlDash,
        //     headers: { myaxiosfetch: '123' },
        //   });
        //   console.log(data);
        //   //djtme đùa tao vcl
        //   var urlDash = data.subserverurl || 'http://172.30.50.78:9100/videos/l8NSKXODash/init.mpd';

        //   var playerDashWindow = dashjs.MediaPlayer().create();
        //   playerDashWindow.initialize(videoDashWindowCurrent, urlDash, true);
        //   playerDashWindow.attachView(videoDashWindowCurrent);
        //   console.log(playerDashWindow);

        //   playerDashWindow.updateSettings({ debug: { logLevel: dashjs.Debug.LOG_LEVEL_NONE } });
        //   console.log(playerDashWindow);

        //   const controlbar = new ControlBar(playerDashWindow);
        //   // Player is instance of Dash.js MediaPlayer;
        //   controlbar.initialize();
        // }

        var urlDash = await getDashUrl(filename);
        setReactPlayerURLDash(() => {
          return urlDash;
        });

        var urlHls = await getHlsUrl(filename);
        setReactPlayerURLHls(() => {
          return urlHls;
        });
      } catch (error) {
        console.log(error);
        if (playerDashWindow.current) {
          playerDashWindow.current.destroy();
          playerDashWindow.current = null;
        }
      }
    };

    LoadVideo();
  }, []);

  return (
    <React.Fragment>
      <div id="video-demo">
        {/* <video ref={videoHLS} className="video-js"></video> */}

        {/* <ReactPlayer url="https://www.youtube.com/watch?v=5wiykPlwWIo" width="60%" height="500px" /> */}
        <ReactPlayer
          url={reactPlayerURLHls}
          width="60%"
          height="500px"
          autoPlay
          controls
          config={{
            forceHLS: true,
          }}
        />

        <ReactPlayer
          url={reactPlayerURLDash}
          width="60%"
          height="500px"
          autoPlay
          controls
          config={{
            forceDASH: true,
          }}
        />

        {/* <div className="dash-video-player">
          <div className="videoContainer" id="videoContainer">
            <video ref={videoDashWindow} autoPlay loop></video>
            <div id="videoController" className="video-controller unselectable">
              <div id="playPauseBtn" className="btn-play-pause" title="Play/Pause">
                <span id="iconPlayPause" className="icon-play"></span>
              </div>
              <span id="videoTime" className="time-display">
                00:00:00
              </span>
              <div id="fullscreenBtn" className="btn-fullscreen control-icon-layout" title="Fullscreen">
                <span className="icon-fullscreen-enter"></span>
              </div>
              <div id="bitrateListBtn" className="control-icon-layout" title="Bitrate List">
                <span className="icon-bitrate"></span>
              </div>
              <input type="range" id="volumebar" className="volumebar" min="0" max="1" step=".01" />
              <div id="muteBtn" className="btn-mute control-icon-layout" title="Mute">
                <span id="iconMute" className="icon-mute-off"></span>
              </div>
              <div id="trackSwitchBtn" className="control-icon-layout" title="A/V Tracks">
                <span className="icon-tracks"></span>
              </div>
              <div id="captionBtn" className="btn-caption control-icon-layout" title="Closed Caption">
                <span className="icon-caption"></span>
              </div>
              <span id="videoDuration" className="duration-display">
                00:00:00
              </span>
              <div className="seekContainer">
                <div id="seekbar" className="seekbar seekbar-complete">
                  <div id="seekbar-buffer" className="seekbar seekbar-buffer"></div>
                  <div id="seekbar-play" className="seekbar seekbar-play"></div>
                </div>
              </div>
              <div id="thumbnail-container" className="thumbnail-container">
                <div id="thumbnail-elem" className="thumbnail-elem"></div>
                <div id="thumbnail-time-label" className="thumbnail-time-label"></div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </React.Fragment>
  );
};

export default VideoDemo;
