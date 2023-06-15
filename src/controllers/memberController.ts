import { Request, Response } from "express";
import { projectRepository } from "../config/db";
import { memberRepository } from "../config/db";
import { projectMembersError } from "../utils/validators";

export const addProjectMembers = async (req: Request, res: Response) => {
    const projectId = req.params.projectId as any;
    const memberIds = req.body.members as string[];
    if (memberIds.length === 0) {
        return res.status(400).json({
            message: 'Members field must not be an empty array.'
        });
    }

    const targetProject = await projectRepository.findOne({
        where: { id: projectId },
        relations: ['members']
    });

    if (!targetProject) {
        return res.status(404).json({
            message: 'Invalid project ID.'
        })
    }

    if (targetProject.createdById !== req.user) {
        return res.status(401).json({
            message: 'Access is denied.'
        });
    }

    const currentMembers = targetProject.members.map((m) => m.memberId);

    const membersValidationError = projectMembersError([
        ...currentMembers,
        ...memberIds,
    ]);

    if (membersValidationError) {
        return res.status(400).json({
            message: membersValidationError
        })
    }

    const membersArray = memberIds.map((memberId) => ({
        memberId,
        projectId
    }));
    await memberRepository.insert(membersArray);

    const updatedMembers = await memberRepository.createQueryBuilder('projectMember')
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

}

export const removeProjectMember = async (req: Request, res: Response) => {
    const { projectId, memberId } = req.params as any;

    const targetProject = await projectRepository.findOne({
        where: { id: projectId },
        relations: ['members']
    });

    if (!targetProject) {
        return res.status(404).json({
            message: 'Invalid project ID.'
        })
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

    await memberRepository.delete({ projectId, memberId });
    res.status(204).end();
}

export const leaveProject = async (req: Request, res: Response) => {
    const { projectId } = req.params as any;

    const targetProject = await projectRepository.findOne({
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

    await memberRepository.delete({ projectId, memberId: req.user });
    res.status(204).end();
}