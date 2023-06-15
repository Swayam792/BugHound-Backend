import express from 'express';
import {getBugs,createBug,updateBug,deleteBug,closeBug,reopenBug,
} from '../controllers/bugController'; 
import authChecker from '../middlewares/authChecker';

const bugRouter = express.Router(); 

bugRouter.get('/:projectId/bugs', authChecker, getBugs);
bugRouter.post('/:projectId/bugs', authChecker, createBug);
bugRouter.put('/:projectId/bugs/:bugId', authChecker, updateBug);
bugRouter.delete('/:projectId/bugs/:bugId', authChecker, deleteBug);
bugRouter.post('/:projectId/bugs/:bugId/close', authChecker, closeBug);
bugRouter.post('/:projectId/bugs/:bugId/reopen', authChecker, reopenBug);

export default bugRouter;
