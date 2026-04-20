// import { Router } from 'express';
// import { Task } from '../models/Task.js';

// const router = Router();

// router.get('/', async (req, res) => {
//   const tasks = await Task.find();
//   res.json(tasks);
// });

// router.post('/', async (req, res) => {
//   const newTask = new Task({
//     title: req.body.title
//   });
//   const savedTask = await newTask.save();
//   res.json(savedTask);
// });

// router.put('/:id', async (req, res) => {
//   const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
//   res.json(updatedTask);
// });

// router.delete('/:id', async (req, res) => {
//   await Task.findByIdAndDelete(req.params.id);
//   res.json({ message: 'Task deleted' });
// });

// export default router;