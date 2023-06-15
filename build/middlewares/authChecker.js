"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = require("../utils/environment");
const authChecker = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            return res
                .status(401)
                .send({ message: 'No auth token found. Authorization denied.' });
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, environment_1.JWT_SECRET);
        if (!decodedToken.id) {
            return res.status(401).send({
                message: 'Token verification failed. Authorization denied.'
            });
        }
        req.user = decodedToken.id;
        next();
    }
    catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
};
exports.default = authChecker;
//# sourceMappingURL=authChecker.js.map