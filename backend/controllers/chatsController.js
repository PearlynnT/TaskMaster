// not used

const Chat = require('../model/Chat');
const mongoose = require('mongoose');

const getAllChats = async (req, res) => {
    try {
        const chats = await Chat.find({}); 
        if (!chats) {
            return res.status(204).json({ 'message': 'No chats found.' });
        }
        res.json(chats);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Internal Server Error' });
    }
}

const createNewChat = async (req, res) => {
    try {
        const result = await Chat.create({
            admin: new mongoose.Types.ObjectId(req.body.own),
            members: req.body.memb.map(x => new mongoose.Types.ObjectId(x)),
            latestMsg: null // tocheck
            //...req.body 
        });
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Internal Server Error' });
    }
}

const deleteChat = async (req, res) => {
    try {
        const id = req.params.id;
        await Chat.findByIdAndRemove(id).exec();
        res.send('deleted');
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Internal Server Error' });
    }
}

const getChat = async (req, res) => {
    try {
        if (!req?.body?.id) {
            return res.status(400).json({ 'message': 'Chat ID required.' });
        }
        const chat = await Chat.findOne({ _id: req.body.id }).exec();
        if (!chat) {
            return res.status(204).json({ "message": `No chat matches ID ${req.body.id}.` });
        }
        res.json(chat);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Internal Server Error' });
    }
}

module.exports = {
    getAllChats,
    createNewChat,
    deleteChat,
    getChat
}