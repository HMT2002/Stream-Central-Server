// playlist.controller.js
const playlistService = require('../service/playlist.service');

// Create a new playlist
const createPlaylist = async (req, res) => {
  const { userId, movieArr } = req.body;
  try {
    const newPlaylist = await playlistService.createPlaylist(userId, movieArr);
    res.status(201).json(newPlaylist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get playlist by user, create one if it doesn't exist
const getPlaylist = async (req, res) => {
  const { userId } = req.params;
  try {
    const playlist = await playlistService.getPlaylist(userId);
    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get playlist by user, create one if it doesn't exist
const getAllPlaylist = async (req, res) => {
  const { userId } = req.params;
  try {
    const playlist = await playlistService.getAllPlaylist(userId);
    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update playlist
const updatePlaylist = async (req, res) => {
  const { playlistId, movieArr } = req.body;
  try {
    const updatedPlaylist = await playlistService.updatePlaylist(playlistId, movieArr);
    res.status(200).json(updatedPlaylist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete playlist
const deletePlaylist = async (req, res) => {
  const { playlistId } = req.params;
  try {
    await playlistService.deletePlaylist(playlistId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteMovieFromPlaylist = async (req, res) => {
  const { playlistId, movieId } = req.params;
  try {
    const updatedPlaylist = await playlistService.deleteMovieFromPlaylist(playlistId, movieId);
    res.status(200).json(updatedPlaylist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  createPlaylist,
  getPlaylist,
  updatePlaylist,
  deletePlaylist,
  deleteMovieFromPlaylist,
  getAllPlaylist
};