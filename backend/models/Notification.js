const mongoose = require("mongoose")


const notificationSchema = new mongoose.Schema(

    {

        user: {

            type:
                mongoose.Schema.Types.ObjectId,

            ref:
                "User",

            required:
                true

        },


        type: {

            type:
                String,

            required:
                true,

            enum: [

                "New Proposal",

                "Proposal Accepted",

                "Proposal Rejected",

                "New Message",

                "Work Submitted",

                "Work Approved",

                "Revision Requested",

                "New Review",

                "Contract Completed",

                "General"

            ]

        },


        message: {

            type:
                String,

            required:
                true,

            trim:
                true

        },


        referenceId: {

            type:
                mongoose.Schema.Types.ObjectId,

            default:
                null

        },


        isRead: {

            type:
                Boolean,

            default:
                false

        }

    },

    {

        timestamps:
            true

    }

)


module.exports = mongoose.model( "Notification", notificationSchema)