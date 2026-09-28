const Notification =require("../models/Notification")

// CREATE NOTIFICATION


const createNotification = async (
    req,
    res
) => {

    try {

        const {
            user,
            type,
            message,
            referenceId
        } = req.body


        if (
            !user ||
            !type ||
            !message
        ) {

            return res.status(400).json({

                message:
                    "User, type and message are required"

            })

        }


        const notification =
            await Notification.create({

                user,

                type,

                message,

                referenceId:
                    referenceId || null

            })


        const populatedNotification =
            await Notification.findById(
                notification._id
            )

                .populate(
                    "user",
                    "name email role"
                )


        console.log(
            "NOTIFICATION CREATED:",
            populatedNotification
        )


        res.status(201).json({

            message:
                "Notification created successfully",

            notification:
                populatedNotification

        })


    } catch (error) {

        console.log(
            "CREATE NOTIFICATION ERROR:",
            error
        )


        res.status(500).json({

            message:
                "Failed to create notification",

            error:
                error.message

        })

    }

}


// GET MY NOTIFICATIONS
const getMyNotifications = async (
    req,
    res
) => {

    try {

        console.log(
            "FETCH NOTIFICATIONS FOR USER:",
            req.user.id
        )


        const notifications =
            await Notification.find({

                user:
                    req.user.id

            })

                .populate(
                    "user",
                    "name email role"
                )

                .sort({

                    createdAt:
                        -1

                })


        const unreadCount =
            await Notification.countDocuments({

                user:
                    req.user.id,

                isRead:
                    false

            })


        console.log(
            "NOTIFICATIONS FOUND:",
            notifications.length
        )


        console.log(
            "UNREAD COUNT:",
            unreadCount
        )


        res.status(200).json({

            count:
                notifications.length,

            unreadCount,

            notifications

        })


    } catch (error) {

        console.log(
            "GET NOTIFICATIONS ERROR:",
            error
        )


        res.status(500).json({

            message:
                "Failed to fetch notifications",

            error:
                error.message

        })

    }

}

// GET UNREAD COUNT


const getUnreadCount = async (
    req,
    res
) => {

    try {

        const unreadCount =
            await Notification.countDocuments({

                user:
                    req.user.id,

                isRead:
                    false

            })


        res.status(200).json({

            unreadCount

        })


    } catch (error) {

        console.log(error)


        res.status(500).json({

            message:
                "Failed to fetch unread count",

            error:
                error.message

        })

    }

}

// MARK ONE AS READ

const markAsRead = async (
    req,
    res
) => {

    try {

        const {
            id
        } = req.params


        const notification =
            await Notification.findById(
                id
            )


        if (!notification) {

            return res.status(404).json({

                message:
                    "Notification not found"

            })

        }


        if (
            notification.user.toString() !==
            req.user.id
        ) {

            return res.status(403).json({

                message:
                    "You are not allowed to update this notification"

            })

        }


        notification.isRead =
            true


        await notification.save()


        res.status(200).json({

            message:
                "Notification marked as read",

            notification

        })


    } catch (error) {

        console.log(error)


        res.status(500).json({

            message:
                "Failed to mark notification as read",

            error:
                error.message

        })

    }

}

// MARK ALL AS READ

const markAllAsRead = async (
    req,
    res
) => {

    try {

        await Notification.updateMany(

            {

                user:
                    req.user.id,

                isRead:
                    false

            },

            {

                $set: {

                    isRead:
                        true

                }

            }

        )


        res.status(200).json({

            message:
                "All notifications marked as read"

        })


    } catch (error) {

        console.log(error)


        res.status(500).json({

            message:
                "Failed to mark all notifications as read",

            error:
                error.message

        })

    }

}
// DELETE NOTIFICATION

const deleteNotification = async (
    req,
    res
) => {

    try {

        const {
            id
        } = req.params


        const notification =
            await Notification.findById(
                id
            )


        if (!notification) {

            return res.status(404).json({

                message:
                    "Notification not found"

            })

        }


        if (
            notification.user.toString() !==
            req.user.id
        ) {

            return res.status(403).json({

                message:
                    "You are not allowed to delete this notification"

            })

        }


        await Notification.findByIdAndDelete(
            id
        )


        res.status(200).json({

            message:
                "Notification deleted successfully"

        })


    } catch (error) {

        console.log(error)


        res.status(500).json({

            message:
                "Failed to delete notification",

            error:
                error.message

        })

    }

}

// EXPORT

module.exports = {createNotification, getMyNotifications,getUnreadCount,   markAsRead,markAllAsRead,deleteNotification}