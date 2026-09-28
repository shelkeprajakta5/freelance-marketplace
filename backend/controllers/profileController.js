const User = require("../models/User")
const bcrypt = require("bcryptjs")


// GET PROFILE

const getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
            .select("-password")

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            })

        }

        res.status(200).json({
            user
        })

    } catch (error) {

        res.status(500).json({
            message: "Failed to get profile",
            error: error.message
        })

    }
}



// UPDATE PROFILE

const updateProfile = async (req, res) => {

    try {

        const {
            name,
            phone,
            bio,
            skills,
            hourlyRate
        } = req.body


        const user = await User.findById(req.user.id)

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            })

        }


        if (name !== undefined) {
            user.name = name
        }

        if (phone !== undefined) {
            user.phone = phone
        }

        if (bio !== undefined) {
            user.bio = bio
        }

        if (skills !== undefined) {

            if (Array.isArray(skills)) {
                user.skills = skills
            }

            else {
                user.skills = skills
                    .split(",")
                    .map(skill => skill.trim())
                    .filter(skill => skill !== "")
            }

        }

        if (hourlyRate !== undefined) {
            user.hourlyRate = Number(hourlyRate)
        }


        if (req.file) {

            user.profileImage =
                `/uploads/profiles/${req.file.filename}`

        }


        await user.save()


        const updatedUser = await User.findById(user._id)
            .select("-password")


        res.status(200).json({

            message: "Profile updated successfully",

            user: updatedUser

        })

    } catch (error) {

        res.status(500).json({
            message: "Profile update failed",
            error: error.message
        })

    }
}



// CHANGE PASSWORD

const changePassword = async (req, res) => {

    try {

        const {
            currentPassword,
            newPassword
        } = req.body


        if (!currentPassword || !newPassword) {

            return res.status(400).json({
                message: "Current password and new password are required"
            })

        }


        if (newPassword.length < 6) {

            return res.status(400).json({
                message: "New password must be at least 6 characters"
            })

        }


        const user = await User.findById(req.user.id)

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            })

        }


        const passwordMatch = await bcrypt.compare(
            currentPassword,
            user.password
        )


        if (!passwordMatch) {

            return res.status(400).json({
                message: "Current password is incorrect"
            })

        }


        user.password = await bcrypt.hash(
            newPassword,
            10
        )


        await user.save()


        res.status(200).json({
            message: "Password changed successfully"
        })

    } catch (error) {

        res.status(500).json({
            message: "Password change failed",
            error: error.message
        })

    }
}


module.exports = { getProfile, updateProfile, changePassword}