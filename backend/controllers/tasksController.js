const Task = require('../model/Task');
const mongoose = require('mongoose');

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
    //const allowedUpdates = ["proj", "name", "description", "priority", "assigned", "date", "completed"];
    const updates = Object.keys(req.body);
    //const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    //if (!isValidOperation) {
    //    return res.status(400).json({ 'message': 'Invalid operation' });
    //}

    try {
        const taskId = req.params.id;
        const task = await Task.findById(taskId).exec();

        if (!task) {
            return res.status(204).json({ "message": `No task matches ID ${taskId}.` });
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
        const id = req.params.id;
        await Task.findByIdAndRemove(id).exec();
        res.send('deleted');
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Internal Server Error' });
    }
}

const getTask = async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findOne({ _id: id }).exec();
        if (!task) {
            return res.status(204).json({ "message": `No task matches ID ${id}.` });
        }
        res.json(task);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Internal Server Error' });
    }
}

module.exports = {
    getAllTasks,
    createNewTask,
    updateTask,
    deleteTask,
    getTask
}