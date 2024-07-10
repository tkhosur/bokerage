import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { deleteUser, getUser, getUsers, profilePosts, savePost, updateUser } from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.get('/users', getUsers);

userRouter.get('/user/:id', verifyToken, getUser);

userRouter.put('/user/:id', verifyToken, updateUser);

userRouter.delete('/user/:id', verifyToken, deleteUser);

userRouter.post('/user/save', verifyToken, savePost);

userRouter.get('/users/profilePosts', verifyToken, profilePosts);

export default userRouter;