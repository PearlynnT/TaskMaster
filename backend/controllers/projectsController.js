const Project = require('../model/Project');
const mongoose = require('mongoose');

// const addProject = async (req, res) => {
//     const { name, description} = req.body;
//     try {
//         const result = await Project.create({
//             "name": name,
//             "description": description
//         });
//         res.status(201).json({ 'success': `New project ${name} created!` });
//     } catch (err) {
//         res.status(500).json({ 'message': err.message });
//     }
// }

// const getAllProjects = async (req, res) => {
//     const projects = await Project.find({});
//     if (!projects) {
//         return res.status(204).json({ 'message': 'No projects found' });
//     }
//     res.json(projects);
// }

// module.exports = { addProject, getAllProjects };

const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find({}); // todo
        if (!projects) {
            return res.status(204).json({ 'message': 'No projects found.' });
        }
        res.json(projects);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Internal Server Error' });
    }
}

const createNewProject = async (req, res) => {
    if (!req?.body?.name || !req?.body?.description) {
        return res.status(400).json({ 'message': 'All fields are required' });
    }
    try {
        const result = await Project.create({
            owner: new mongoose.Types.ObjectId(req.body.own), // req.owner.id 
            members: req.body.memb.map(x => new mongoose.Types.ObjectId(x)), 
            ...req.body
        });
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Internal Server Error' });
    }
}

const updateProject = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).json({ 'message': 'Invalid operation' });
    }
    try {
        if (!req?.body?.id) {
            return res.status(400).json({ 'message': 'Project ID required.' });
        }
        const project = await Project.findOne({ _id: req.body.id }).exec();
        if (!project) {
            return res.status(204).json({ "message": `No project matches ID ${req.body.id}.` });
        }
        updates.forEach((update) => (project[update] = req.body[update]));
        const result = await project.save();
        res.json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Internal Server Error' });
    }
}

const deleteProject = async (req, res) => {
    try {
        //if (!req?.body?.id) {
        //    return res.status(400).json({ 'message': 'Project ID required.' });
        //}
        //const project = await Project.findOne({ _id: req.body.id }).exec();
        //if (!project) {
        //    return res.status(204).json({ "message": `No project matches ID ${req.body.id}.` });
        //}
        //if (project.owner != req.user.id) {
        //    return res.status(403).json({ 'message': "You can't delete project of another user" });
        //}
        //const result = await project.deleteOne(); 
        //res.json(result);
        const id = req.params.id;
        await Project.findByIdAndRemove(id).exec();
        res.send('deleted');
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Internal Server Error' });
    }
}

const getProject = async (req, res) => {
    try {
        if (!req?.body?.id) {
            return res.status(400).json({ 'message': 'Project ID required.' });
        }
        const project = await Project.findOne({ _id: req.body.id }).exec();
        if (!project) {
            return res.status(204).json({ "message": `No project matches ID ${req.body.id}.` });
        }
        res.json(project);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Internal Server Error' });
    }
}

module.exports = {
    getAllProjects,
    createNewProject,
    updateProject,
    deleteProject,
    getProject
}
