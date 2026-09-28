import { useEffect, useState } from "react"
import { useParams,useNavigate} from "react-router-dom"

import { useAuth } from "../context/AuthContext"

import "../css/ReviewList.css"
import API_URL from "../config"

function ReviewList() {

    const { user } =
        useAuth()

    const { userId } =
        useParams()

    const navigate =
        useNavigate()


    const [reviews, setReviews] =
        useState([])

    const [averageRating, setAverageRating] =
        useState(0)

    const [loading, setLoading] =
        useState(true)

    const [error, setError] =
        useState("")

    // FETCH REVIEWS

    useEffect(() => {

        const fetchReviews =
            async () => {

                try {

                    setLoading(true)

                    setError("")


                    const token =
                        localStorage.getItem(
                            "token"
                        )


                    if (!token) {

                        setError(
                            "Authentication token not found"
                        )

                        return

                    }


                    let url


                    // USER ID EXISTS
                    // GET REVIEWS RECEIVED BY THAT USER

                    if (userId) {

                        url =
                            `${API_URL}/reviews/user/${userId}`

                    }


                    // NO USER ID
                    // GET REVIEWS SUBMITTED BY LOGGED-IN USER

                    else {

                        url =
                            `${API_URL}/reviews/my`

                    }


                    const response =
                        await fetch(
                            url,
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`
                                }
                            }
                        )


                    const data =
                        await response.json()


                    if (!response.ok) {

                        throw new Error(
                            data.message ||
                            "Failed to load reviews"
                        )

                    }


                    setReviews(
                        data.reviews || []
                    )


                    // AVERAGE RATING

                    if (userId) {

                        setAverageRating(
                            data.averageRating || 0
                        )

                    } else {

                        const reviewList =
                            data.reviews || []


                        if (
                            reviewList.length === 0
                        ) {

                            setAverageRating(0)

                        } else {

                            const total =
                                reviewList.reduce(
                                    (
                                        sum,
                                        review
                                    ) =>
                                        sum +
                                        Number(
                                            review.rating
                                        ),
                                    0
                                )


                            setAverageRating(
                                Number(
                                    (
                                        total /
                                        reviewList.length
                                    ).toFixed(1)
                                )
                            )

                        }

                    }


                } catch (error) {

                    console.error(
                        "Review List Error:",
                        error
                    )


                    setError(
                        error.message ||
                        "Failed to load reviews"
                    )

                } finally {

                    setLoading(false)

                }

            }


        if (user?._id) {

            fetchReviews()

        }

    }, [
        user,
        userId
    ])


    // STAR DISPLAY

    const renderStars =
        (rating) => {

            return (

                <div className="review-stars">

                    {[1, 2, 3, 4, 5].map(
                        star => (

                            <span
                                key={star}
                                className={
                                    star <=
                                    Number(rating)
                                        ? "filled"
                                        : ""
                                }
                            >
                                ★
                            </span>

                        )
                    )}

                </div>

            )

        }

    // LOADING

    if (loading) {

        return (

            <div className="reviews-page">

                <div className="reviews-loading">

                    Loading reviews...

                </div>

            </div>

        )

    }


    // PAGE

    return (

        <div className="reviews-page">

            <div className="reviews-container">


                {/* HEADER */}

                <div className="reviews-header">

                    <button
                        className="reviews-back-btn"
                        onClick={() =>
                            navigate(-1)
                        }
                    >
                        ← Back
                    </button>


                    <p>
                        REVIEWS & RATINGS
                    </p>


                    <h1>

                        {userId
                            ? "Reviews"
                            : "My Reviews"
                        }

                    </h1>


                    <span>

                        {userId
                            ? "See what clients and freelancers have to say."
                            : "Reviews you have submitted to other users."
                        }

                    </span>

                </div>


                {/*ERROR*/}

                {error && (

                    <div className="reviews-error">

                        {error}

                    </div>

                )}


                {/* RATING SUMMARY */}

                <div className="rating-summary">

                    <div className="average-number">

                        <strong>
                            {averageRating}
                        </strong>

                        <span>
                            / 5
                        </span>

                    </div>


                    {renderStars(
                        Math.round(
                            averageRating
                        )
                    )}


                    <p>

                        Based on{" "}

                        {reviews.length}{" "}

                        review
                        {reviews.length !== 1
                            ? "s"
                            : ""
                        }

                    </p>

                </div>


                {/* EMPTY*/}

                {reviews.length === 0 ? (

                    <div className="reviews-empty">

                        <div>
                            ⭐
                        </div>


                        <h2>

                            {userId
                                ? "No Reviews Yet"
                                : "You Have Not Submitted Any Reviews Yet"
                            }

                        </h2>


                        <p>

                            {userId
                                ? "Reviews will appear here after completed contracts."
                                : "Your submitted reviews will appear here after you review a completed contract."
                            }

                        </p>

                    </div>

                ) : (

                    <div className="review-list">

                        {reviews.map(
                            review => (

                                <div
                                    className="review-card"
                                    key={
                                        review._id
                                    }
                                >


                                    {/*  REVIEW TO */}

                                    <div className="review-card-top">


                                        <div className="reviewer-avatar">

                                            {(
                                                userId
                                                    ? review.reviewer?.name
                                                    : review.reviewedUser?.name
                                            )
                                                ?.charAt(0)
                                                ?.toUpperCase() ||
                                                "U"
                                            }

                                        </div>


                                        <div className="reviewer-info">

                                            <h3>

                                                {userId
                                                    ? (
                                                        review.reviewer?.name ||
                                                        "User"
                                                    )
                                                    : (
                                                        review.reviewedUser?.name ||
                                                        "User"
                                                    )
                                                }

                                            </h3>


                                            <span>

                                                {userId
                                                    ? (
                                                        review.reviewer?.role ||
                                                        ""
                                                    )
                                                    : (
                                                        `Reviewed: ${
                                                            review.reviewedUser?.role ||
                                                            ""
                                                        }`
                                                    )
                                                }

                                            </span>

                                        </div>


                                        <div className="review-date">

                                            {new Date(
                                                review.createdAt
                                            ).toLocaleDateString()}

                                        </div>


                                    </div>


                                    {/*  RATING */}

                                    <div className="review-rating">

                                        {renderStars(
                                            review.rating
                                        )}

                                    </div>


                                    {/* COMMENT*/}

                                    <p className="review-comment">

                                        {
                                            review.comment
                                        }

                                    </p>


                                    {/* CONTRACT*/}

                                    {review.contract && (

                                        <div className="review-contract-info">

                                            <span>
                                                Contract
                                            </span>


                                            <strong>

                                                {review.contract.project?.title ||
                                                    "Completed Contract"}

                                            </strong>

                                        </div>

                                    )}

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>

    )

}


export default ReviewList