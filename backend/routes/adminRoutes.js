const express = require("express")

const router = express.Router()


const {protect,authorizeRoles} = require("../middleware/authMiddleware")


const { getAdminDashboardStats,getAllUsers,getUserById,updateUser,toggleBlockUser,deleteUser} = require(  "../controllers/adminController")


// ADMIN DASHBOARD

router.get("/dashboard",protect,authorizeRoles("Admin"),getAdminDashboardStats)

// USER MANAGEMENT
// GET ALL USERS

router.get( "/users", protect, authorizeRoles("Admin"), getAllUsers)


// GET USER BY ID

router.get( "/users/:id", protect, authorizeRoles("Admin"), getUserById)


// UPDATE USER

router.put( "/users/:id", protect, authorizeRoles("Admin"), updateUser)


// BLOCK / UNBLOCK USER

router.put("/users/:id/block",protect,authorizeRoles("Admin"),toggleBlockUser)


// DELETE USER

router.delete( "/users/:id", protect, authorizeRoles("Admin"), deleteUser)


module.exports = router