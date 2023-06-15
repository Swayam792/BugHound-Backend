import { Request, Response } from "express";
import { memberRepository } from "../config/db";
import { noteRepository } from "../config/db";
import { projectRepository } from "../config/db";

export const postNote = async (req: Request, res: Response) => {
    const { body } = req.body;
    const { projectId, bugId } = req.params;
    
    if(!body || body.trim() === ''){
      return res
      .status(400)
      .json({ message: 'Note body field must not be empty.' });
    }

    const projectMembers = await memberRepository.find({
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

    const newNote = noteRepository.create({ body, authorId: req.user, bugId });
    await newNote.save();

    const relationedNote = await noteRepository.createQueryBuilder('note')
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
};

export const deleteNote = async (req: Request, res: Response) => {
    const { projectId, noteId } = req.params as any;
  
    const targetProject = await projectRepository.findOne({
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
  
    const targetNote = await noteRepository.findOne({ where: {
            id: (noteId as unknown) as number
        }
    });
  
    if (!targetNote) {
      return res.status(404).send({ message: 'Invalid note ID.' });
    }
  
    if (
      targetNote.authorId !== req.user &&
      targetProject.createdById !== req.user
    ) {
      return res.status(401).send({ message: 'Access is denied.' });
    }
  
    await targetNote.remove();
    res.status(204).end();
};

export const updateNote = async (req: Request, res: Response) => {  
  const { body } = req.body;
  const { projectId, noteId } = req.params;

  if (!body || body.trim() === '') {
    return res
      .status(400)
      .send({ message: 'Note body field must not be empty.' });
  }
  const projectMembers = await memberRepository.find({ where: {
    projectId 
  }});
  const memberIds = projectMembers.map((m) => m.memberId);
  
  if (!memberIds.includes(req.user)) {
    return res
    .status(401)
    .send({ message: 'Access is denied. Not a member of the project.' });
  }

  const targetNote = await noteRepository.findOne({ where: {
    id: (noteId as unknown) as number
  }});

  if (!targetNote) {
    return res.status(404).send({ message: 'Invalid note ID.' });
  }

  if (targetNote.authorId !== req.user) {
    return res.status(401).send({ message: 'Access is denied.' });
  }

  targetNote.body = body;
  await targetNote.save();
  res.json(targetNote);
   
};