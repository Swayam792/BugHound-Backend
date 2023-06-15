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
exports.reopenBug = exports.closeBug = exports.deleteBug = exports.updateBug = exports.createBug = exports.getBugs = void 0;
const db_1 = require("../config/db");
const db_2 = require("../config/db");
const db_3 = require("../config/db");
const db_4 = require("../config/db");
const validators_1 = require("../utils/validators");
const fieldsToSelect = [
    'bug.id',
    'bug.projectId',
    'bug.title',
    'bug.description',
    'bug.priority',
    'bug.isResolved',
    'bug.createdAt',
    'bug.updatedAt',
    'bug.closedAt',
    'bug.reopenedAt',
    'createdBy.id',
    'createdBy.username',
    'updatedBy.id',
    'updatedBy.username',
    'closedBy.id',
    'closedBy.username',
    'reopenedBy.id',
    'reopenedBy.username',
    'note.id',
    'note.bugId',
    'note.body',
    'note.createdAt',
    'note.updatedAt',
    'noteAuthor.id',
    'noteAuthor.username',
];
const getBugs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    const projectMembers = yield db_1.memberRepository.find({
        where: {
            projectId
        }
    });
    if (!projectMembers.map((m) => m.memberId).includes(req.user)) {
        return res.status(401).send({ message: 'Access is denied.' });
    }
    const bugs = yield db_2.bugRepository.createQueryBuilder('bug')
        .where('"projectId" = :projectId', { projectId })
        .leftJoinAndSelect('bug.createdBy', 'createdBy')
        .leftJoinAndSelect('bug.updatedBy', 'updatedBy')
        .leftJoinAndSelect('bug.closedBy', 'closedBy')
        .leftJoinAndSelect('bug.reopenedBy', 'reopenedBy')
        .leftJoinAndSelect('bug.notes', 'note')
        .leftJoinAndSelect('note.author', 'noteAuthor')
        .select(fieldsToSelect)
        .getMany();
    return res.status(200).json({
        bugs
    });
});
exports.getBugs = getBugs;
const createBug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, priority } = req.body;
    const { projectId } = req.params;
    const { errors, valid } = (0, validators_1.createBugValidator)(title, description, priority);
    if (!valid) {
        return res.status(400).json({ message: Object.values(errors)[0] });
    }
    const projectMembers = yield db_1.memberRepository.find({
        where: {
            projectId
        }
    });
    const memberIds = projectMembers.map((m) => m.memberId);
    if (!memberIds.includes(req.user)) {
        return res.status(401).json({
            message: 'Access denied! You are not the part of this project.'
        });
    }
    const newBug = db_2.bugRepository.create({
        title,
        description,
        priority,
        projectId,
        createdById: req.user
    });
    yield newBug.save();
    const relationedBug = yield db_2.bugRepository.createQueryBuilder('bug')
        .where('bug.id = :bugId', { bugId: newBug.id })
        .leftJoinAndSelect('bug.createdBy', 'createdBy')
        .leftJoinAndSelect('bug.updatedBy', 'updatedBy')
        .leftJoinAndSelect('bug.closedBy', 'closedBy')
        .leftJoinAndSelect('bug.reopenedBy', 'reopenedBy')
        .leftJoinAndSelect('bug.notes', 'note')
        .leftJoinAndSelect('note.author', 'noteAuthor')
        .select(fieldsToSelect)
        .getOne();
    return res.status(201).json(relationedBug);
});
exports.createBug = createBug;
const updateBug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, priority } = req.body;
    const { projectId, bugId } = req.params;
    console.log(priority);
    const { errors, valid } = (0, validators_1.createBugValidator)(title, description, priority);
    if (!valid) {
        return res.status(400).send({
            message: Object.values(errors)[0]
        });
    }
    const projectMembers = yield db_1.memberRepository.find({
        where: {
            projectId
        }
    });
    const memberIds = projectMembers.map((m) => m.memberId);
    if (!memberIds.includes(req.user)) {
        return res.status(401).send({
            message: 'Access denied! You are not the part of this project.'
        });
    }
    const targetBug = yield db_2.bugRepository.findOne({
        where: {
            id: bugId
        }
    });
    if (!targetBug) {
        return res.status(400).json({
            message: "Invalid bug id!"
        });
    }
    targetBug.title = title;
    targetBug.description = description;
    targetBug.priority = priority;
    targetBug.updatedById = req.user;
    targetBug.updatedAt = new Date();
    yield targetBug.save();
    const relationedBug = yield db_2.bugRepository.createQueryBuilder('bug')
        .where('bug.id = :bugId', { bugId })
        .leftJoinAndSelect('bug.createdBy', 'createdBy')
        .leftJoinAndSelect('bug.updatedBy', 'updatedBy')
        .leftJoinAndSelect('bug.closedBy', 'closedBy')
        .leftJoinAndSelect('bug.reopenedBy', 'reopenedBy')
        .leftJoinAndSelect('bug.notes', 'note')
        .leftJoinAndSelect('note.author', 'noteAuthor')
        .select(fieldsToSelect)
        .getOne();
    return res.status(201).json(relationedBug);
});
exports.updateBug = updateBug;
const deleteBug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId, bugId } = req.params;
    const targetProject = yield db_4.projectRepository.findOne({
        where: {
            id: projectId,
        }
    });
    if (!targetProject) {
        return res.status(404).send({ message: 'Invalid project ID.' });
    }
    const targetBug = yield db_2.bugRepository.findOne({
        where: {
            id: bugId
        }
    });
    if (!targetBug) {
        return res.status(404).send({ message: 'Invalid bug ID.' });
    }
    if (targetProject.createdById !== req.user &&
        targetBug.createdById !== req.user) {
        return res.status(401).send({ message: 'Access is denied.' });
    }
    yield db_3.noteRepository.delete({ bugId });
    yield targetBug.remove();
    res.status(204).end();
});
exports.deleteBug = deleteBug;
const closeBug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId, bugId } = req.params;
    const projectMembers = yield db_1.memberRepository.find({ where: {
            projectId
        } });
    const memberIds = projectMembers.map((m) => m.memberId);
    if (!memberIds.includes(req.user)) {
        return res.status(401).send({ message: 'Access is denied' });
    }
    const targetBug = yield db_2.bugRepository.findOne({
        where: {
            id: bugId
        }
    });
    if (!targetBug) {
        return res.status(404).send({ message: 'Invalid bug ID.' });
    }
    if (targetBug.isResolved === true) {
        return res.status(400).send({ message: 'This bug is already closed.' });
    }
    targetBug.isResolved = true;
    targetBug.closedById = req.user;
    targetBug.closedAt = new Date();
    targetBug.reopenedById = null;
    targetBug.reopenedAt = null;
    yield targetBug.save();
    const relationedBug = yield db_2.bugRepository.createQueryBuilder('bug')
        .where('bug.id = :bugId', { bugId })
        .leftJoinAndSelect('bug.createdBy', 'createdBy')
        .leftJoinAndSelect('bug.updatedBy', 'updatedBy')
        .leftJoinAndSelect('bug.closedBy', 'closedBy')
        .leftJoinAndSelect('bug.reopenedBy', 'reopenedBy')
        .leftJoinAndSelect('bug.notes', 'note')
        .leftJoinAndSelect('note.author', 'noteAuthor')
        .select(fieldsToSelect)
        .getOne();
    return res.status(201).json(relationedBug);
});
exports.closeBug = closeBug;
const reopenBug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId, bugId } = req.params;
    const projectMembers = yield db_1.memberRepository.find({ where: {
            projectId
        } });
    const memberIds = projectMembers.map((m) => m.memberId);
    if (!memberIds.includes(req.user)) {
        return res.status(401).send({ message: 'Access is denied.' });
    }
    const targetBug = yield db_2.bugRepository.findOne({ where: {
            id: bugId
        } });
    if (!targetBug) {
        return res.status(400).send({ message: 'Invalid bug ID.' });
    }
    if (targetBug.isResolved === false) {
        return res
            .status(400)
            .send({ message: 'Bug is already marked as opened.' });
    }
    targetBug.isResolved = false;
    targetBug.reopenedById = req.user;
    targetBug.reopenedAt = new Date();
    targetBug.closedById = null;
    targetBug.closedAt = null;
    yield targetBug.save();
    const relationedBug = yield db_2.bugRepository.createQueryBuilder('bug')
        .where('bug.id = :bugId', { bugId })
        .leftJoinAndSelect('bug.createdBy', 'createdBy')
        .leftJoinAndSelect('bug.updatedBy', 'updatedBy')
        .leftJoinAndSelect('bug.closedBy', 'closedBy')
        .leftJoinAndSelect('bug.reopenedBy', 'reopenedBy')
        .leftJoinAndSelect('bug.notes', 'note')
        .leftJoinAndSelect('note.author', 'noteAuthor')
        .select(fieldsToSelect)
        .getOne();
    return res.status(201).json(relationedBug);
});
exports.reopenBug = reopenBug;
//# sourceMappingURL=bugController.js.map