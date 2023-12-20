// comment.controller.js
const commentService = require('../service/comment.service');

// Create a new comment
async function createComment(req, res) {
  const { movieId, conversation } = req.body;
  try {
    const newComment = await commentService.createComment(movieId, conversation);
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getCommentsForMovie(req, res) {
  const { commentId } = req.params;
  try {
    const comments = await commentService.getCommentsForMovie(commentId);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
// Delete a comment
async function deleteComment(req, res) {
  const { commentId } = req.params;
  try {
    await commentService.deleteComment(commentId);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}// Update a comment
async function updateComment(req, res) {
  const { commentId } = req.params;
  const { conversation } = req.body;
  try {
    const updatedComment = await commentService.updateComment(commentId, conversation);
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
module.exports = {
  updateComment,
  createComment,
  getCommentsForMovie,
  deleteComment
};
