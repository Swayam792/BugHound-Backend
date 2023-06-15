import express from 'express';
import {
  createProject,
  editProjectName,
  getProjects,
  deleteProject,
} from '../controllers/projectController'; 
import authChecker from '../middlewares/authChecker';

const projectRouter = express.Router(); 

projectRouter.get('/', authChecker, getProjects);
projectRouter.post('/', authChecker, createProject);
projectRouter.put('/:projectId', authChecker, editProjectName);
projectRouter.delete('/:projectId', authChecker, deleteProject);

export default projectRouter;
