const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema(
    {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project"
        },
        name: {
            type: String,
            required: true
        },
        description: { 
            type: String,
            required: true
        },
        priority: {
            type: String,
            required: true
        },
        assignTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        date: { // todo
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Task", taskSchema);