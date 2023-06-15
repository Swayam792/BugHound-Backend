import express from 'express';
import { postNote, deleteNote, updateNote } from '../controllers/noteController';
import authChecker from '../middlewares/authChecker';

const noteRouter = express.Router(); 

noteRouter.post('/:projectId/bugs/:bugId/notes', authChecker, postNote);
noteRouter.delete('/:projectId/notes/:noteId', authChecker, deleteNote);
noteRouter.put('/:projectId/notes/:noteId', authChecker, updateNote);

export default noteRouter;
