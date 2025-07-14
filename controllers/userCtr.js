const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const registerUser = asyncHandler(async (req, res) => {
  const { country, currency, email, password } = req.body;

  if (!country || !currency || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all required fileds");
  }

  const userExits = await User.findOne({ email });
  if (userExits) {
    res.status(400);
    throw new Error("Email is already exit");
  }

  const user = await User.create({
    country,
    currency,
    email,
    password,
  });

  const token = generateToken(user._id);
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    //expires: new Date(Date.now() + 1000 * 86400),// 1 day
    expires: new Date(Date.now() + 1000 * 3600), //1 hr
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const {
      _id,
      username,
      email,
      photo,
      phone,
      country,
      currency,
      account_type,
      account_level,
      balance,
      isVerified,
      referral_code,
      isBlocked,
    } = user;

    res.status(201).json({
      _id,
      username,
      email,
      photo,
      token,
      account_type,
      account_level,
      country,
      currency,
        phone,
      balance,
      isVerified,
      referral_code,
      isBlocked,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please add Email and Password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not found, Please signUp");
  }

  const passwordIsCorrrect = await bcrypt.compare(password, user.password);

  const token = generateToken(user._id);
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });

  if (user && passwordIsCorrrect) {
    const { _id, name, email, photo, role } = user;
    res.status(201).json({ _id, name, email, photo, role, token });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });

  return res.status(200).json({ message: "Logged out successfully" });
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { firstName, lastName, dateOfBirth } = req.body;

  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.dateOfBirth = dateOfBirth || user.dateOfBirth;

  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    email: updatedUser.email,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    dateOfBirth: updatedUser.dateOfBirth,
    country: updatedUser.country,
    isVerified: updatedUser.isVerified,
    photo: updatedUser.photo,
  });
});



module.exports = {
  registerUser,
  loginUser,
  logoutUser,
    getUserProfile,
    updateUserProfile,
};
