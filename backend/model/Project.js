const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: {
            type: String,
            required: true
        },
        description: { 
            type: String,
            required: true
        },
        members: [{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        completed: { 
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Project", projectSchema);