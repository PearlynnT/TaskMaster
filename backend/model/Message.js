const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema(
    {
        // chat: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "Chat"
        // },
        room: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        owner: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        }, 
        time: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Message", messageSchema);
// todo: add file to msg