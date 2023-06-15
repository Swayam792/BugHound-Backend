"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bugController_1 = require("../controllers/bugController");
const authChecker_1 = __importDefault(require("../middlewares/authChecker"));
const bugRouter = express_1.default.Router();
bugRouter.get('/:projectId/bugs', authChecker_1.default, bugController_1.getBugs);
bugRouter.post('/:projectId/bugs', authChecker_1.default, bugController_1.createBug);
bugRouter.put('/:projectId/bugs/:bugId', authChecker_1.default, bugController_1.updateBug);
bugRouter.delete('/:projectId/bugs/:bugId', authChecker_1.default, bugController_1.deleteBug);
bugRouter.post('/:projectId/bugs/:bugId/close', authChecker_1.default, bugController_1.closeBug);
bugRouter.post('/:projectId/bugs/:bugId/reopen', authChecker_1.default, bugController_1.reopenBug);
exports.default = bugRouter;
//# sourceMappingURL=bugRouter.js.map