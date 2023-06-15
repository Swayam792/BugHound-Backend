"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const noteController_1 = require("../controllers/noteController");
const authChecker_1 = __importDefault(require("../middlewares/authChecker"));
const noteRouter = express_1.default.Router();
noteRouter.post('/:projectId/bugs/:bugId/notes', authChecker_1.default, noteController_1.postNote);
noteRouter.delete('/:projectId/notes/:noteId', authChecker_1.default, noteController_1.deleteNote);
noteRouter.put('/:projectId/notes/:noteId', authChecker_1.default, noteController_1.updateNote);
exports.default = noteRouter;
//# sourceMappingURL=noteRouter.js.map