const express = require("express");
const userRoute = express.Router();
const UserController = require("../controllers/users");

//Update user
userRoute.put("/:id", UserController.updateUser);

//Delete user
userRoute.delete("/:id", UserController.deleteUser);

//Get user
userRoute.get("/:id", UserController.getUser); 

//Follow a user
userRoute.put("/:id/follow", UserController.followUser);


//Unfollow user
userRoute.put("/:id/unfollow", UserController.unfollowUser);


module.exports = userRoute;
