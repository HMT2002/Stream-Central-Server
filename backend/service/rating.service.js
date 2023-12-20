// rating.service.js
const Rating = require('../models/rating');
const createRating = async (userId, movieId, point) => {
  try {
    const newRating = new Rating({
      user: userId,
      movie: movieId,
      point: point
    });
    const savedRating = await newRating.save();
    return savedRating;
  } catch (error) {
    throw new Error('Failed to create rating');
  }
};

// Get rating by user and movie, create one if it doesn't exist
const getRating = async (userId, movieId) => {
  try {
    let rating = await Rating.findOne({ user: userId, movie: movieId });
    if (!rating) {
      rating = await createRating(userId, movieId, 0); // Create a new rating with default point 0
    }
    return rating;
  } catch (error) {
    throw new Error('Failed to get rating');
  }
};
const getRatingByUserId = async (userId) => {
  try {
    let rating = await Rating.find({ user: userId }).populate("movie");
    if (!rating) {
      rating = await createRating(userId, movieId, 0); // Create a new rating with default point 0
    }
    return rating;
  } catch (error) {
    throw new Error('Failed to get rating');
  }
};

// Update rating
const updateRating = async (ratingId, point) => {
  try {
    const updatedRating = await Rating.findByIdAndUpdate(ratingId, { point: point }, { new: true });
    return updatedRating;
  } catch (error) {
    throw new Error('Failed to update rating');
  }
};

// Delete rating
const deleteRating = async (ratingId) => {
  try {
    await Rating.findByIdAndDelete(ratingId);
  } catch (error) {
    throw new Error('Failed to delete rating');
  }
};
module.exports = {
  createRating,
  getRating,
  updateRating,
  deleteRating,getRatingByUserId
};