const express = require("express");
const authRoute = express.Router();
const AuthController = require("../controllers/auth");

// Register User
authRoute.post("/register", AuthController.registerUser);

// Login User
authRoute.post("/login", AuthController.loginUser);

module.exports = authRoute;
