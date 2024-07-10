import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { addMessage } from '../controllers/message.controller.js';

const messageRouter = express.Router();

messageRouter.post('/:chatId', verifyToken, addMessage);

export default messageRouter;