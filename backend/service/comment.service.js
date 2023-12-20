// comment.service.js
const Comment = require('../models/comment.model');
const User=require('../models/mongo/User');
// Create a new comment
async function createComment(movieId, conversation) {
  const newComment = new Comment({
    movie: movieId,
    conversation: conversation
  });
  return await newComment.save();
}
async function getCommentsForMovie(movieId) {
  try {
    return await Comment.find({ movie: movieId }).populate({
    path: 'conversation.user',
     model:User
  });
  } catch (error) {
    throw new Error(error.message);
  }
}
// Delete a comment
async function deleteComment(conversationId) {
  return await Comment.updateOne(
    { "conversation._id": conversationId },
    { $pull: { conversation: { _id: conversationId } } }
  );

}
async function updateComment(commentId, newConversationPart) {
  try { let love= {user:newConversationPart.user,text:newConversationPart.text} 
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { $push: { conversation: love } },
      { new: true }
    );
    return updatedComment;
  } catch (error) {
    throw error;
  }
}
module.exports = {
  createComment,
  updateComment,
  getCommentsForMovie,
  deleteComment
};
