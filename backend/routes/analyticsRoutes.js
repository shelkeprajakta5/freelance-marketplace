const express = require("express")

const router = express.Router()


const {getAnalytics} = require("../controllers/analyticsController")


const {  protect,authorizeRoles} = require("../middleware/authMiddleware")

// GET ANALYTICS
// ADMIN 
router.get("/",protect,authorizeRoles("Admin"),getAnalytics)


module.exports = router