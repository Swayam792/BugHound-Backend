import express from 'express';
import { addProjectMembers, leaveProject, removeProjectMember } from '../controllers/memberController';
import authChecker from '../middlewares/authChecker'; 

const memberRouter = express.Router();

memberRouter.post('/:projectId/members', authChecker, addProjectMembers);
memberRouter.delete('/:projectId/members/:memberId', authChecker, removeProjectMember);
memberRouter.post('/:projectId/members/leave', authChecker, leaveProject);

export default memberRouter;