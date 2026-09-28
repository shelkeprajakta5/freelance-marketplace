const mongoose = require("mongoose")


const messageSchema = new mongoose.Schema(
    {
        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        message: {
            type: String,
            trim: true,
            default: ""
        },

        attachment: {
            type: String,
            default: ""
        },

        read: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)


module.exports = mongoose.model("Message", messageSchema)