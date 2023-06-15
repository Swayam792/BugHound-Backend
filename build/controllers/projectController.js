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
exports.deleteProject = exports.editProjectName = exports.createProject = exports.getProjects = void 0;
const db_1 = require("../config/db");
const db_2 = require("../config/db");
const db_3 = require("../config/db");
const validators_1 = require("../utils/validators");
const fieldsToSelect = [
    'project.id',
    'project.name',
    'project.createdAt',
    'project.updatedAt',
    'createdBy.id',
    'createdBy.username',
    'members.id',
    'members.joinedAt',
    'member.id',
    'member.username',
    'bug.id',
];
const getProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projects = yield db_1.projectRepository.createQueryBuilder('project')
        .leftJoin('project.members', 'projectMember')
        .where('projectMember.memberId = :userId', { userId: req.user })
        .leftJoinAndSelect('project.members', 'members')
        .leftJoinAndSelect('project.createdBy', 'createdBy')
        .leftJoinAndSelect('members.member', 'member')
        .leftJoinAndSelect('project.bugs', 'bug')
        .select(fieldsToSelect)
        .getMany();
    return res.status(200).json(projects);
});
exports.getProjects = getProjects;
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const memberIds = req.body.members
            ? [req.user, ...req.body.members]
            : [req.user];
        const { errors, valid } = (0, validators_1.createProjectValidator)(name, memberIds);
        if (!valid) {
            return res.status(400).send({ message: Object.values(errors)[0] });
        }
        const newProject = db_1.projectRepository.create({
            name,
            createdById: req.user,
        });
        yield newProject.save();
        const membersArray = memberIds.map((memberId) => ({
            memberId: memberId,
            projectId: newProject.id,
        }));
        yield db_2.memberRepository.insert(membersArray);
        const relationedProject = yield db_1.projectRepository.createQueryBuilder('project')
            .where('project.id = :projectId', { projectId: newProject.id })
            .leftJoinAndSelect('project.members', 'members')
            .leftJoinAndSelect('project.createdBy', 'createdBy')
            .leftJoinAndSelect('members.member', 'member')
            .leftJoinAndSelect('project.bugs', 'bug')
            .select(fieldsToSelect)
            .getOne();
        res.status(201).json(relationedProject);
    }
    catch (err) {
        return res.status(500).json({
            message: err
        });
    }
});
exports.createProject = createProject;
const editProjectName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const { projectId } = req.params;
    const nameValidationError = (0, validators_1.projectNameError)(name);
    if (nameValidationError) {
        return res.status(400).send({ message: nameValidationError });
    }
    const targetProject = yield db_1.projectRepository.findOne({ where: {
            id: projectId
        } });
    if (!targetProject) {
        return res.status(404).send({ message: 'Invalid project ID.' });
    }
    if (targetProject.createdById !== req.user) {
        return res.status(401).send({ message: 'Access is denied.' });
    }
    targetProject.name = name;
    yield targetProject.save();
    res.json(targetProject);
});
exports.editProjectName = editProjectName;
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    const targetProject = yield db_1.projectRepository.findOne({ where: {
            id: projectId
        }
    });
    if (!targetProject) {
        return res.status(404).send({ message: 'Invalid project ID.' });
    }
    if (targetProject.createdById !== req.user) {
        return res.status(401).send({ message: 'Access is denied.' });
    }
    yield db_2.memberRepository.delete({ projectId });
    yield db_3.bugRepository.delete({ projectId });
    yield targetProject.remove();
    res.status(204).end();
});
exports.deleteProject = deleteProject;
//# sourceMappingURL=projectController.js.map