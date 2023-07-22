// not used

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema(
    {
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        members: [{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        latestMsg: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Chat", chatSchema);