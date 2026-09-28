import { useEffect, useState } from "react"
import {useNavigate,  useParams} from "react-router-dom"

import "../css/AddReview.css"
import API_URL from "../config"

function AddReview() {

    const navigate =
        useNavigate()

    const { contractId } =
        useParams()


    const [contract, setContract] =
        useState(null)

    const [rating, setRating] =
        useState(0)

    const [comment, setComment] =
        useState("")

    const [loading, setLoading] =
        useState(true)

    const [submitting, setSubmitting] =
        useState(false)

    const [error, setError] =
        useState("")

    const [success, setSuccess] =
        useState("")


    const token =
        localStorage.getItem(
            "token"
        )


    // FETCH CONTRACT

    useEffect(() => {

        const fetchContract =
            async () => {

                try {

                    setLoading(true)

                    const response =
                        await fetch(
                            `${API_URL}/contracts/${contractId}`,
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
                            "Failed to load contract"
                        )

                    }


                    setContract(
                        data.contract
                    )


                } catch (error) {

                    setError(
                        error.message
                    )

                } finally {

                    setLoading(false)

                }

            }


        fetchContract()

    }, [
        contractId,
        token
    ])



    // SUBMIT REVIEW

    const handleSubmit =
        async (e) => {

            e.preventDefault()

            setError("")
            setSuccess("")


            if (
                rating === 0
            ) {

                setError(
                    "Please select a rating"
                )

                return

            }


            if (
                !comment.trim()
            ) {

                setError(
                    "Please enter a comment"
                )

                return

            }


            try {

                setSubmitting(true)


                const response =
                    await fetch(
                        `${API_URL}/reviews/add`,
                        {
                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`

                            },

                            body:
                                JSON.stringify({

                                    contract:
                                        contractId,

                                    rating:
                                        rating,

                                    comment:
                                        comment.trim()

                                })

                        }
                    )


                const data =
                    await response.json()


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to add review"
                    )

                }


                setSuccess(
                    "Review added successfully!"
                )


                setTimeout(() => {

                    navigate(
                        "/reviews"
                    )

                }, 1200)


            } catch (error) {

                setError(
                    error.message
                )

            } finally {

                setSubmitting(false)

            }

        }


    if (loading) {

        return (

            <div className="review-page">

                <div className="review-loading">

                    Loading contract...

                </div>

            </div>

        )

    }


    return (

        <div className="review-page">

            <div className="review-container">


                {/* HEADER */}

                <div className="review-header">

                    <p>
                        REVIEW & RATING
                    </p>

                    <h1>
                        Leave a Review
                    </h1>

                    <span>
                        Share your experience
                        after completing
                        the contract.
                    </span>

                </div>


                {/* CONTRACT INFO */}

                {contract && (

                    <div className="review-contract-card">

                        <h2>
                            Contract
                        </h2>

                        <div className="review-contract-info">

                            <div>

                                <span>
                                    Status
                                </span>

                                <strong>
                                    {contract.status}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Amount
                                </span>

                                <strong>
                                    ₹{contract.amount}
                                </strong>

                            </div>

                        </div>

                    </div>

                )}


                {/* FORM */}

                <form
                    className="review-form"
                    onSubmit={
                        handleSubmit
                    }
                >


                    {error && (

                        <div className="review-error">
                            {error}
                        </div>

                    )}


                    {success && (

                        <div className="review-success">
                            {success}
                        </div>

                    )}


                    {/* RATING */}

                    <div className="rating-section">

                        <label>
                            Your Rating
                        </label>


                        <div className="rating-stars">

                            {[1, 2, 3, 4, 5].map(
                                star => (

                                    <button
                                        type="button"
                                        key={star}
                                        className={
                                            star <= rating
                                                ? "star active"
                                                : "star"
                                        }
                                        onClick={() =>
                                            setRating(
                                                star
                                            )
                                        }
                                    >
                                        ★
                                    </button>

                                )
                            )}

                        </div>


                        <span className="rating-text">

                            {rating === 0
                                ? "Select a rating"
                                : `${rating} out of 5`
                            }

                        </span>

                    </div>


                    {/* COMMENT */}

                    <div className="review-field">

                        <label>
                            Comment
                        </label>

                        <textarea
                            value={
                                comment
                            }
                            onChange={e =>
                                setComment(
                                    e.target.value
                                )
                            }
                            placeholder="Write your review..."
                            rows="6"
                        />

                    </div>


                    {/* BUTTONS */}

                    <div className="review-buttons">

                        <button
                            type="button"
                            className="review-cancel"
                            onClick={() =>
                                navigate(
                                    -1
                                )
                            }
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="review-submit"
                            disabled={
                                submitting
                            }
                        >

                            {submitting
                                ? "Submitting..."
                                : "Submit Review"
                            }

                        </button>

                    </div>


                </form>

            </div>

        </div>

    )

}


export default AddReview