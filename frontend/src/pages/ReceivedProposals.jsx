import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../css/Proposal.css"
import API_URL from "../config"


function ReceivedProposals() {

    const navigate = useNavigate()
    const { user } = useAuth()

    const [proposals, setProposals] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {

        if (user?.role !== "Client") {
            navigate("/")
            return
        }

        fetchProposals()

    }, [user])

    const fetchProposals = async () => {

        try {

            const token =
                localStorage.getItem("token")

            const response =
                await fetch(
                 `${API_URL}/proposals`,
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
                    "Failed to load proposals"
                )

            }

            setProposals(
                data.proposals || []
            )

        } catch (error) {

            setError(error.message)

        } finally {

            setLoading(false)

        }

    }

    if (loading) {

        return (
            <div className="proposal-page">
                <div className="proposal-loading">
                    Loading received proposals...
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
                            CLIENT PANEL
                        </p>

                        <h1>
                            Received Proposals
                        </h1>

                        <p>
                            Review proposals submitted for
                            your projects.
                        </p>

                    </div>

                    <button
                        className="proposal-secondary-btn"
                        onClick={() =>
                            navigate("/projects")
                        }
                    >
                        My Projects
                    </button>

                </div>


                {error && (

                    <div className="proposal-error">
                        {error}
                    </div>

                )}


                <div className="proposal-result-info">

                    <strong>
                        {proposals.length}
                    </strong>

                    <span>
                        {proposals.length === 1
                            ? " proposal received"
                            : " proposals received"}
                    </span>

                </div>


                {proposals.length === 0 ? (

                    <div className="proposal-empty">

                        <div className="proposal-empty-icon">
                            📩
                        </div>

                        <h2>
                            No Proposals Received
                        </h2>

                        <p>
                            Proposals submitted to your
                            projects will appear here.
                        </p>

                        <button
                            className="proposal-primary-btn"
                            onClick={() =>
                                navigate("/projects")
                            }
                        >
                            View My Projects
                        </button>

                    </div>

                ) : (

                    <div className="proposal-grid">

                        {proposals.map(
                            proposal => (

                                <div
                                    className="proposal-card"
                                    key={proposal._id}
                                >

                                    <div className="proposal-card-top">

                                        <span
                                            className={`proposal-status ${proposal.status
                                                ?.toLowerCase()
                                                .replace(" ", "-")}`}
                                        >
                                            {proposal.status}
                                        </span>

                                        <strong>
                                            ₹{proposal.bidAmount}
                                        </strong>

                                    </div>


                                    <h2>
                                        {proposal.project?.title ||
                                            "Project"}
                                    </h2>


                                    <div className="proposal-freelancer">

                                        <span>
                                            Freelancer
                                        </span>

                                        <strong>
                                            {proposal.freelancer?.name ||
                                                "N/A"}
                                        </strong>

                                    </div>


                                    <p className="proposal-cover">

                                        {proposal.coverLetter?.length > 120
                                            ? proposal.coverLetter.substring(
                                                0,
                                                120
                                            ) + "..."
                                            : proposal.coverLetter}

                                    </p>


                                    <div className="proposal-meta">

                                        <div>

                                            <span>
                                                Delivery
                                            </span>

                                            <strong>
                                                {proposal.deliveryTime} days
                                            </strong>

                                        </div>

                                        <div>

                                            <span>
                                                Submitted
                                            </span>

                                            <strong>
                                                {proposal.createdAt
                                                    ? new Date(
                                                        proposal.createdAt
                                                    ).toLocaleDateString()
                                                    : "N/A"}
                                            </strong>

                                        </div>

                                    </div>


                                    <div className="proposal-card-actions">

                                        <button
                                            className="proposal-view-btn"
                                            onClick={() =>
                                                navigate(
                                                    `/proposals/${proposal._id}`
                                                )
                                            }
                                        >
                                            View Details
                                        </button>


                                        {proposal.status === "Pending" && (

                                            <>

                                                <button
                                                    className="proposal-reject-btn"
                                                    onClick={() =>
                                                        navigate(
                                                            `/proposals/${proposal._id}`
                                                        )
                                                    }
                                                >
                                                    Reject
                                                </button>

                                                <button
                                                    className="proposal-accept-btn"
                                                    onClick={() =>
                                                        navigate(
                                                            `/proposals/${proposal._id}`
                                                        )
                                                    }
                                                >
                                                    Accept
                                                </button>

                                            </>

                                        )}

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>

    )

}

export default ReceivedProposals