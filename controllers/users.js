const User = require("../models/Users");
const bcrypt = require("bcrypt");
const Activity = require("../models/Activities");

class UserController {
  updateUser = async (req, res) => {
    try {
      const userId = req.body.userId;

      const idToUpdate = req.params.id;

      if (userId != idToUpdate && !req.body.isAdmin) {
        return res.status(403).json("Access Denied");
      }

      //convert plain new password to hashed password
      if (req.body.password) {
        try {
          const salt = await bcrypt.genSalt(10); // no. of rounds=10 here

          req.body.password = await bcrypt.hash(req.body.password, salt);
        } catch (error) {
          console.log("Error in hashing password====", error.message);

          return res.status(400).json(error.message);
        }
      }

      //Now update user
      const updatedUser = await User.findByIdAndUpdate(
        idToUpdate,
        { $set: req.body },
        { new: true }
      );

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.log("Error in update user====", error.message);

      return res.status(400).json(error.message);
    }
  };

  deleteUser = async (req, res) => {
    try {
      const userId = req.body.userId;

      const idToDelete = req.params.id;

      if (userId != idToDelete && !req.body.isAdmin) {
        return res.status(403).json("Access Denied");
      }
      const user = await User.findByIdAndDelete(idToDelete);
      if (!user) {
        return res.status(404).json("User not found");
      }
      return res.status(200).json("User account deleted successfully");
    } catch (error) {
      console.log("Error in delete user====", error.message);

      return res.status(400).json(error.message);
    }
  };

  getUser = async (req, res) => {
    try {
      const idToGet = req.params.id;

      const user = await User.findById(idToGet);

      if (!user) {
        return res.status(404).json("User not found");
      }
      const { password, updatedAt, ...other } = user._doc;

      return res.status(200).json(other);
    } catch (error) {
      console.log("Error in get user====", error.message);

      return res.status(400).json(error.message);
    }
  };

  followUser = async (req, res) => {
    try {
      //get current user and user to follow
      const curUser = await User.findOne({ _id: req.body.userId });

      const userToFollow = await User.findOne({ _id: req.params.id });

      if (!curUser) {
        return res.status(404).json("User not found");
      }
      if (!userToFollow) {
        return res.status(404).json("User to follow not found");
      }
      if (req.body.userId === req.params.id) {
        return res.status(400).json("Cannot follow yourself");
      }
      if (curUser.followings.includes(userToFollow._id)) {
        return res.status(400).json("You already follow this user");
      }

      await User.updateOne(
        { _id: req.body.userId },
        { $push: { followings: userToFollow._id } }
      );

      await User.updateOne(
        { _id: req.params.id },
        { $push: { followers: curUser._id } }
      );

      //mark follow activity
      await Activity.create({
        type: "follow",
        userId: curUser._id,
        targetUserId: userToFollow._id,
      });

      return res.status(200).json("User followed successfully");
    } catch (error) {
      console.log("Error while following user====", error.message);

      return res.status(400).json(error.message);
    }
  };

  unfollowUser = async (req, res) => {
    try {
      //get current user and user to follow
      const curUser = await User.findOne({ _id: req.body.userId });

      const userToFollow = await User.findOne({ _id: req.params.id });

      if (!curUser) {
        return res.status(404).json("User not found");
      }
      if (!userToFollow) {
        return res.status(404).json("User to follow not found");
      }
      if (req.body.userId === req.params.id) {
        return res.status(400).json("You cannot unfollow yourself");
      }
      if (!curUser.followings.includes(userToFollow._id)) {
        return res.status(400).json("You already don't follow this user");
      }

      await User.updateOne(
        { _id: req.body.userId },
        { $pull: { followings: userToFollow._id } }
      );

      await User.updateOne(
        { _id: req.params.id },
        { $pull: { followers: curUser._id } }
      );

      //mark unfollow activity (delete follow activity)
      await Activity.deleteOne({
        type: "follow",
        userId: curUser._id,
        targetUserId: userToFollow._id,
      });

      return res.status(200).json("User unfollowed successfully");
    } catch (error) {
      console.log("Error while unfollowing user ====", error.message);

      return res.status(400).json(error.message);
    }
  };
}

module.exports = new UserController();
