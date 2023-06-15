import express from 'express';
import { getAllUsers } from '../controllers/userController'; 
import authChecker from '../middlewares/authChecker';

const userRouter = express.Router(); 

userRouter.get('/', authChecker, getAllUsers);

export default userRouter;
