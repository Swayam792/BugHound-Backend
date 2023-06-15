"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("express-async-errors");
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const unKnownEndpoint_1 = __importDefault(require("./middlewares/unKnownEndpoint"));
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const memberRouter_1 = __importDefault(require("./routes/memberRouter"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const projectRouter_1 = __importDefault(require("./routes/projectRouter"));
const noteRouter_1 = __importDefault(require("./routes/noteRouter"));
const bugRouter_1 = __importDefault(require("./routes/bugRouter"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*"
}));
app.use(express_1.default.json());
app.use("/", authRouter_1.default);
app.use("/users", userRouter_1.default);
app.use("/projects", projectRouter_1.default);
app.use("/projects", memberRouter_1.default);
app.use("/projects", noteRouter_1.default);
app.use("/projects", bugRouter_1.default);
app.use(errorHandler_1.default);
app.use(unKnownEndpoint_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map