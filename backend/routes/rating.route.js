// rating.route.js
const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating.controller');

router.post('/', ratingController.createRating);
router.get('/getfull/:userId', ratingController.getRatingByUserId);
// Get rating by user and movie, create one if it doesn't exist
router.get('/:userId/:movieId', ratingController.getRating);


// Update rating
router.put('/', ratingController.updateRating);

// Delete rating
router.delete('/:ratingId', ratingController.deleteRating);

module.exports = router;