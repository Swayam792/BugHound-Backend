"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectController_1 = require("../controllers/projectController");
const authChecker_1 = __importDefault(require("../middlewares/authChecker"));
const projectRouter = express_1.default.Router();
projectRouter.get('/', authChecker_1.default, projectController_1.getProjects);
projectRouter.post('/', authChecker_1.default, projectController_1.createProject);
projectRouter.put('/:projectId', authChecker_1.default, projectController_1.editProjectName);
projectRouter.delete('/:projectId', authChecker_1.default, projectController_1.deleteProject);
exports.default = projectRouter;
//# sourceMappingURL=projectRouter.js.map