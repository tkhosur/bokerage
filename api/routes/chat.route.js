import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { addChat, getChat, getChats, readChat } from '../controllers/chat.controller.js';

const chatRouter = express.Router();

chatRouter.get('/', verifyToken, getChats);

chatRouter.get('/:id', verifyToken, getChat);

chatRouter.post('/', verifyToken, addChat);

chatRouter.get('/read/:id', verifyToken, readChat);

export default chatRouter;