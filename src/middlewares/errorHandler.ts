import { Request, Response, NextFunction } from "express";
import { HttpError } from "http-errors";

const errorHanlder = (error: HttpError, _req: Request, res: Response, next: NextFunction) => {
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).send({ message: 'Invalid token.' });
    } else if (error.message) {
       return res.status(400).send({ message: error.message });
    } else {
        res.status(400).send({ message: 'Something went wrong.' });
    }
    
    next(error);
}

export default errorHanlder;