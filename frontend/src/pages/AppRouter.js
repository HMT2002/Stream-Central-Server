import React, { useContext } from 'react';

import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import HomePage from './HomePage';
import ThreadPage from './ThreadPage';
import AccountPage from './AccountPage';
import VideoDemo from './VideoDemo';

import VideoPage from './VideoPage';
import VideoPageVer2 from './VideoPageVer2';
import VideoPageVer3 from './VideoPageVer3';
import VideoPageVer4 from './VideoPageVer4';
import VideoDash from './VideoDash';

import WorkshopPage from './WorkshopPage';
import TagPage from './TagPage';
import UserPage from './UserPage';
import { GoogleOAuthProvider } from '@react-oauth/google';
import MoviePage from './MoviePage';
import TVPage from './TVPage';
import AuthContext from '../contexts/auth-context';

const AppRouter = () => {
  const authCtx = useContext(AuthContext);

  return (
    <GoogleOAuthProvider clientId="1031226840176-2hfbvd0am0ea3hcapmapeea1tc4ijn0n.apps.googleusercontent.com">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-new-account" element={<RegisterPage />} />
        <Route path="/" exact element={authCtx.isAuthorized ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/movies" exact element={authCtx.isAuthorized ? <MoviePage /> : <Navigate to="/login" />} />
        <Route path="/tv-series" exact element={authCtx.isAuthorized ? <TVPage /> : <Navigate to="/login" />} />
        <Route path="/user/:id" element={authCtx.isAuthorized ? <UserPage /> : <Navigate to="/login" />} />
        <Route path="/tag/:tag" element={authCtx.isAuthorized ? <TagPage /> : <Navigate to="/login" />} />
        <Route path="/thread/:slug" element={authCtx.isAuthorized ? <ThreadPage /> : <Navigate to="/login" />} />
        <Route path="/account/:username" element={authCtx.isAuthorized ? <AccountPage /> : <Navigate to="/login" />} />
        <Route path="/video/:videoname" element={authCtx.isAuthorized ? <VideoPage /> : <Navigate to="/login" />} />
        <Route path="/video-demo/:filename" element={authCtx.isAuthorized ? <VideoDemo /> : <Navigate to="/login" />} />
        <Route
          path="/video-ver-2/:videoname"
          element={authCtx.isAuthorized ? <VideoPageVer2 /> : <Navigate to="/login" />}
        />
        <Route
          path="/video-ver-3/:videoname"
          element={authCtx.isAuthorized ? <VideoPageVer3 /> : <Navigate to="/login" />}
        />
        <Route
          path="/video-ver-4/:videoname"
          element={authCtx.isAuthorized ? <VideoPageVer4 /> : <Navigate to="/login" />}
        />
        <Route
          path="/video-dash/:videoname"
          element={authCtx.isAuthorized ? <VideoDash /> : <Navigate to="/login" />}
        />
        <Route
          path="/workshop/:username"
          element={authCtx.isAuthorized ? <WorkshopPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/workshop/create/thread/:username"
          element={authCtx.isAuthorized ? <WorkshopPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/workshop/dashboard/:username"
          element={authCtx.isAuthorized ? <WorkshopPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/workshop/threads/:username"
          element={authCtx.isAuthorized ? <WorkshopPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/workshop/comments/:username"
          element={authCtx.isAuthorized ? <WorkshopPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/workshop/edit/thread/:slug"
          element={authCtx.isAuthorized ? <WorkshopPage /> : <Navigate to="/login" />}
        />
      </Routes>
    </GoogleOAuthProvider>
  );
};

export default AppRouter;
