import { Request, Response } from "express";
import { userRepository } from "../config/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET } from "../utils/environment";
import { registerValidator, loginValidator } from "../utils/validators";

export const signUpUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const { errors, valid } = registerValidator(username, password);

    if (!valid) {
        return res.send(400).send({
            messaage: Object.values(errors)[0]
        });
    }

    const existingUser = await userRepository.findOne({
        where: {
            username: username
        }
    });

    if (existingUser) {
        return res.send(400).send({
            message: "User already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepository.create({
        username,
        passwordHash: hashedPassword
    });
    await user.save();

    const token = jwt.sign({
        id: user.id,
        username: user.username
    }, JWT_SECRET);

    return res.status(201).json({
        id: user.id,
        username: user.username,
        token,
    });
}

export const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const { errors, valid } = loginValidator(username, password);
    try {

        if (!valid) {
            console.log(errors)
            return res.status(400).send({ message: Object.values(errors)[0] });
        }

        const user = await userRepository.findOne({
            where: {
                username: username
            }
        });

        if (!user) {
            return res.status(401).json({
                message: `User: '${username}' not found.`
            });
        }

        const validPassword = await bcrypt.compare(password, user.passwordHash);

        if (!validPassword) {
            return res.status(401).json({
                message: 'Invalid credentials!'
            });
        }

        const token = jwt.sign({
            id: user.id,
            username: user.username,
        }, JWT_SECRET);

        return res.status(201).json({
            id: user.id,
            username: user.username,
            token
        });
    } catch (err) {
        console.log(err);
        return res.status(500);
    }
}