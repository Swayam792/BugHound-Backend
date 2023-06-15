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
exports.leaveProject = exports.removeProjectMember = exports.addProjectMembers = void 0;
const db_1 = require("../config/db");
const db_2 = require("../config/db");
const validators_1 = require("../utils/validators");
const addProjectMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = req.params.projectId;
    const memberIds = req.body.members;
    if (memberIds.length === 0) {
        return res.status(400).json({
            message: 'Members field must not be an empty array.'
        });
    }
    const targetProject = yield db_1.projectRepository.findOne({
        where: { id: projectId },
        relations: ['members']
    });
    if (!targetProject) {
        return res.status(404).json({
            message: 'Invalid project ID.'
        });
    }
    if (targetProject.createdById !== req.user) {
        return res.status(401).json({
            message: 'Access is denied.'
        });
    }
    const currentMembers = targetProject.members.map((m) => m.memberId);
    const membersValidationError = (0, validators_1.projectMembersError)([
        ...currentMembers,
        ...memberIds,
    ]);
    if (membersValidationError) {
        return res.status(400).json({
            message: membersValidationError
        });
    }
    const membersArray = memberIds.map((memberId) => ({
        memberId,
        projectId
    }));
    yield db_2.memberRepository.insert(membersArray);
    const updatedMembers = yield db_2.memberRepository.createQueryBuilder('projectMember')
        .leftJoinAndSelect('projectMember.member', 'member')
        .where('projectMember.projectId = :projectId', { projectId })
        .select([
        'projectMember.id',
        'projectMember.joinedAt',
        'member.id',
        'member.username',
    ])
        .getMany();
    return res.status(200).json(updatedMembers);
});
exports.addProjectMembers = addProjectMembers;
const removeProjectMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId, memberId } = req.params;
    const targetProject = yield db_1.projectRepository.findOne({
        where: { id: projectId },
        relations: ['members']
    });
    if (!targetProject) {
        return res.status(404).json({
            message: 'Invalid project ID.'
        });
    }
    if (targetProject.createdById !== req.user) {
        return res.status(401).json({
            message: 'Access is denied.'
        });
    }
    if (targetProject.createdById === memberId) {
        return res
            .status(400)
            .send({ message: "Project creator can't be removed." });
    }
    if (!targetProject.members.map((m) => m.memberId).includes(memberId)) {
        return res.status(404).send({
            message: "Member isn't part of the project or already removed.",
        });
    }
    yield db_2.memberRepository.delete({ projectId, memberId });
    res.status(204).end();
});
exports.removeProjectMember = removeProjectMember;
const leaveProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    const targetProject = yield db_1.projectRepository.findOne({
        where: { id: projectId },
        relations: ['members'],
    });
    if (!targetProject) {
        return res.status(404).send({ message: 'Invalid project ID.' });
    }
    if (targetProject.createdById === req.user) {
        return res.status(400).send({ message: "Project creator can't leave." });
    }
    if (!targetProject.members.map((m) => m.memberId).includes(req.user)) {
        return res.status(404).send({
            message: "You're not a member of the project.",
        });
    }
    yield db_2.memberRepository.delete({ projectId, memberId: req.user });
    res.status(204).end();
});
exports.leaveProject = leaveProject;
//# sourceMappingURL=memberController.js.map