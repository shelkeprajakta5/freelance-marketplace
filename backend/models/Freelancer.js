const mongoose = require("mongoose")

const freelancerSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        skills: {
            type: [String],
            default: []
        },

        experience: {
            type: String,
            default: ""
        },

        bio: {
            type: String,
            default: ""
        },

        hourlyRate: {
            type: Number,
            default: 0,
            min: 0
        },

        portfolio: {
            type: String,
            default: ""
        },

        education: {
            type: String,
            default: ""
        },

        availability: {
            type: String,
            default: "Available"
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model( "Freelancer", freelancerSchema)