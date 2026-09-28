const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },

        requiredSkills: {
            type: [String],
            default: []
        },

        budget: {
            type: Number,
            required: true,
            min: 0
        },

        deadline: {
            type: Date,
            required: true
        },

        attachments: {
            type: [String],
            default: []
        },

        status: {
            type: String,
            enum: [
                "Open",
                "In Progress",
                "Completed",
                "Closed"
            ],
            default: "Open"
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model( "Project", projectSchema)