// rating.controller.js
const ratingService = require('../service/rating.service');
const createRating = async (req, res) => {
  const { userId, movieId, point } = req.body;
  try {
    const newRating = await ratingService.createRating(userId, movieId, point);
    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get rating by user and movie, create one if it doesn't exist
const getRating = async (req, res) => {
  const { userId, movieId } = req.params;
  try {
    const rating = await ratingService.getRating(userId, movieId);
    res.status(200).json(rating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getRatingByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const rating = await ratingService.getRatingByUserId(userId);
    res.status(200).json(rating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update rating
const updateRating = async (req, res) => {
  const { ratingId, point } = req.body;
  try {
    const updatedRating = await ratingService.updateRating(ratingId, point);
    res.status(200).json(updatedRating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete rating
const deleteRating = async (req, res) => {
  const { ratingId } = req.params;
  try {
    await ratingService.deleteRating(ratingId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createRating,
  getRating,
  updateRating,
  deleteRating,getRatingByUserId
};