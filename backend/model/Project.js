const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: {
            type: String,
            required: true
        },
        description: { // todo: add more fields
            type: String,
            required: true
        },
        completed: { // to be edited
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Project", projectSchema);