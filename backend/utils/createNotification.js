const Notification =
    require("../models/Notification")


const sendNotification = async ({ user, type, message, referenceId = null}) => {

    try {

        if (
            !user ||
            !type ||
            !message
        ) {

            return null

        }


        const notification =
            await Notification.create({

                user,

                type,

                message,

                referenceId

            })


        return notification


    } catch (error) {

        console.log(
            "Notification Error:",
            error.message
        )

        return null

    }

}


module.exports =  sendNotification