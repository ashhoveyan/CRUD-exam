import { v4 as uuid } from 'uuid';
import validate from '../utils/validate.js';

const tasksList = [];

const checkTaskDate = (taskDate) => {
    let count = 0;
    tasksList.forEach((task) => {
        if (task.taskDate === taskDate) {
            count++;
        }
    });
    return count < 3;
};

const taskController = {
    getTasks(req, res) {
        try {
            const errors = validate.getTasks(req);
            if (errors.haveErrors) {
                res.status(422).json({
                    errors: errors.fields,
                    message: 'Validation error',
                });
                return;
            }

            const { page = 1 } = req.query;
            let list = [...tasksList];
            list.sort((a, b) => new Date(a.taskDate).getTime() - new Date(b.taskDate).getTime());

            const limit = 10;
            const maxPageCount = Math.ceil(list.length / limit);

            if (+page > maxPageCount) {
                res.status(422).json({ message: 'Invalid page number' });
                return;
            }

            const offset = (page - 1) * limit;
            const endOffset = offset + limit;
            list = list.slice(offset, endOffset);

            res.status(200).json({
                message: 'tasks list',
                list,
            });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: e.message });
        }
    },

    createTask(req, res) {
        try {
            const errors = validate.createTask(req);
            if (errors.haveErrors) {
                res.status(422).json({
                    errors: errors.fields,
                    message: 'Validation error',
                });
                return;
            }

            const { title, description, taskDate } = req.body;

            if (!checkTaskDate(taskDate)) {
                res.status(422).json({ message: 'You can create a task for the same day max 3 times.' });
                return;
            }

            const newTask = {
                id: uuid(),
                title,
                description,
                taskDate,
                completed: false,
            };

            tasksList.push(newTask);

            res.status(200).json({
                message: 'Task successfully created',
                tasksList,
            });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: e.message });
        }
    },

    getSingleTask(req, res) {
        try {
            const errors = validate.getSingleTask(req);
            if (errors.haveErrors) {
                res.status(422).json({
                    errors: errors.fields,
                    message: 'Validation error',
                });
                return;
            }

            const { id } = req.params;
            const task = tasksList.find(task => task.id === id);

            if (task) {
                res.status(200).json(task);
            } else {
                res.status(404).json({ message: 'Task not found' });
            }
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: e.message });
        }
    },

    updateTask(req, res) {
        try {
            const errors = validate.updateTask(req);
            if (errors.haveErrors) {
                res.status(422).json({
                    errors: errors.fields,
                    message: 'Validation error',
                });
                return;
            }

            const { id } = req.params;
            const task = tasksList.find(task => task.id === id);

            if (task) {
                task.title = req.body.title;
                task.description = req.body.description;
                task.taskDate = req.body.taskDate;

                res.status(200).json(task);
            } else {
                res.status(404).json({ message: "Task not found" });
            }
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: e.message });
        }
    },

    deleteTask(req, res) {
        try {
            const errors = validate.deleteTask(req);
            if (errors.haveErrors) {
                res.status(422).json({
                    errors: errors.fields,
                    message: 'Validation error',
                });
                return;
            }

            const { id } = req.params;
            const task = tasksList.find(task => task.id === id);

            if (task) {
                tasksList.splice(tasksList.indexOf(task), 1);
                res.status(200).json({ message: "Task is deleted" });
            } else {
                res.status(404).json({ message: "Task not found" });
            }
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: e.message });
        }
    }
};

export default taskController;
