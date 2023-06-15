import { Request, Response } from "express";
import { userRepository } from "../config/db"; 
import { Not } from "typeorm";

export const getAllUsers = async (req: Request, res: Response) => {
    const users = await userRepository.find({
        where: { id: Not(req.user) },
        select: ['id', 'username'],
    });
    
    res.json(users);
}