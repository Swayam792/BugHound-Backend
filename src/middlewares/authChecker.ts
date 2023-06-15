import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../utils/environment";

interface TokenInterface {
    id: string;
    username: String;
}

const authChecker = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        if(!token){
            return res
            .status(401)
            .send({ message: 'No auth token found. Authorization denied.' });
        }

        const decodedToken = jwt.verify(token, JWT_SECRET) as TokenInterface;

        if(!decodedToken.id){
            return res.status(401).send({
                message: 'Token verification failed. Authorization denied.'
            });
        }

        req.user = decodedToken.id;
        next();
    }catch(error: any){
        return res.status(500).send({
            message: error.message
        });
    }
}

export default authChecker;