import { Router } from 'express';

import controller from "../controllers/taskController.js";

const router = Router();

router.get('/', controller.getTasks);
router.post('/create', controller.createTask);
router.get('/:id', controller.getSingleTask);
router.put('/update/:id',controller.updateTask);
router.delete('/delete/:id',controller.deleteTask)


export default router;
