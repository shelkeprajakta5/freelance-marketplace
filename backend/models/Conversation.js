const mongoose = require("mongoose")


const conversationSchema = new mongoose.Schema(
    {
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        freelancer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
)


conversationSchema.index(
    {
        client: 1,
        freelancer: 1
    },
    {
        unique: true
    }
)


module.exports = mongoose.model("Conversation",conversationSchema)