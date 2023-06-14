const express = require("express");
const postRoute = express.Router();
const PostController = require("../controllers/posts");

//create post
postRoute.post("/",PostController.createPost);

//update post
postRoute.put("/:id", PostController.updatePost);

//delete post
postRoute.delete("/:id", PostController.deletePost);

//like / unlike post
postRoute.put("/:id/like", PostController.likeUnlikePost);

//get post
postRoute.get("/:id", PostController.getPost);

//get timeline posts
postRoute.post("/timeline/all", PostController.getTimelinePosts);


module.exports = postRoute;