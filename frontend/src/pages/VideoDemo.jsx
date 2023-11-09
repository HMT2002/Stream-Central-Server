import React, { useContext, useEffect, useState, useRef } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import SubtitlesOctopus from '../components/subtitles/subtitles-octopus';
import videojs from 'video.js';
import toWebVTT from 'srt-webvtt';
import Card from '../components/UI elements/Card';
import Hls from 'hls.js';
import axios from 'axios';
import logo from '../assets/img/ben10.jpg';

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
import MovieItem from '../components/movieItem/MovieItem';
import SwiperEspisode from '../components/swiper-espisode/swiper-espisode';

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

  const [isPlayingDash, setIsPlayingDash] = useState(false);
  const [isPlayingHls, setIsPlayingHls] = useState(false);

  const playerDashWindow = useRef(null);

  const videoReactPlayer = useRef();
  const videoReactPlayerHls = useRef();
  const videoReactPlayerDash = useRef();

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
        setIsPlayingDash(() => {
          return true;
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

  function checkTypeVideo() {
    switch (1) {
      case 'dash':
        return;
    }
  }
  return (
    <React.Fragment>
      <div className="flex flex-col">
        <div className="w-full bg-gray-900 h-3/5" id="video-demo">
          {/* <video ref={videoHLS} className="video-js"></video> */}

          {/* ReactPlayer lấy video từ ytb để test UI */}
          <div id="video-section" className="mt-10 flex justify-center">
            <ReactPlayer url="https://www.youtube.com/watch?v=5wiykPlwWIo" width="80%" height="500px" />
          </div>
          <div id="change-server-section"></div>
          <div id="episode-section" className="mt-10">
            <SwiperEspisode />
          </div>

          <ReactPlayer
            className="w-full bg-gray-900 h-3/5"
            ref={videoReactPlayerHls}
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
            className="w-full bg-gray-900 h-3/5"
            ref={videoReactPlayerDash}
            url={reactPlayerURLDash}
            width="60%"
            height="500px"
            autoPlay
            controls
            playing={isPlayingDash}
            onSeek={() => console.log('Seeking!')}
            onBuffer={() => console.log('onBuffer')}
            onBufferEnd={() => console.log('onBufferEnd')}
            onError={async (event, data, instance, global) => {
              console.log({ event, data, instance, global });
              if (event.error) {
                console.log('There are Error in videoReactPlayerDash');
                console.log(event.error);
                console.log('videoReactPlayerDash ref');
                console.log(videoReactPlayerDash);
                var urlDash = await getDashUrl(filename);
                setReactPlayerURLDash(() => {
                  return urlDash;
                });
                setIsPlayingDash(() => {
                  return false;
                }); /// dòng này thì chạy đc
                const duration = videoReactPlayerDash.current.getDuration();
                console.log(duration);
                videoReactPlayerDash.current.seekTo(300); /// cái dòng này không seekTo cái khúc đang coi dở
                setIsPlayingDash(() => {
                  return true; /// dòng này thì chạy đc
                });
              }
            }}
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
        <div className="flex flex-col p-6 bg-slate-400">
          <div className="w-full mx-auto md:flex">
            <div className="w-full">
              <img className="mx-auto" src={logo} alt="ben-10-image" />
            </div>
            <div>
              <h2 className="text-center font-bold text-2xl md:text-left">Ben 10: Alien Force</h2>
              <div className="flex justify-around my-7 md:justify-start md:gap-10">
                <p className="px-2 rounded-md border-black border-2 border-solid">HD</p>
                <p>Trailer</p>
                <p>IMDB: 7.3</p>
                <p>23 min</p>
              </div>
              <div>
                <h5 className="font-semibold my-4">Overview:</h5>
                <p>
                  Five years later, 15-year-old Ben Tennyson chooses to once again put on the OMNITRIX and discovers
                  that it has reconfigured his DNA and can now transform him into 10 brand new aliens. Joined by his
                  super-powered cousin Gwen Tennyson and his equally powerful former enemy Kevin Levin, Ben is on a
                  mission to find his missing Grandpa Max. In order to save his Grandpa, Ben must defeat the evil
                  DNALIENS, a powerful alien race intent on destroying the galaxy, starting with planet Earth.
                </p>
              </div>
              <div className="mt-4 md:flex md:gap-10">
                <div>
                  <p>
                    <span className="font-semibold">Released:</span> 2008-04-18
                  </p>
                  <p>
                    <span className="font-semibold">Genre:</span> Action & Adventure, Animation, Family
                  </p>
                  <p>
                    <span className="font-semibold">Casts:</span> Yuri Lowenthal, Greg Cipes, Dee Bradley Baker, Ashley
                    Johnson
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-semibold">Duration:</span> 23 min
                  </p>
                  <p>
                    <span className="font-semibold">Country:</span> United States of America
                  </p>
                  <p>
                    <span className="font-semibold">Production:</span> Cartoon Network Studios
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-5 p-5">
          <h1 className="font-semibold my-4">Related Movies</h1>
          <div className="flex justify-around mx-auto flex-wrap gap-5">
            <MovieItem />
            <MovieItem />
            <MovieItem />
            <MovieItem />
            <MovieItem />
            <MovieItem />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default VideoDemo;
