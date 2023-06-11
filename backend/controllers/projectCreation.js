const Project = require('../model/Project');

const addProject = async (req, res) => {
    const { name, description} = req.body;

    try {
        const result = await Project.create({
            "name": name,
            "description": description
        });
        res.status(201).json({ 'success': `New project ${name} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { addProject };


