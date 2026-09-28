const express = require("express")

const router = express.Router()

const { getFreelancerDashboard} = require("../controllers/freelancerDashboardController")

const { protect} = require("../middleware/authMiddleware")


// GET FREELANCER DASHBOARD

router.get( "/", protect, getFreelancerDashboard)


module.exports = router