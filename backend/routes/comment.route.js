// comment.route.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');

// POST /comments
router.post('/', commentController.createComment);
router.get('/:commentId', commentController.getCommentsForMovie);
// PUT /comments/:commentId
router.put('/:commentId', commentController.updateComment);

// DELETE /comments/:commentId
router.delete('/:commentId', commentController.deleteComment);

module.exports = router;
