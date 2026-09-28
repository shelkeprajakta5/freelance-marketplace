const Review = require("../models/Review")
const Contract = require("../models/Contract")
const User = require("../models/User")

// ADD REVIEW
// CLIENT / FREELANCER
const addReview = async (req, res) => {

    try {

        const {
            contract,
            rating,
            comment
        } = req.body

        // REQUIRED FIELDS

        if (
            !contract ||
            !rating ||
            !comment
        ) {

            return res.status(400).json({
                message:
                    "Contract, rating and comment are required"
            })

        }


        // VALIDATE RATIN

        if (
            Number(rating) < 1 ||
            Number(rating) > 5
        ) {

            return res.status(400).json({
                message:
                    "Rating must be between 1 and 5"
            })

        }

        // FIND CONTRACT

        const existingContract =
            await Contract.findById(contract)


        if (!existingContract) {

            return res.status(404).json({
                message:
                    "Contract not found"
            })

        }

        // CONTRACT MUST BE COMPLETED

        if (
            existingContract.status !==
            "Completed"
        ) {

            return res.status(400).json({
                message:
                    "Review can only be added after contract is completed"
            })

        }

        // CHECK PARTICIPANT

        const isClient =
            existingContract.client.toString() ===
            req.user.id


        const isFreelancer =
            existingContract.freelancer.toString() ===
            req.user.id


        if (
            !isClient &&
            !isFreelancer
        ) {

            return res.status(403).json({
                message:
                    "You are not a participant of this contract"
            })

        }


        // DETERMINE REVIEWED USER

        let reviewedUser


        if (isClient) {

            reviewedUser =
                existingContract.freelancer

        } else {

            reviewedUser =
                existingContract.client

        }

        // CHECK DUPLICATE REVIEW

        const existingReview =
            await Review.findOne({

                reviewer:
                    req.user.id,

                contract:
                    contract

            })


        if (existingReview) {

            return res.status(400).json({
                message:
                    "You have already reviewed this contract"
            })

        }
        // CHECK REVIEWED USER
        const user =
            await User.findById(
                reviewedUser
            )


        if (!user) {

            return res.status(404).json({
                message:
                    "Reviewed user not found"
            })

        }

        // CREATE REVIEW
  
        const review =
            await Review.create({

                reviewer:
                    req.user.id,

                reviewedUser:
                    reviewedUser,

                contract:
                    contract,

                rating:
                    Number(rating),

                comment:
                    comment.trim()

            })

        // POPULATE REVIEW
        const populatedReview =
            await Review.findById(
                review._id
            )
                .populate(
                    "reviewer",
                    "name email role"
                )
                .populate(
                    "reviewedUser",
                    "name email role"
                )
                .populate(
                    "contract",
                    "project amount status"
                )


        res.status(201).json({

            message:
                "Review added successfully",

            review:
                populatedReview

        })


    } catch (error) {

        console.log(error)

        // Duplicate index error
        if (
            error.code === 11000
        ) {

            return res.status(400).json({
                message:
                    "You have already reviewed this contract"
            })

        }


        res.status(500).json({

            message:
                "Failed to add review",

            error:
                error.message

        })

    }

}


// GET REVIEWS FOR USER
const getReviewsForUser = async (
    req,
    res
) => {

    try {

        const {
            userId
        } = req.params


        const user =
            await User.findById(
                userId
            )


        if (!user) {

            return res.status(404).json({
                message:
                    "User not found"
            })

        }


        const reviews =
            await Review.find({

                reviewedUser:
                    userId

            })
                .populate(
                    "reviewer",
                    "name email role"
                )
                .populate(
                    "reviewedUser",
                    "name email role"
                )
                .populate(
                    "contract",
                    "project amount status"
                )
                .sort({
                    createdAt: -1
                })


        // CALCULATE AVERAGE

        let averageRating = 0


        if (
            reviews.length > 0
        ) {

            const total =
                reviews.reduce(
                    (
                        sum,
                        review
                    ) =>
                        sum +
                        review.rating,
                    0
                )


            averageRating =
                Number(
                    (
                        total /
                        reviews.length
                    ).toFixed(1)
                )

        }


        res.status(200).json({

            count:
                reviews.length,

            averageRating,

            reviews

        })


    } catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "Failed to fetch reviews",

            error:
                error.message

        })

    }

}


// GET MY REVIEWS

const getMyReviews = async (
    req,
    res
) => {

    try {

        const reviews =
            await Review.find({

                reviewer:
                    req.user.id

            })
                .populate(
                    "reviewer",
                    "name email role"
                )
                .populate(
                    "reviewedUser",
                    "name email role"
                )
                .populate(
                    "contract",
                    "project amount status"
                )
                .sort({
                    createdAt: -1
                })


        res.status(200).json({

            count:
                reviews.length,

            reviews

        })


    } catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "Failed to fetch your reviews",

            error:
                error.message

        })

    }

}

// DELETE REVIEW
const deleteReview = async (
    req,
    res
) => {

    try {

        const {
            id
        } = req.params


        const review =
            await Review.findById(
                id
            )


        if (!review) {

            return res.status(404).json({
                message:
                    "Review not found"
            })

        }


        // Reviewer can delete own review
        if (
            review.reviewer.toString() !==
            req.user.id
        ) {

            return res.status(403).json({
                message:
                    "You are not allowed to delete this review"
            })

        }


        await Review.findByIdAndDelete(
            id
        )


        res.status(200).json({

            message:
                "Review deleted successfully"

        })


    } catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "Failed to delete review",

            error:
                error.message

        })

    }

}


module.exports = { addReview, getReviewsForUser,getMyReviews,deleteReview}