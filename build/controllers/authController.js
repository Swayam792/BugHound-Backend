"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.signUpUser = void 0;
const db_1 = require("../config/db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const environment_1 = require("../utils/environment");
const validators_1 = require("../utils/validators");
const signUpUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const { errors, valid } = (0, validators_1.registerValidator)(username, password);
    if (!valid) {
        return res.send(400).send({
            messaage: Object.values(errors)[0]
        });
    }
    const existingUser = yield db_1.userRepository.findOne({
        where: {
            username: username
        }
    });
    if (existingUser) {
        return res.send(400).send({
            message: "User already exists"
        });
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const user = db_1.userRepository.create({
        username,
        passwordHash: hashedPassword
    });
    yield user.save();
    const token = jsonwebtoken_1.default.sign({
        id: user.id,
        username: user.username
    }, environment_1.JWT_SECRET);
    return res.status(201).json({
        id: user.id,
        username: user.username,
        token,
    });
});
exports.signUpUser = signUpUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const { errors, valid } = (0, validators_1.loginValidator)(username, password);
    if (!valid) {
        return res.status(400).send({ message: Object.values(errors)[0] });
    }
    const user = yield db_1.userRepository.findOne({
        where: {
            username: username
        }
    });
    if (!user) {
        return res.status(401).json({
            message: `User: '${username}' not found.`
        });
    }
    const validPassword = yield bcrypt_1.default.compare(password, user.passwordHash);
    if (!validPassword) {
        return res.status(401).json({
            message: 'Invalid credentials!'
        });
    }
    const token = jsonwebtoken_1.default.sign({
        id: user.id,
        username: user.username,
    }, environment_1.JWT_SECRET);
    return res.status(201).json({
        id: user.id,
        username: user.username,
        token
    });
});
exports.loginUser = loginUser;
//# sourceMappingURL=authController.js.map