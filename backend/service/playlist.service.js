// playlist.service.js
const Playlist = require('../models/playlist.model');
// Create a new playlist
const createPlaylist = async (userId, movieArr) => {
  try {
    const newPlaylist = new Playlist({
      user: userId,
      movieArr: movieArr
    });
    const savedPlaylist = await newPlaylist.save();
    return savedPlaylist;
  } catch (error) {
    throw new Error('Failed to create playlist');
  }
};

// Get playlist by user, create one if it doesn't exist
const getPlaylist = async (userId) => {
  try {
    let playlist = await Playlist.findOne({ user: userId });
    if (!playlist) {
      playlist = await createPlaylist(userId, []); // Create a new playlist with an empty movieArr
    }
    return playlist;
  } catch (error) {
    throw new Error('Failed to get playlist');
  }
};
const getAllPlaylist = async (userId) => {
  try {
    let playlist = await Playlist.find({ user: userId }).populate("movieArr");
    if (!playlist) {
      playlist = await createPlaylist(userId, []); // Create a new playlist with an empty movieArr
    }
    return playlist;
  } catch (error) {
    throw new Error('Failed to get playlist');
  }
};


// Update playlist
const updatePlaylist = async (playlistId, movieArr) => {
  try {
    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId, { movieArr: movieArr }, { new: true });
    return updatedPlaylist;
  } catch (error) {
    throw new Error('Failed to update playlist');
  }
};

// Delete playlist
const deletePlaylist = async (playlistId) => {
  try {
    await Playlist.findByIdAndDelete(playlistId);
  } catch (error) {
    throw new Error('Failed to delete playlist');
  }
};
const deleteMovieFromPlaylist = async (playlistId, movieId) => {
  try {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      throw new Error('Playlist not found');
    }

    playlist.movieArr.pull(movieId); // Remove the movieId from the movieArr

    const updatedPlaylist = await playlist.save();
    return updatedPlaylist;
  } catch (error) {
    throw new Error('Failed to delete movie from playlist');
  }
};

module.exports = {
  getAllPlaylist,
  createPlaylist,
  getPlaylist,
  updatePlaylist,
  deletePlaylist,
  deleteMovieFromPlaylist // New function to delete a single movie from the playlist's movieArr
};