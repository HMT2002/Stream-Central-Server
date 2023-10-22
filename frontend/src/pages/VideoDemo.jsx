import React, { useContext, useEffect, useState, useRef } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import SubtitlesOctopus from '../components/subtitles/subtitles-octopus';
import videojs from 'video.js';
import toWebVTT from 'srt-webvtt';
import Card from '../components/UI elements/Card';
import Hls from 'hls.js';
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

const VideoDemo = () => {
  const params = useParams();
  const filename = params.filename;
  const [source, setSource] = useState('/videos/MY Heart Rate.mp4');
  const videoNormal = useRef();

  const videoDashLinux = useRef();
  const videoDashWindow = useRef(null);
  const playerDashWindow = useRef(null);

  const videoHLS = useRef();

  const videoReactPlayer = useRef();
  useEffect(() => {
    const LoadVideo = async () => {
      try {
        const config = {
          startPosition: 0, // can be any number you want
        };
        const url = '/redirect/hls/' + filename;
        const hls = new Hls(config);
        hls.loadSource(url);
        // hls.attachMedia(videoHLS.current);
        hls.attachMedia(videoReactPlayer.current);

        hls.subtitleDisplay = true;
        var obj_play_HLS = {
          fill: true,
          fluid: true,
          autoplay: true,
          controls: true,
          loop: true,
        };
        // const _playerHLS = videojs(videoHLS.current, obj_play_HLS, function onPlayerReady() {
        //   videojs.log('Your player is ready!');
        //   const defaultVolume = 0.4;
        //   this.volume(defaultVolume);
        //   this.on('ended', function () {
        //     videojs.log('Awww...over so soon?!');
        //   });
        // });

        // const videoDashWindowCurrent=videoDashWindow.current;
        // var urlDash = 'http://localhost/tmp_dash/videomusic1080/index.mpd';
        // var playerDashWindow = dashjs.MediaPlayer().create();
        // playerDashWindow.initialize(videoDashWindowCurrent, urlDash, true);
        // playerDashWindow.current.attachView(videoDashWindowCurrent);
        // console.log(playerDashWindow)

        // if (videoDashWindow.current) {
        //   const video = videoDashWindow.current;
        //   var urlDash = 'http://localhost:9100/videos/test/index.mpd';
        //   playerDashWindow.current = dashjs.MediaPlayer().create();

        //   playerDashWindow.current.initialize(video, urlDash, true);
        //   playerDashWindow.current.attachView(video);
        //   console.log(playerDashWindow.current);
        //   if (playerDashWindow.current) {
        //     playerDashWindow.current.updateSettings({ debug: { logLevel: dashjs.Debug.LOG_LEVEL_NONE } });
        //     console.log(video);
        //   }
        //   const controlbar = new ControlBar(playerDashWindow.current);
        //   // Player is instance of Dash.js MediaPlayer;
        //   controlbar.initialize();
        // }
        console.log(videoReactPlayer);
      } catch (error) {
        console.log(error);
        if (playerDashWindow.current) {
          playerDashWindow.current.destroy();
          playerDashWindow.current = null;
        }
      }
    };

    // LoadVideo();
  }, []);

  return (
    <React.Fragment>
      <div id="video-demo">
        {/* <video ref={videoHLS} className="video-js"></video> */}

        {/* <ReactPlayer url="https://www.youtube.com/watch?v=5wiykPlwWIo" width="60%" height="500px" /> */}
        <ReactPlayer
          url="http://localhost:9000/redirect/hls/medium"
          width="60%"
          height="500px"
          autoPlay
          controls
          config={{
            forceHLS: true,
          }}
        />
      </div>
    </React.Fragment>
  );
};

export default VideoDemo;
