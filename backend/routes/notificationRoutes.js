const express =require("express")


const router =  express.Router()


const { createNotification, getMyNotifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification} =
    require( "../controllers/notificationController")


const { protect,authorizeRoles} = require( "../middleware/authMiddleware")


// CREATE NOTIFICATION

router.post( "/add", protect, authorizeRoles(  "Admin", "Client", "Freelancer"),createNotification)


// GET MY NOTIFICATIONS

router.get( "/my", protect, authorizeRoles( "Admin", "Client", "Freelancer"),  getMyNotifications)


// GET UNREAD COUNT

router.get("/unread-count",protect, authorizeRoles( "Admin", "Client", "Freelancer"),getUnreadCount)


// MARK ALL AS READ

router.put("/read-all",protect,authorizeRoles( "Admin", "Client", "Freelancer"), markAllAsRead)


// MARK ONE AS READ

router.put( "/:id/read", protect, authorizeRoles( "Admin", "Client", "Freelancer"), markAsRead)


// DELETE

router.delete( "/:id", protect, authorizeRoles( "Admin", "Client", "Freelancer"), deleteNotification)


module.exports = router