import express from "express";
import { createPost, deletePost, getPost, getPosts, updatePost } from "../controllers/post.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const postPouter = express.Router();

postPouter.post('/create', verifyToken, createPost);

postPouter.get('/', getPosts);

postPouter.get('/:id', getPost);

postPouter.put('/:id', verifyToken, updatePost);

postPouter.delete('/:id', deletePost);

export default postPouter;