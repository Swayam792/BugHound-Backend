"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const memberController_1 = require("../controllers/memberController");
const authChecker_1 = __importDefault(require("../middlewares/authChecker"));
const memberRouter = express_1.default.Router();
memberRouter.post('/:projectId/members', authChecker_1.default, memberController_1.addProjectMembers);
memberRouter.delete('/:projectId/members/:memberId', authChecker_1.default, memberController_1.removeProjectMember);
memberRouter.post('/:projectId/members/leave', authChecker_1.default, memberController_1.leaveProject);
exports.default = memberRouter;
//# sourceMappingURL=memberRouter.js.map