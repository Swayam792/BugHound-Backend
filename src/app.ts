import express from "express";
import cors from "cors";
import "express-async-errors";
import errorHanlder from "./middlewares/errorHandler";
import unknownEndPointHanlder from "./middlewares/unKnownEndpoint";
import authRouter from "./routes/authRouter";
import memberRouter from "./routes/memberRouter";
import userRouter from "./routes/userRouter";
import projectRouter from "./routes/projectRouter";
import noteRouter from "./routes/noteRouter";
import bugRouter from "./routes/bugRouter";

const app = express();

app.use(cors({
    origin: "*"
}));
app.use(express.json());

app.use("/", authRouter);
app.use("/users", userRouter);
app.use("/projects",projectRouter);
app.use("/projects", memberRouter);
app.use("/projects", noteRouter);
app.use("/projects", bugRouter);

app.use(errorHanlder);
app.use(unknownEndPointHanlder);

export default app;