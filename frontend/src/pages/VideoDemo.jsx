import React, { useContext, useEffect, useState, useRef } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import SubtitlesOctopus from '../components/subtitles/subtitles-octopus';
import videojs from 'video.js';
import toWebVTT from 'srt-webvtt';
import Card from '../components/UI elements/Card';
import Hls from 'hls.js';
import ReactPlayer from 'react-player';
import {
  POSTVideoUploadAction,
  POSTThreadAction,
  POSTLargeVideoUploadAction,
  POSTLargeVideoMutilpartUploadAction,
  POSTLargeVideoMutilpartUploadConcatenateAction,
} from '../APIs/thread-apis';
import Button from '../components/UI elements/Button';

import Utils from '../Utils';
import ReactPlayer from 'react-player'

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

  useEffect(() => {
    const LoadVideo = async () => {
      try {
        const config = {
          startPosition: 0, // can be any number you want
        };
<<<<<<< HEAD
        const url='http://localhost:9100/videos/'+filename+'Hls/'+filename+'.m3u8';
=======
        const url =
          'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8';
>>>>>>> HuyV
        const hls = new Hls(config);
        hls.loadSource(url);
        hls.attachMedia(videoHLS.current);
        hls.subtitleDisplay = true;
        var obj_play_HLS = {
          fill: true,
          fluid: true,
          autoplay: true,
          controls: true,
          loop: true,
        };
        const _playerHLS = videojs(videoHLS.current, obj_play_HLS, function onPlayerReady() {
          videojs.log('Your player is ready!');
          const defaultVolume = 0.4;
          this.volume(defaultVolume);
          this.on('ended', function () {
            videojs.log('Awww...over so soon?!');
          });
        });

<<<<<<< HEAD

        
=======
>>>>>>> HuyV
        // const videoDashWindowCurrent=videoDashWindow.current;
        // var urlDash = 'http://localhost/tmp_dash/videomusic1080/index.mpd';
        // var playerDashWindow = dashjs.MediaPlayer().create();
        // playerDashWindow.initialize(videoDashWindowCurrent, urlDash, true);
        // playerDashWindow.current.attachView(videoDashWindowCurrent);
        // console.log(playerDashWindow)
<<<<<<< HEAD
=======

>>>>>>> HuyV
        // if (videoDashWindow.current) {
        //   const video = videoDashWindow.current;
        //   var urlDash = '/redirect/dash/'+filename+'/'+filename;
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
<<<<<<< HEAD
      <Card className="thread-page__thread">
        {/* <video className="video-js thread-page__thread-video" controls src={source} ref={videoNormal} /> */}
        <video ref={videoHLS} className="video-js"></video>
        {/* <video ref={videoDashLinux} className="video-js"></video> */}
        {/* <video className="video-js" src='http://localhost:9100/videos/aa.mp4' autoPlay loop controls></video> */}

        {/* <div className="dash-video-player">
          <div className="videoContainer" id="videoContainer">
            <video ref={videoDashWindow} loop ></video>
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
=======
      <div id="video-demo">
        {/* <ReactPlayer url="https://www.youtube.com/watch?v=5wiykPlwWIo" width="60%" height="500px" /> */}
        <ReactPlayer
          url="https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8"
          width="60%"
          height="500px"
          autoplay
          controls
        />
        {/* {/*          */}
        <Card className="thread-page__thread">
          <video className="video-js thread-page__thread-video" controls src={source} ref={videoNormal} />
          <video ref={videoHLS} className="video-js"></video>
          <video ref={videoDashLinux} className="video-js"></video>
          {/* <video className="video-js" src='http://localhost:9100/videos/aa.mp4' autoPlay loop controls></video> */}
          <div className="dash-video-player">
            <div className="videoContainer" id="videoContainer">
              <video ref={videoDashWindow} loop></video>
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
>>>>>>> HuyV
                </div>
              </div>
            </div>
          </div>
<<<<<<< HEAD
        </div> */}
{/* 
        <ReactPlayer
          url='http://localhost:9100/videos/World Domination How-ToHls/World Domination How-To.m3u8'
          config={{

            file:{
              forceHLS:true
            }
          }}
        /> */}
      </Card>
=======
        </Card>
      </div>
>>>>>>> HuyV
    </React.Fragment>
  );
};

export default VideoDemo;
