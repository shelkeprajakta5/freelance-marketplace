const User = require("../models/User")
const Project = require("../models/Project")
const Proposal = require("../models/Proposal")
const Contract = require("../models/Contract")
const Review = require("../models/Review")

// ADMIN DASHBOARD STATISTICS

const getAdminDashboardStats = async (req, res) => {

    try {

        const totalUsers =
            await User.countDocuments()


        const totalFreelancers =
            await User.countDocuments({
                role: "Freelancer"
            })


        const totalClients =
            await User.countDocuments({
                role: "Client"
            })


        const totalProjects =
            await Project.countDocuments()


        const totalProposals =
            await Proposal.countDocuments()


        const totalContracts =
            await Contract.countDocuments()


        const totalReviews =
            await Review.countDocuments()


        return res.status(200).json({

            success: true,

            stats: {

                totalUsers,

                totalFreelancers,

                totalClients,

                totalProjects,

                totalProposals,

                totalContracts,

                totalReviews

            }

        })


    } catch (error) {

        console.log(
            "Admin Dashboard Error:",
            error.message
        )


        return res.status(500).json({

            success: false,

            message:
                "Failed to load admin dashboard statistics"

        })

    }

}


// GET ALL USERS

const getAllUsers = async (req, res) => {

    try {

        const users =
            await User.find()
                .select("-password")
                .sort({
                    createdAt: -1
                })


        return res.status(200).json({

            success: true,

            users

        })


    } catch (error) {

        console.log(
            "Get Users Error:",
            error.message
        )


        return res.status(500).json({

            success: false,

            message:
                "Failed to load users"

        })

    }

}

// GET USER BY ID

const getUserById = async (req, res) => {

    try {

        const user =
            await User.findById(
                req.params.id
            )
                .select("-password")


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found"

            })

        }


        return res.status(200).json({

            success: true,

            user

        })


    } catch (error) {

        console.log(
            "Get User Error:",
            error.message
        )


        return res.status(500).json({

            success: false,

            message:
                "Failed to load user"

        })

    }

}


// UPDATE USER

const updateUser = async (req, res) => {

    try {

        const {
            name,
            email,
            role,
            phone,
            bio,
            hourlyRate
        } = req.body


        const user =
            await User.findById(
                req.params.id
            )


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found"

            })

        }


        if (name !== undefined) {
            user.name = name
        }


        if (email !== undefined) {
            user.email = email
        }


        if (role !== undefined) {
            user.role = role
        }


        if (phone !== undefined) {
            user.phone = phone
        }


        if (bio !== undefined) {
            user.bio = bio
        }


        if (hourlyRate !== undefined) {
            user.hourlyRate =
                Number(hourlyRate)
        }


        await user.save()


        const updatedUser =
            await User.findById(
                user._id
            )
                .select("-password")


        return res.status(200).json({

            success: true,

            message:
                "User updated successfully",

            user:
                updatedUser

        })


    } catch (error) {

        console.log(
            "Update User Error:",
            error.message
        )


        return res.status(500).json({

            success: false,

            message:
                "Failed to update user"

        })

    }

}


// BLOCK / UNBLOCK USER


const toggleBlockUser = async (req, res) => {

    try {

        const user =
            await User.findById(
                req.params.id
            )


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found"

            })

        }


        if (
            user._id.toString() ===
            req.user._id.toString()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "You cannot block yourself"

            })

        }


        if (user.role === "Admin") {

            return res.status(400).json({

                success: false,

                message:
                    "Admin users cannot be blocked"

            })

        }


        user.isBlocked =
            !user.isBlocked


        await user.save()


        return res.status(200).json({

            success: true,

            message:
                user.isBlocked
                    ? "User blocked successfully"
                    : "User unblocked successfully",

            user: {

                _id: user._id,

                name: user.name,

                email: user.email,

                role: user.role,

                isBlocked:
                    user.isBlocked

            }

        })


    } catch (error) {

        console.log(
            "Block User Error:",
            error.message
        )


        return res.status(500).json({

            success: false,

            message:
                "Failed to update user block status"

        })

    }

}

// DELETE USER


const deleteUser = async (req, res) => {

    try {

        const user =
            await User.findById(
                req.params.id
            )


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found"

            })

        }


        if (
            user._id.toString() ===
            req.user._id.toString()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "You cannot delete yourself"

            })

        }


        if (user.role === "Admin") {

            return res.status(400).json({

                success: false,

                message:
                    "Admin users cannot be deleted"

            })

        }


        await User.findByIdAndDelete(
            req.params.id
        )


        return res.status(200).json({

            success: true,

            message:
                "User deleted successfully"

        })


    } catch (error) {

        console.log(
            "Delete User Error:",
            error.message
        )


        return res.status(500).json({

            success: false,

            message:
                "Failed to delete user"

        })

    }

}


module.exports = {getAdminDashboardStats,getAllUsers,getUserById,updateUser,toggleBlockUser,deleteUser}