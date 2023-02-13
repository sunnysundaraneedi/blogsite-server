import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Post from "../models/PostModel.js";
dotenv.config();

export const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    res.status(404).json({ message: "enter all the fields" });
  }
  const encPassword = await bcrypt.hash(req.body.password, 10);

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: "email already in use" });
    return;
  }

  try {
    const user = await User.create({ userName, email, password: encPassword });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.userName,
        email: user.email,
      });
    } else {
      throw new Error("something went wrong");
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(404).json({ message: "enter all the fields" });
    return;
  }
  const user = await User.findOne({ email });
  const isPwdValid = user && (await bcrypt.compare(password, user.password));
  if (user && isPwdValid) {
    const { _id } = user;
    const token = jwt.sign({ _id }, process.env.KEY);
    res.status(201).json({
      _id: user._id,
      name: user.userName,
      email: user.email,
      token,
    });
  } else {
    res.status(404).json({ message: "Login Failed, incorrect password" });
  }
};

export const getUserProfile = async (req, res) => {
  const { profileID } = req.params;

  try {
    const userProfile = await User.find({ _id: { $eq: profileID } }).select(
      "-password"
    );
    const posts = await Post.find({ author: { $eq: profileID } });

    res.status(200).json({ userProfile, posts });
  } catch (error) {
    res.status(404).json({ message: " Failed, try later" });
  }
};
