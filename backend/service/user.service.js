const User = require('../models/mongo/User'); // Import the user model

async function updateUser(userId, updateFields) {
  try {
    const user = await User.findById(userId); // Find the user by ID

    if (!user) {
      throw new Error('User not found');
    }

    // Update the user fields based on the provided updateFields
    Object.keys(updateFields).forEach((key) => {
      user[key] = updateFields[key];
    });

    // Save the updated user
    await user.save();
    let data= {
      id: user._id,
      account: user.account,
      avatar: user.photo.link,
      username: user.username,
      phone: user.phone,
      identifyNumber: user.identifyNumber,
      role: user.role || 'guest',

      gender:user.gender
    }
    return data; // Return the updated user
  } catch (error) {
    throw new Error('Error updating user information: ' + error.message);
  }
}


module.exports = {
    updateUser,
  
  };