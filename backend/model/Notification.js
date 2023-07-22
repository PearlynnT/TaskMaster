const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
    {
        senderName: {
            type: String,
            required: true
        },
        receipientId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        projectName: { 
            type: String,
            required: true
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    }
);


module.exports = mongoose.model("Notification", notificationSchema);