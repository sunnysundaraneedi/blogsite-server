import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
dotenv.config();

export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.KEY);

    req.user = await User.findById(decoded._id).select("-password");
    next();
  }
};
