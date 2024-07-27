import express from 'express'
import {sendMessages, getMessages} from '../controllers/messages.controller.js'
import protectRoute from '../middlewares/protectedRoute.mddleware.js'
const messageRouter = express.Router();

messageRouter.post('/send/:id', protectRoute, sendMessages);
messageRouter.get('/chat/:id', protectRoute, getMessages);

export default messageRouter
