const Notification = require('../model/Notification');
const mongoose = require('mongoose');

const createNotification = async (req, res) => {
    if (!req?.body?.senderName || !req?.body?.receipientId ||
        !req?.body?.projectName || !req?.body?.projectId) {
        return res.status(400).json({ 'message': 'All fields are required' });
    }
    try {
        const result = await Notification.create({
            receipientId: new mongoose.Types.ObjectId(req.body.receipientId),
            projectId: new mongoose.Types.ObjectId(req.body.projectId),
            ...req.body
        });
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Internal Server Error' });
    }
}

const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({}); 
        if (!notifications) {
            return res.status(204).json({ 'message': 'No notifications found.' });
        }
        res.json(notifications);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Internal Server Error' });
    }
}


const deleteNotificationById = async (req, res) => {
    try {
        const id = req.params.id;
        await Notification.findByIdAndRemove(id).exec();
        res.send('deleted');
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Internal Server Error' });
    }
}

module.exports = {
    createNotification, 
    getAllNotifications, 
    deleteNotificationById
}
