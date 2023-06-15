import express from 'express';
import { signUpUser, loginUser } from '../controllers/authController';

const authRouter = express.Router();

authRouter.post('/signup', signUpUser);
authRouter.post('/login', loginUser);

export default authRouter;