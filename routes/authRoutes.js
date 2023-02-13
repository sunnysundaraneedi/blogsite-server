import { Router } from "express";
import {
  getUserProfile,
  loginUser,
  registerUser,
} from "../controllers/authController.js";
import {
  createNew,
  editTask,
  getAllPosts,
  getSinglePost,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile/:profileID", getUserProfile);

router.post("/post", protect, createNew);
router.get("/posts", getAllPosts);
router.get("/posts/:postID", getSinglePost);
router.put("/posts/:postID", protect, editTask);

export default router;
