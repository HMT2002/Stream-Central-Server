const fs = require('fs');
const path = require('path');
const moment = require('moment');

const Info = require('../models/mongo/Info');

const driveAPI = require('../modules/driveAPI');
const helperAPI = require('../modules/helperAPI');
const imgurAPI = require('../modules/imgurAPI');

const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const axios = require('axios');

exports.GetAll = async () => {
  try {
    const allInfo = await Info.find({}, null, { lean: 'toObject' }).populate('videos');
    for (let i = 0; i < allInfo.length; i++) {
      const info = allInfo[i];
      let filmInfo;
      if (info.filmType === 'TV') {
        filmInfo = await getTV(info.filmID);
      } else {
        filmInfo = await getMovie(info.filmID);
      }
      info.filmInfo = filmInfo;
    }
    return { allInfo };
  } catch (err) {
    console.log(err);
    return { message: 'There is error', isError: true, err };
  }
};

exports.GetTV = async (id) => {
  return await getTV(id);
};

const getTV = async (id) => {
  try {
    const baseUrl = 'https://api.themoviedb.org/3/tv/' + id + '?language=en-US';
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZjI3NmIxYTFmMjY4YmMzMTRhZDYwNTUwNTZkMmI3OCIsInN1YiI6IjY1M2Y1MmM3NTkwN2RlMDBhYzAyNWUxMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.PotdEPOO-3gllIB-zv01LrmAUSSlr7g_6mwiEngvMmE',
      },
    };
    const { data: tv } = await axios.get(baseUrl, options);
    return tv;
  } catch (err) {
    return { message: 'There is error', isError: true, err };
  }
};

exports.QueryTV = async (query) => {
  try {
    const baseUrl =
      'https://api.themoviedb.org/3/search/tv?query=' + query + '&include_adult=false&language=en-US&page=1';
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZjI3NmIxYTFmMjY4YmMzMTRhZDYwNTUwNTZkMmI3OCIsInN1YiI6IjY1M2Y1MmM3NTkwN2RlMDBhYzAyNWUxMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.PotdEPOO-3gllIB-zv01LrmAUSSlr7g_6mwiEngvMmE',
      },
    };
    const { data: tv } = await axios.get(baseUrl, options);
    return tv;
  } catch (err) {
    return { message: 'There is error', isError: true, err };
  }
};

exports.GetMovie = async (id) => {
  return await getMovie(id);
};

const getMovie = async (id) => {
  try {
    const baseUrl = 'https://api.themoviedb.org/3/movie/' + id + '?language=en-US';
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZjI3NmIxYTFmMjY4YmMzMTRhZDYwNTUwNTZkMmI3OCIsInN1YiI6IjY1M2Y1MmM3NTkwN2RlMDBhYzAyNWUxMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.PotdEPOO-3gllIB-zv01LrmAUSSlr7g_6mwiEngvMmE',
      },
    };
    const { data: movie } = await axios.get(baseUrl, options);

    return movie;
  } catch (err) {
    return { message: 'There is error', isError: true, err };
  }
};

exports.QueryMovie = async (query) => {
  try {
    const baseUrl =
      'https://api.themoviedb.org/3/search/movie?query=' + query + '&include_adult=false&language=en-US&page=1';
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZjI3NmIxYTFmMjY4YmMzMTRhZDYwNTUwNTZkMmI3OCIsInN1YiI6IjY1M2Y1MmM3NTkwN2RlMDBhYzAyNWUxMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.PotdEPOO-3gllIB-zv01LrmAUSSlr7g_6mwiEngvMmE',
      },
    };
    const { data: movie } = await axios.get(baseUrl, options);
    return movie;
  } catch (err) {
    return { message: 'There is error', isError: true, err };
  }
};
