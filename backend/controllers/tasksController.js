const Task = require('../model/Task');
const mongoose = require('mongoose');

// const getAllTasksByProj = async (req, res) => {
//     try {
//         const tasks = await Task.find({ project: req.body.project }); // todo: get all tasks based on projectid
//         if (!tasks) {
//             return res.status(204).json({ 'message': 'No tasks found.' });
//         }
//         res.json(tasks);
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ 'message': 'Internal Server Error' });
//     }
// }

// // todo: get all tasks based on userid
// const getAllTasksByUser = async (req, res) => {
//     try {
//         const tasks = await Task.find({ assignTo: req.body.user });
//         if (!tasks) {
//             return res.status(204).json({ 'message': 'No tasks found.' });
//         }
//         res.json(tasks);
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ 'message': 'Internal Server Error' });
//     }
// }

const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({}); 
        if (!tasks) {
            return res.status(204).json({ 'message': 'No tasks found.' });
        }
        res.json(tasks);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Internal Server Error' });
    }
}

const createNewTask = async (req, res) => {
    if (!req?.body?.name || !req?.body?.description || !req?.body?.priority || !req?.body?.assigned || !req?.body?.date) { 
        return res.status(400).json({ 'message': 'All fields are required' });
    }
    try {
        console.log(req.body)
        const result = await Task.create({
            project: new mongoose.Types.ObjectId(req.body.proj),
            assignTo: new mongoose.Types.ObjectId(req.body.assigned),
            ...req.body
        });
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Internal Server Error' });
    }
}

const updateTask = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "priority", "date"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).json({ 'message': 'Invalid operation' });
    }
    try {
        if (!req?.body?.id) {
            return res.status(400).json({ 'message': 'Task ID required.' });
        }
        const task = await Task.findOne({ _id: req.body.id }).exec();
        if (!task) {
            return res.status(204).json({ "message": `No task matches ID ${req.body.id}.` });
        }
        updates.forEach((update) => (task[update] = req.body[update]));
        const result = await task.save();
        res.json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Internal Server Error' });
    }
}

const deleteTask = async (req, res) => {
    try {
        // todo
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Internal Server Error' });
    }
}

const getTask = async (req, res) => {
    try {
        if (!req?.body?.id) {
            return res.status(400).json({ 'message': 'Task ID required.' });
        }
        const task = await Task.findOne({ _id: req.body.id }).exec();
        if (!task) {
            return res.status(204).json({ "message": `No task matches ID ${req.body.id}.` });
        }
        res.json(task);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Internal Server Error' });
    }
}

module.exports = {
    // getAllTasksByProj,
    // getAllTasksByUser,
    getAllTasks,
    createNewTask,
    updateTask,
    deleteTask,
    getTask
}