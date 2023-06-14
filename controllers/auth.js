const User = require("../models/Users");
const bcrypt = require("bcrypt");

class AuthController {
    
  registerUser = async (req, res) => {
    try {
      // Generate Hashed password
      const salt = await bcrypt.genSalt(10); // no. of rounds=10 here

      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      // Create new user
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });

      //Save user and return response
      const user = await newUser.save();

      res.status(200).json(user);
    } catch (error) {
      console.log("Error in Register User====", error.message);

      res.status(400).json(error.message);
    }
  };

  loginUser = async (req, res) => {
    try {
      // Find user in database
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return res.status(404).json("User not found");
      }

      // Compare password
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!isValidPassword) {
        return res.status(400).json("Wrong password");
      }

      //correct credentials, so send response
      return res.status(200).json(user);
    } catch (error) {
      console.log("Error in Login User====", error.message);

      res.status(400).json(error.message);
    }
  };
}

module.exports = new AuthController();
