const User = require("../models/user.models.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const cloudinary = require("../libs/cloudinary.js");

async function signup(req, res) {
  try {
    const { fullName,  email, password, profile } = req.body;
    if (!fullName) {
      return res.json({ error: "Full Name field is required" });
    }
   
    if (!password) {
      return res.json({
        error: "Password field is required",
      });
    }
    if (password.length < 6) {
      return res.json({
        error: "Password must be atleast 6 characters ",
      });
    }

    if (!email) {
      return res.json({ error: "Email field is required" });
    }
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({ error: "User already exists , Plz Login" });
    }
    bcrypt.genSalt(10, function (error, salt) {
      bcrypt.hash(password, salt, async function (error, hash) {
        const newUser = await User.create({
          fullName,
         
          email,
          password: hash,
          profile,
        });
        const token = jwt.sign({ email: email, userId: newUser._id }, secret, {
          expiresIn: "7d",
        });
        res.cookie("token", token, {
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          sameSite: "none", // Important for cross-origin
          secure: true,
           // Must be false for http://localhost
        });

        return res.json(newUser);
      });
    });
  } catch (error) {
    console.log(error);
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!password) {
      return res.json({
        error: "Password field is required",
      });
    }
    if (password.length < 6) {
      return res.json({
        error: "Password must be atleast 6 characters long",
      });
    }

    if (!email) {
      return res.json({ error: "Email field is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: "invalid credentials" });
    }
    bcrypt.compare(password, user.password, function (error, result) {
      if (!result) {
        return res.json({ error: "invald email or password" });
      }
      if (result) {
        const token = jwt.sign({ email: email, userId: user._id }, secret);
        res.cookie("token", token, {
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          sameSite: "none", // Important for cross-origin
          secure: true, // Must be false for http://localhost
        });

        return res.json(user);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

async function logout(req, res) {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.json({ message: "Logout successful" });
  } catch (error) {
    console.log(error);
  }
}

async function updateProfile(req, res) {
  try {
    const userId = req.user._id;
    const { profile } = req.body;
    if(!profile){

      return res.status(400).json({ error: "Profile picture is required" });
    }

    const upload = await cloudinary.uploader.upload(profile);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profile: upload.secure_url },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    console.log(error);
    return res.json({ error: "An error occurred while updating profile" });
  }
}

function checkAuth(req, res) {
  try {
    return res.json(req.user);
  } catch (error) {
    console.log("❌ checkAuth error:", error);
    return res.status(500).json({
      error: "An error occurred while checking authentication",
    });
  }
}

module.exports = {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
};
