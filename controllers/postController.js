import Post from "../models/PostModel.js";

export const createNew = async (req, res) => {
  const { title, summary, file, content } = req.body;

  const newPost = {
    title,
    summary,
    cover: file,
    content,
    author: req.user._id,
  };

  try {
    let post = await Post.create(newPost);
    post = await post.populate("author", "userName");

    res.status(201).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    let posts = await Post.find()
      .populate("author", "userName")
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(201).json(posts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getSinglePost = async (req, res) => {
  const { postID } = req.params;
  let post = await Post.findById(postID).populate("author", "userName");
  res.status(201).json(post);
};

export const editTask = async (req, res) => {
  const { postID } = req.params;
  const upData = req.body;

  const filter = { _id: postID };
  let updatedPost = await Post.findOneAndUpdate(filter, {
    title: upData.title,
    summary: upData.summary,
    content: upData.content,
  });
  res.status(201).json(updatedPost);
};
