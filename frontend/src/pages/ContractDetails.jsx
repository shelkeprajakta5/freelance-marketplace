import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../context/AuthContext"
import "../css/ContractDetails.css"
import API_URL from "../config"

function ContractDetails() {

    const { id } = useParams()

    const { user } = useAuth()

    const navigate = useNavigate()


    const [contract, setContract] = useState(null)

    const [loading, setLoading] = useState(true)

    const [error, setError] = useState("")

    const [updating, setUpdating] = useState(false)

    const [submittedWork, setSubmittedWork] = useState("")


    const [showReviewForm, setShowReviewForm] = useState(false)

    const [rating, setRating] = useState(0)

    const [comment, setComment] = useState("")

    const [reviewSubmitting, setReviewSubmitting] = useState(false)

    const [reviewMessage, setReviewMessage] = useState("")


    // FETCH CONTRACT

    const fetchContract = async () => {

        try {

            setLoading(true)

            setError("")


            const token =
                localStorage.getItem("token")


            if (!token) {

                setError(
                    "Authentication token not found"
                )

                return

            }


            const response =
                await axios.get(
                    `${API_URL}/contracts/${id}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                )


            setContract(
                response.data.contract
            )


        } catch (error) {

            console.error(
                "Contract Details Error:",
                error
            )


            setError(
                error.response?.data?.message ||
                "Failed to load contract"
            )


        } finally {

            setLoading(false)

        }

    }


    useEffect(() => {

        if (id) {

            fetchContract()

        }

    }, [id])
    
    // GET USER ID


    const currentUserId =
        (
            user?._id ||
            user?.id
        )?.toString()


    // GET FREELANCER ID

    const freelancerId =
        (
            contract?.freelancer?._id ||
            contract?.freelancer?.id ||
            contract?.freelancer
        )?.toString()


    // GET CLIENT ID

    const clientId =
        (
            contract?.client?._id ||
            contract?.client?.id ||
            contract?.client
        )?.toString()


    // CHECK USER ROLE IN CONTRACT


    const isFreelancer =
        currentUserId === freelancerId


    const isClient =
        currentUserId === clientId


    // UPDATE CONTRACT STATUS

    const updateStatus = async (status) => {

        try {

            setUpdating(true)

            setError("")


            const token =
                localStorage.getItem("token")


            await axios.put(
                `${API_URL}/contracts/${id}/status`,
                {
                    status
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            )


            await fetchContract()


        } catch (error) {

            console.error(
                `${status} Error:`,
                error
            )


            alert(
                error.response?.data?.message ||
                `Failed to update contract to ${status}`
            )


        } finally {

            setUpdating(false)

        }

    }

    // START WORK
    // FREELANCER

    const startWork = async () => {

        await updateStatus(
            "In Progress"
        )

    }

    // SUBMIT WORK
    // FREELANCER

    const handleSubmitWork = async () => {

        if (!submittedWork.trim()) {

            alert(
                "Please enter your submitted work"
            )

            return

        }


        try {

            setUpdating(true)


            const token =
                localStorage.getItem("token")


            await axios.put(
               `${API_URL}/contracts/${id}/status`,
                {
                    status: "Submitted",
                    submittedWork:
                        submittedWork.trim()
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            )


            setSubmittedWork("")


            await fetchContract()


        } catch (error) {

            console.error(
                "Submit Work Error:",
                error
            )


            alert(
                error.response?.data?.message ||
                "Failed to submit work"
            )


        } finally {

            setUpdating(false)

        }

    }

    // REQUEST REVISION
    // CLIENT


    const requestRevision = async () => {

        await updateStatus(
            "Revision"
        )

    }

    // COMPLETE CONTRACT
    // CLIENT

    const completeContract = async () => {

        await updateStatus(
            "Completed"
        )

    }

    // ADD REVIEW

    const handleAddReview = async () => {

        if (!rating) {

            alert(
                "Please select a rating"
            )

            return

        }


        if (!comment.trim()) {

            alert(
                "Please enter a comment"
            )

            return

        }


        try {

            setReviewSubmitting(true)

            setReviewMessage("")


            const token =
                localStorage.getItem("token")


            const response =
                await axios.post(
                    `${API_URL}/reviews/add`,
                    {
                        contract: id,
                        rating: Number(rating),
                        comment:
                            comment.trim()
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                )


            setReviewMessage(
                response.data.message ||
                "Review added successfully"
            )


            setRating(0)

            setComment("")

            setShowReviewForm(false)


        } catch (error) {

            console.error(
                "Review Error:",
                error
            )


            setReviewMessage(
                error.response?.data?.message ||
                "Failed to add review"
            )


        } finally {

            setReviewSubmitting(false)

        }

    }

    // LOADING

    if (loading) {

        return (

            <div className="contract-details-page">

                <p>
                    Loading contract...
                </p>

            </div>

        )

    }

    // ERROR

    if (error || !contract) {

        return (

            <div className="contract-details-page">

                <div className="contract-details-error">

                    {error ||
                        "Contract not found"}

                </div>

            </div>

        )

    }

    // DEBUG INFORMATION


    console.log(
        "Current User ID:",
        currentUserId
    )

    console.log(
        "Freelancer ID:",
        freelancerId
    )

    console.log(
        "Client ID:",
        clientId
    )

    console.log(
        "Contract Status:",
        contract.status
    )

    console.log(
        "Is Freelancer:",
        isFreelancer
    )

    console.log(
        "Is Client:",
        isClient
    )


    return (

        <div className="contract-details-page">


            {/*  HEADER */}

            <div className="contract-details-header">

                <div>

                    <h2>
                        Contract Details
                    </h2>

                    <p>
                        {contract.project?.title}
                    </p>

                </div>


                <button
                    onClick={() =>
                        navigate(-1)
                    }
                >
                    Back
                </button>

            </div>


            {/* CONTRACT CARD*/}

            <div className="contract-details-card">


                {/* TITLE */}

                <div className="contract-title-section">

                    <h1>
                        {contract.project?.title}
                    </h1>


                    <span
                        className={
                            `details-status ${
                                contract.status
                                    ?.toLowerCase()
                                    .replace(
                                        /\s+/g,
                                        "-"
                                    )
                            }`
                        }
                    >
                        {contract.status}
                    </span>

                </div>


                {/* CONTRACT INFORMATION */}

                <div className="contract-details-grid">


                    <div>

                        <h4>
                            Client
                        </h4>

                        <p>
                            {contract.client?.name ||
                                "N/A"}
                        </p>

                        <p>
                            {contract.client?.email ||
                                "N/A"}
                        </p>

                    </div>


                    <div>

                        <h4>
                            Freelancer
                        </h4>

                        <p>
                            {contract.freelancer?.name ||
                                "N/A"}
                        </p>

                        <p>
                            {contract.freelancer?.email ||
                                "N/A"}
                        </p>

                    </div>


                    <div>

                        <h4>
                            Agreed Amount
                        </h4>

                        <p>
                            ₹{contract.agreedAmount}
                        </p>

                    </div>


                    <div>

                        <h4>
                            Delivery Time
                        </h4>

                        <p>
                            {contract.deliveryTime} days
                        </p>

                    </div>


                    <div>

                        <h4>
                            Start Date
                        </h4>

                        <p>

                            {contract.startDate
                                ? new Date(
                                    contract.startDate
                                ).toLocaleDateString()
                                : "Not started"}

                        </p>

                    </div>


                    <div>

                        <h4>
                            Completed Date
                        </h4>

                        <p>

                            {contract.completedDate
                                ? new Date(
                                    contract.completedDate
                                ).toLocaleDateString()
                                : "Not completed"}

                        </p>

                    </div>


                </div>


                {/* PROJECT */}

                <div className="contract-project-section">

                    <h3>
                        Project
                    </h3>

                    <p>
                        {contract.project?.description}
                    </p>

                </div>


                {/* FREELANCER WORK MANAGEMENT*/}

                {isFreelancer && (

                    <div className="contract-work-section">

                        <h3>
                            Work Management
                        </h3>


                        {/*  ACTIVE */}

                        {contract.status === "Active" && (

                            <div>

                                <p>
                                    Your contract is active.
                                    Start working when you are ready.
                                </p>


                                <button
                                    disabled={updating}
                                    onClick={startWork}
                                >

                                    {updating
                                        ? "Starting..."
                                        : "Start Work"}

                                </button>

                            </div>

                        )}


                        {/*  IN PROGRESS */}

                        {contract.status === "In Progress" && (

                            <div>

                                <p>
                                    You are currently working
                                    on this project.
                                </p>


                                <textarea
                                    value={submittedWork}
                                    onChange={(event) =>
                                        setSubmittedWork(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Describe or provide the completed work..."
                                    rows="6"
                                />


                                <button
                                    disabled={updating}
                                    onClick={
                                        handleSubmitWork
                                    }
                                >

                                    {updating
                                        ? "Submitting..."
                                        : "Submit Work"}

                                </button>

                            </div>

                        )}


                        {/* SUBMITTED*/}

                        {contract.status === "Submitted" && (

                            <div>

                                <p>
                                    Your work has been submitted
                                    and is waiting for client review.
                                </p>


                                {contract.submittedWork && (

                                    <div className="submitted-work">

                                        <h4>
                                            Submitted Work
                                        </h4>

                                        <p>
                                            {contract.submittedWork}
                                        </p>

                                    </div>

                                )}

                            </div>

                        )}


                        {/* REVISION*/}

                        {contract.status === "Revision" && (

                            <div>

                                <p>
                                    The client requested a revision.
                                    Please update your work and
                                    submit it again.
                                </p>


                                <textarea
                                    value={submittedWork}
                                    onChange={(event) =>
                                        setSubmittedWork(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Describe the revised work..."
                                    rows="6"
                                />


                                <button
                                    disabled={updating}
                                    onClick={
                                        handleSubmitWork
                                    }
                                >

                                    {updating
                                        ? "Submitting..."
                                        : "Submit Revised Work"}

                                </button>

                            </div>

                        )}


                        {/* COMPLETED */}

                        {contract.status === "Completed" && (

                            <div>

                                <p>
                                    This contract has been
                                    completed successfully.
                                </p>

                            </div>

                        )}


                        {/* CANCELLED */}

                        {contract.status === "Cancelled" && (

                            <div>

                                <p>
                                    This contract has been cancelled.
                                </p>

                            </div>

                        )}

                    </div>

                )}


                {/*  CLIENT WORK MANAGEMENT */}

                {isClient && (

                    <div className="contract-work-section">

                        <h3>
                            Work Review
                        </h3>


                        {/* ACTIVE */}

                        {contract.status === "Active" && (

                            <p>
                                The contract is active.
                                Waiting for the freelancer
                                to start work.
                            </p>

                        )}


                        {/* IN PROGRESS */}

                        {contract.status === "In Progress" && (

                            <p>
                                The freelancer is currently
                                working on your project.
                            </p>

                        )}


                        {/* SUBMITTED */}

                        {contract.status === "Submitted" && (

                            <div>

                                <p>
                                    The freelancer has submitted
                                    the work for your review.
                                </p>


                                {contract.submittedWork && (

                                    <div className="submitted-work">

                                        <h4>
                                            Submitted Work
                                        </h4>

                                        <p>
                                            {contract.submittedWork}
                                        </p>

                                    </div>

                                )}


                                <div className="contract-review-actions">

                                    <button
                                        disabled={updating}
                                        onClick={
                                            completeContract
                                        }
                                    >

                                        {updating
                                            ? "Completing..."
                                            : "Mark as Completed"}

                                    </button>


                                    <button
                                        disabled={updating}
                                        onClick={
                                            requestRevision
                                        }
                                    >

                                        {updating
                                            ? "Processing..."
                                            : "Request Revision"}

                                    </button>

                                </div>

                            </div>

                        )}


                        {/* REVISION */}

                        {contract.status === "Revision" && (

                            <p>
                                Revision has been requested.
                                Waiting for the freelancer to
                                submit the revised work.
                            </p>

                        )}


                        {/* COMPLETED */}

                        {contract.status === "Completed" && (

                            <div>

                                <p>
                                    This contract has been
                                    completed successfully.
                                </p>

                            </div>

                        )}

                    </div>

                )}


                {/*  SUBMITTED WORK*/}

                {contract.submittedWork &&
                    contract.status !== "Submitted" &&
                    contract.status !== "Revision" && (

                        <div className="contract-project-section">

                            <h3>
                                Submitted Work
                            </h3>

                            <p>
                                {contract.submittedWork}
                            </p>

                        </div>

                    )}


                {/*  REVIEW SECTION */}

                {contract.status === "Completed" &&
                    (isClient || isFreelancer) && (

                        <div className="contract-review-section">

                            <h3>
                                Review & Rating
                            </h3>


                            <p>
                                Share your experience with the
                                {isClient
                                    ? " freelancer."
                                    : " client"}
                            </p>


                            {reviewMessage && (

                                <div className="review-message">

                                    {reviewMessage}

                                </div>

                            )}


                            {!showReviewForm ? (

                                <button
                                    className="add-review-btn"
                                    onClick={() =>
                                        setShowReviewForm(
                                            true
                                        )
                                    }
                                >
                                    ⭐ Add Review
                                </button>

                            ) : (

                                <div className="review-form">

                                    <h4>
                                        Give Rating
                                    </h4>


                                    <div className="review-rating-input">

                                        {[1, 2, 3, 4, 5].map(
                                            star => (

                                                <button
                                                    type="button"
                                                    key={star}
                                                    className={
                                                        star <= rating
                                                            ? "selected"
                                                            : ""
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


                                    <textarea
                                        value={comment}
                                        onChange={(event) =>
                                            setComment(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Write your review..."
                                        rows="5"
                                    />


                                    <div className="review-form-actions">

                                        <button
                                            className="submit-review-btn"
                                            disabled={
                                                reviewSubmitting
                                            }
                                            onClick={
                                                handleAddReview
                                            }
                                        >

                                            {reviewSubmitting
                                                ? "Submitting..."
                                                : "Submit Review"}

                                        </button>


                                        <button
                                            className="cancel-review-btn"
                                            onClick={() => {

                                                setShowReviewForm(
                                                    false
                                                )

                                                setRating(0)

                                                setComment("")

                                                setReviewMessage("")

                                            }}
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                </div>

                            )}

                        </div>

                    )}

            </div>

        </div>

    )

}


export default ContractDetails