// playlist.route.js
const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlist.controller');

// Create a new playlist
router.post('/', playlistController.createPlaylist);

// Get playlist by user, create one if it doesn't exist
router.get('/:userId', playlistController.getPlaylist);
router.get('/all/:userId', playlistController.getAllPlaylist);

// Update playlist
router.put('/', playlistController.updatePlaylist);

// Delete playlist
router.delete('/:playlistId', playlistController.deletePlaylist);
router.delete('/:playlistId/movies/:movieId', playlistController.deleteMovieFromPlaylist);

module.exports = router;