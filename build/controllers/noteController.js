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
exports.updateNote = exports.deleteNote = exports.postNote = void 0;
const db_1 = require("../config/db");
const db_2 = require("../config/db");
const db_3 = require("../config/db");
const postNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req.body;
    const { projectId, bugId } = req.params;
    if (!body || body.trim() === '') {
        return res
            .status(400)
            .json({ message: 'Note body field must not be empty.' });
    }
    const projectMembers = yield db_1.memberRepository.find({
        where: {
            projectId
        }
    });
    const memberIds = projectMembers.map((m) => m.memberId);
    if (!memberIds.includes(req.user)) {
        return res
            .status(401)
            .send({ message: 'Access is denied. Not a member of the project.' });
    }
    const newNote = db_2.noteRepository.create({ body, authorId: req.user, bugId });
    yield newNote.save();
    const relationedNote = yield db_2.noteRepository.createQueryBuilder('note')
        .where('note.id = :noteId', { noteId: newNote.id })
        .leftJoinAndSelect('note.author', 'author')
        .select([
        'note.id',
        'note.bugId',
        'note.body',
        'note.createdAt',
        'note.updatedAt',
        'author.id',
        'author.username',
    ])
        .getOne();
    return res.status(201).json(relationedNote);
});
exports.postNote = postNote;
const deleteNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId, noteId } = req.params;
    const targetProject = yield db_3.projectRepository.findOne({
        where: { id: projectId },
        relations: ['members'],
    });
    if (!targetProject) {
        return res.status(404).send({ message: 'Invalid project ID.' });
    }
    const memberIds = targetProject.members.map((m) => m.memberId);
    if (!memberIds.includes(req.user)) {
        return res
            .status(401)
            .send({ message: 'Access is denied. Not a member of the project.' });
    }
    const targetNote = yield db_2.noteRepository.findOne({ where: {
            id: noteId
        }
    });
    if (!targetNote) {
        return res.status(404).send({ message: 'Invalid note ID.' });
    }
    if (targetNote.authorId !== req.user &&
        targetProject.createdById !== req.user) {
        return res.status(401).send({ message: 'Access is denied.' });
    }
    yield targetNote.remove();
    res.status(204).end();
});
exports.deleteNote = deleteNote;
const updateNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req.body;
    const { projectId, noteId } = req.params;
    if (!body || body.trim() === '') {
        return res
            .status(400)
            .send({ message: 'Note body field must not be empty.' });
    }
    const projectMembers = yield db_1.memberRepository.find({ where: {
            projectId
        } });
    const memberIds = projectMembers.map((m) => m.memberId);
    if (!memberIds.includes(req.user)) {
        return res
            .status(401)
            .send({ message: 'Access is denied. Not a member of the project.' });
    }
    const targetNote = yield db_2.noteRepository.findOne({ where: {
            id: noteId
        } });
    if (!targetNote) {
        return res.status(404).send({ message: 'Invalid note ID.' });
    }
    if (targetNote.authorId !== req.user) {
        return res.status(401).send({ message: 'Access is denied.' });
    }
    targetNote.body = body;
    yield targetNote.save();
    res.json(targetNote);
});
exports.updateNote = updateNote;
//# sourceMappingURL=noteController.js.map