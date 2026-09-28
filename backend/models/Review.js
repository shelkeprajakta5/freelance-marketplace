const mongoose = require("mongoose")


const reviewSchema = new mongoose.Schema(

    {
        reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        reviewedUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        contract: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Contract",
            required: true
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        comment: {
            type: String,
            required: true,
            trim: true
        }
    },

    {
        timestamps: true
    }

)


// One review per contract from one reviewer
reviewSchema.index(
    {
        reviewer: 1,
        contract: 1
    },
    {
        unique: true
    }
)


module.exports = mongoose.model( "Review", reviewSchema)