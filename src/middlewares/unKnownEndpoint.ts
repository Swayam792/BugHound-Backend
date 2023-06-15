import { Request, Response } from "express";

const unknownEndPointHanlder = (_req: Request, res: Response) => {
    res.status(404).send({ message: "unknown endpoint" });
}

export default unknownEndPointHanlder;