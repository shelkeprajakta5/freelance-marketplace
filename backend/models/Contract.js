const mongoose = require("mongoose")


const contractSchema = new mongoose.Schema(
    {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },

        proposal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Proposal",
            required: true,
            unique: true
        },

        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        freelancer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        agreedAmount: {
            type: Number,
            required: true,
            min: 0
        },

        deliveryTime: {
            type: Number,
            required: true,
            min: 1
        },

        status: {
            type: String,
            enum: [
                "Active",
                "In Progress",
                "Submitted",
                "Completed",
                "Cancelled"
            ],
            default: "Active"
        },

        startDate: {
            type: Date,
            default: Date.now
        },

        completedDate: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
)


module.exports = mongoose.model( "Contract", contractSchema)