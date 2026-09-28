const express = require("express")

const { getProfile, updateProfile, changePassword} = require("../controllers/profileController")

const { protect} = require("../middleware/authMiddleware")

const uploadProfileImage = require("../middleware/uploadMiddleware")


const router = express.Router()


router.get( "/", protect, getProfile)


router.put( "/update", protect, uploadProfileImage.single("profileImage"), updateProfile)


router.put( "/change-password", protect, changePassword)


module.exports = router