const mongoose = require("mongoose")


const clientSchema = new mongoose.Schema(
    {

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        companyName: {
            type: String,
            required: true,
            trim: true
        },

        about: {
            type: String,
            required: true,
            trim: true
        },

        contactInformation: {
            type: String,
            required: true,
            trim: true
        }

    },
    {
        timestamps: true
    }
)


module.exports = mongoose.model( "Client", clientSchema)