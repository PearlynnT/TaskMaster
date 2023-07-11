const Message = require('../model/Message');
const mongoose = require('mongoose');

const getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find({}); 
        if (!messages) {
            return res.status(204).json({ 'message': 'No messages found.' });
        }
        res.json(messages);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Internal Server Error' });
    }
}

const createNewMessage = async (req, res) => {
    try {
        const result = await Message.create({
            ...req.body // todo: new mongoose.Types.ObjectId
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Internal Server Error' });
    }
}

const deleteMessage = async (req, res) => {
    try {
        const id = req.params.id;
        await Message.findByIdAndRemove(id).exec();
        res.send('deleted');
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Internal Server Error' });
    }
}

const getMessage = async (req, res) => {
    try {
        if (!req?.body?.id) {
            return res.status(400).json({ 'message': 'Message ID required.' });
        }
        const message = await Message.findOne({ _id: req.body.id }).exec();
        if (!message) {
            return res.status(204).json({ "message": `No message matches ID ${req.body.id}.` });
        }
        res.json(message);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Internal Server Error' });
    }
}

module.exports = {
    getAllMessages,
    createNewMessage,
    deleteMessage,
    getMessage
}