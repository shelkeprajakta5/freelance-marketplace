const express = require("express")

const router = express.Router()


const { addReview, getReviewsForUser, getMyReviews, deleteReview} =
    require( "../controllers/reviewController")


const { protect, authorizeRoles} =
    require( "../middleware/authMiddleware")


// ADD REVIEW

router.post( "/add", protect, authorizeRoles("Client","Freelancer"), addReview)


// GET REVIEWS FOR USER

router.get( "/user/:userId", protect, authorizeRoles( "Admin", "Client", "Freelancer"), getReviewsForUser)


// GET MY REVIEWS

router.get( "/my", protect, authorizeRoles( "Client", "Freelancer"), getMyReviews)


// DELETE REVIEW

router.delete( "/:id", protect, authorizeRoles( "Client", "Freelancer"), deleteReview)


module.exports = router