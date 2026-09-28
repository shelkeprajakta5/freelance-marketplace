const mongoose = require("mongoose")

const Proposal = require("../models/Proposal")
const Contract = require("../models/Contract")
const Review = require("../models/Review")

// GET FREELANCER DASHBOARD
// FREELANCER ONLY

const getFreelancerDashboard = async (req, res) => {

    try {


        // CHECK USER

        if (!req.user) {

            return res.status(401).json({
                message: "User not authenticated"
            })

        }

        // CHECK ROLE

        if (req.user.role !== "Freelancer") {

            return res.status(403).json({
                message:
                    "Only freelancers can access this dashboard"
            })

        }


        const freelancerId = req.user.id

        // VALIDATE USER ID

        if (!mongoose.Types.ObjectId.isValid(freelancerId)) {

            return res.status(400).json({
                message: "Invalid freelancer user ID"
            })

        }

        // PROPOSAL STATISTICS

        const totalProposals =
            await Proposal.countDocuments({

                freelancer: freelancerId

            })


        const pendingProposals =
            await Proposal.countDocuments({

                freelancer: freelancerId,

                status: "Pending"

            })


        const acceptedProposals =
            await Proposal.countDocuments({

                freelancer: freelancerId,

                status: "Accepted"

            })


        // CONTRACT STATISTICS
        const activeContracts =
            await Contract.countDocuments({

                freelancer: freelancerId,

                status: {
                    $in: [
                        "Active",
                        "In Progress",
                        "Submitted"
                    ]
                }

            })


        const completedContracts =
            await Contract.countDocuments({

                freelancer: freelancerId,

                status: "Completed"

            })


        // REVIEW STATISTICS

        const ratingResult =
            await Review.aggregate([

                {
                    $match: {

                        reviewedUser:
                            new mongoose.Types.ObjectId(
                                freelancerId
                            )

                    }
                },

                {
                    $group: {

                        _id: null,

                        averageRating: {
                            $avg: "$rating"
                        },

                        totalReviews: {
                            $sum: 1
                        }

                    }
                }

            ])


        let averageRating = 0

        let totalReviews = 0


        if (ratingResult.length > 0) {

            averageRating =
                Number(
                    ratingResult[0]
                        .averageRating
                        .toFixed(1)
                )

            totalReviews =
                ratingResult[0].totalReviews

        }

        // RESPONSE


        res.status(200).json({

            message:
                "Freelancer dashboard fetched successfully",

            statistics: {

                totalProposals,

                pendingProposals,

                acceptedProposals,

                activeContracts,

                completedContracts,

                averageRating,

                totalReviews

            }

        })


    } catch (error) {

        console.log(
            "FREELANCER DASHBOARD ERROR:",
            error
        )

        res.status(500).json({

            message:
                "Failed to fetch freelancer dashboard",

            error:
                error.message

        })

    }

}


module.exports = { getFreelancerDashboard}