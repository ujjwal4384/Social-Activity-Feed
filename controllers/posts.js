const Post = require("../models/Posts");
const User = require("../models/Users");
const Activity = require("../models/Activities");

class PostController {
  createPost = async (req, res) => {
    const newPost = new Post(req.body);
    try {
      const savedPost = await newPost.save();

      // After creating the post, mark post activity
      const activity = await Activity.create({
        type: "post",
        userId: newPost.userId,
        postId: newPost._id,
      });

      console.log("activity====", activity);

      res.status(200).json(savedPost);
    } catch (error) {
      console.log("Error in create post====", error.message);
      res.status(400).json(error.message);
    }
  };

  updatePost = async (req, res) => {
    try {
      //fetch post by postId
      const post = await Post.findById(req.params.id);
      //if this post exist and if exist and is posted by same user, then update it

      if (post && post.userId === req.body.userId) {
        const updatedPost = await post.updateOne({ $set: req.body });

        console.log("updated post====", updatedPost);

        return res.status(200).json("Post updated successfully=====");
      } else if (!post) {
        return res.status(404).json("post not found");
      } else {
        return res.status(403).json("Access Denied to update this post");
      }
    } catch (error) {
      console.log("Error in update post====", error.message);

      res.status(400).json(error.message);
    }
  };

  deletePost = async (req, res) => {
    try {
      //fetch post by postId
      const post = await Post.findById(req.params.id);

      //if this post exist and if exist and is posted by same user, then update it
      if (post && post.userId === req.body.userId) {
        const deletdPost = await post.deleteOne({ $set: req.body });

        console.log("deleted post====", deletdPost);

        return res.status(200).json("Post delelted successfully=====");
      } else if (!post) {
        return res.status(404).json("post not found");
      } else {
        return res.status(403).json("Access Denied to delete this post");
      }
    } catch (error) {
      console.log("Error in update post====", error.message);

      res.status(400).json(error.message);
    }
  };

  likeUnlikePost = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      const userId = req.body.userId;

      if (post) {
        if (!post.likes.includes(userId)) {
          const updatedPost = await post.updateOne({
            $push: { likes: userId },
          });

          console.log("updated post====", updatedPost);

          //mark like post activity
          await Activity.create({
            type: "like",
            userId: userId,
            targetUserId: post.userId,
            postId: post._id,
          });

          console.log("post id liked====", post._id);

          return res.status(200).json("Post liked successfully=====");
        } else {
          //user already liked this post, so either we can unlike it or send response that user already likes.
          //here I have provided unliking feature
          const updatedPost = await post.updateOne({
            $pull: { likes: userId },
          });

          //mark unlike post activity (delete like activity)
          await Activity.deleteOne({
            type: "like",
            userId: userId,
            targetUserId: post.userId,
            postId: post._id,
          });

          console.log("updated post====", updatedPost);

          return res.status(200).json("Post unliked successfully=====");
        }
      } else {
        return res.status(404).json("post not found");
      }
    } catch (error) {
      console.log("Error in like post function ====", error.message);

      res.status(400).json(error.message);
    }
  };

  getPost = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post) {
        return res.status(200).json(post);
      } else {
        return res.status(404).json("post not found");
      }
    } catch (error) {
      console.log("Error in get post function ====", error.message);

      res.status(400).json(error.message);
    }
  };

  getTimelinePosts = async (req, res) => {
    const currentUserId = req.body.userId;

    let postArray = [];

    try {
      const currentUser = await User.findById(currentUserId);
      //get all posts by user
      const userPosts = await Post.find({ userId: currentUser._id });

      //get all posts by user's followings
      let friendPosts = await Promise.all(
        currentUser.followings.map((friendId) => {
          return Post.find({ userId: friendId });
        })
      );

      //concat user posts and friend posts
      postArray = userPosts.concat(...friendPosts);

      return res.status(200).json(postArray);
    } catch (error) {
      console.log("Error in get timeline posts function ====", error.message);

      res.status(400).json(error.message);
    }
  };
}

module.exports = new PostController();
