import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../css/Proposal.css"
import API_URL from "../config"


function ProposalDetails() {

    const navigate = useNavigate()
    const { id } = useParams()
    const { user } = useAuth()

    const [proposal, setProposal] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {

        fetchProposal()

    }, [id])

    const fetchProposal = async () => {

        try {

            const token =
                localStorage.getItem("token")

            const response =
                await fetch(
                    `${API_URL}/proposals/${id}`,
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
                    "Failed to load proposal"
                )

            }

            setProposal(data.proposal)

        } catch (error) {

            setError(error.message)

        } finally {

            setLoading(false)

        }

    }

    const handleAction = async (action) => {

        try {

            const token =
                localStorage.getItem("token")

            const response =
                await fetch(
                   `${API_URL}/proposals/${id}/${action}`,
                    {
                        method: "PUT",

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
                    `Failed to ${action} proposal`
                )

            }

            setProposal(
                data.proposal
            )

            alert(
                data.message ||
                `Proposal ${action}ed successfully`
            )

        } catch (error) {

            alert(error.message)

        }

    }

    const handleWithdraw = async () => {

        const confirmWithdraw =
            window.confirm(
                "Are you sure you want to withdraw this proposal?"
            )

        if (!confirmWithdraw) return

        try {

            const token =
                localStorage.getItem("token")

            const response =
                await fetch(
                    `${API_URL}/proposals/${id}`,
                    {
                        method: "DELETE",

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
                    "Failed to withdraw proposal"
                )

            }

            alert(
                data.message ||
                "Proposal withdrawn successfully"
            )

            navigate("/proposals/my")

        } catch (error) {

            alert(error.message)

        }

    }

    if (loading) {

        return (
            <div className="proposal-page">
                <div className="proposal-loading">
                    Loading proposal...
                </div>
            </div>
        )

    }

    if (error || !proposal) {

        return (
            <div className="proposal-page">

                <div className="proposal-error">

                    {error ||
                        "Proposal not found"}

                </div>

            </div>
        )

    }

    return (

        <div className="proposal-page">

            <div className="proposal-container">

                <div className="proposal-header">

                    <div>

                        <p className="proposal-label">
                            PROPOSAL DETAILS
                        </p>

                        <h1>
                            Proposal Details
                        </h1>

                        <p>
                            Review proposal information.
                        </p>

                    </div>

                    <button
                        className="proposal-secondary-btn"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>

                </div>


                <div className="proposal-details-card">


                    <div className="proposal-details-top">

                        <div>

                            <span className="details-label">
                                PROJECT
                            </span>

                            <h2>
                                {proposal.project?.title ||
                                    "Project"}
                            </h2>

                        </div>

                        <span
                            className={`proposal-status large ${proposal.status
                                ?.toLowerCase()
                                .replace(" ", "-")}`}
                        >
                            {proposal.status}
                        </span>

                    </div>


                    <div className="proposal-details-grid">

                        <div>

                            <span>
                                Freelancer
                            </span>

                            <strong>
                                {proposal.freelancer?.name ||
                                    "N/A"}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Client
                            </span>

                            <strong>
                                {proposal.project?.client?.name ||
                                    proposal.client?.name ||
                                    "N/A"}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Bid Amount
                            </span>

                            <strong>
                                ₹{proposal.bidAmount}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Delivery Time
                            </span>

                            <strong>
                                {proposal.deliveryTime} days
                            </strong>

                        </div>

                    </div>


                    <div className="proposal-cover-section">

                        <span>
                            Cover Letter
                        </span>

                        <p>
                            {proposal.coverLetter}
                        </p>

                    </div>


                    {proposal.attachments?.length > 0 && (

                        <div className="proposal-cover-section">

                            <span>
                                Attachments
                            </span>

                            <div className="proposal-attachments">

                                {proposal.attachments.map(
                                    (file, index) => (

                                        <div
                                            key={index}
                                            className="proposal-attachment"
                                        >
                                            📎 {file}
                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    )}


                    <div className="proposal-details-actions">


                        {user?.role === "Freelancer" &&
                            proposal.status === "Pending" && (

                                <button
                                    className="proposal-delete-btn"
                                    onClick={handleWithdraw}
                                >
                                    Withdraw Proposal
                                </button>

                            )}


                        {user?.role === "Client" &&
                            proposal.status === "Pending" && (

                                <>

                                    <button
                                        className="proposal-reject-btn"
                                        onClick={() =>
                                            handleAction(
                                                "reject"
                                            )
                                        }
                                    >
                                        Reject
                                    </button>

                                    <button
                                        className="proposal-accept-btn"
                                        onClick={() =>
                                            handleAction(
                                                "accept"
                                            )
                                        }
                                    >
                                        Accept
                                    </button>

                                </>

                            )}

                    </div>

                </div>

            </div>

        </div>

    )

}

export default ProposalDetails