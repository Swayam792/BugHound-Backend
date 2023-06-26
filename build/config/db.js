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
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDB = exports.projectRepository = exports.noteRepository = exports.memberRepository = exports.bugRepository = exports.userRepository = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const environment_1 = require("../utils/environment");
const User_1 = require("../entity/User");
const Bug_1 = require("../entity/Bug");
const Member_1 = require("../entity/Member");
const Note_1 = require("../entity/Note");
const Project_1 = require("../entity/Project");
require("dotenv/config");
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: environment_1.DB_HOST,
    port: environment_1.DB_PORT,
    username: environment_1.DB_USERNAME,
    password: environment_1.DB_PASSWORD,
    database: 'bughound',
    entities: [
        process.env.NODE_ENV === 'test'
            ? '*/entity/**/*.ts'
            : '*/entity/**/*.js',
    ],
    synchronize: false,
    logging: false
});
exports.userRepository = AppDataSource.getRepository(User_1.User);
exports.bugRepository = AppDataSource.getRepository(Bug_1.Bug);
exports.memberRepository = AppDataSource.getRepository(Member_1.Member);
exports.noteRepository = AppDataSource.getRepository(Note_1.Note);
exports.projectRepository = AppDataSource.getRepository(Project_1.Project);
const connectToDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        AppDataSource.initialize().then(() => {
            console.log("Database initialized");
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.connectToDB = connectToDB;
//# sourceMappingURL=db.js.map