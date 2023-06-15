"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const http_1 = __importDefault(require("http"));
const environment_1 = require("./utils/environment");
const db_1 = require("./config/db");
(0, db_1.connectToDB)();
const server = http_1.default.createServer(app_1.default);
server.listen(environment_1.PORT, () => {
    console.log(`Server running on port ${environment_1.PORT}`);
});
//# sourceMappingURL=server.js.map