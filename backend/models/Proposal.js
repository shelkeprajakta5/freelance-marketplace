const mongoose = require("mongoose")

const proposalSchema = new mongoose.Schema(
    {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },

        freelancer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        coverLetter: {
            type: String,
            required: true,
            trim: true
        },

        bidAmount: {
            type: Number,
            required: true,
            min: 0
        },

        deliveryTime: {
            type: Number,
            required: true,
            min: 1
        },

        attachments: {
            type: [String],
            default: []
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Accepted",
                "Rejected",
                "Withdrawn"
            ],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model( "Proposal",proposalSchema)