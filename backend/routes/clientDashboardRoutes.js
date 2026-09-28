const express = require("express")

const router = express.Router()


const {  getClientDashboard} = require("../controllers/clientDashboardController")


const { protect, authorizeRoles} = require("../middleware/authMiddleware")

// CLIENT DASHBOARD
router.get( "/", protect, authorizeRoles("Client"), getClientDashboard)


module.exports = router