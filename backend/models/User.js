const mongoose = require("mongoose")


const userSchema = new mongoose.Schema(
    {

        name: {

            type: String,

            required: true,

            trim: true

        },


        email: {

            type: String,

            required: true,

            unique: true,

            lowercase: true,

            trim: true

        },


        password: {

            type: String,

            required: true

        },


        role: {

            type: String,

            enum: [
                "Admin",
                "Client",
                "Freelancer"
            ],

            required: true,

            default: "Client"

        },


        phone: {

            type: String,

            default: ""

        },


        bio: {

            type: String,

            default: ""

        },


        skills: {

            type: [String],

            default: []

        },


        hourlyRate: {

            type: Number,

            default: 0

        },


        profileImage: {

            type: String,

            default: ""

        },


        // ========================================
        // ADMIN MANAGEMENT
        // ========================================

        isBlocked: {

            type: Boolean,

            default: false

        }

    },

    {

        timestamps: true

    }

)


module.exports = mongoose.model( "User", userSchema)