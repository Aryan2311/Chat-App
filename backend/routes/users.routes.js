import express from 'express'
import protectRoute from '../middlewares/protectedRoute.mddleware.js';
import getUsers from '../controllers/users.controller.js';
const userRouter = express.Router();

userRouter.get('/', protectRoute, getUsers );
export default userRouter