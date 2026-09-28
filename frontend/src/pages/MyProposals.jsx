import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../css/Proposal.css"
import API_URL from "../config"


function MyProposals() {

    const navigate = useNavigate()
    const { user } = useAuth()

    const [proposals, setProposals] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {

        if (user?.role !== "Freelancer") {
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

    const handleWithdraw = async (id) => {

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

            setProposals(
                proposals.filter(
                    proposal =>
                        proposal._id !== id
                )
            )

            alert(
                data.message ||
                "Proposal withdrawn successfully"
            )

        } catch (error) {

            alert(error.message)

        }

    }

    if (loading) {

        return (
            <div className="proposal-page">
                <div className="proposal-loading">
                    Loading proposals...
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
                            FREELANCER PANEL
                        </p>

                        <h1>
                            My Proposals
                        </h1>

                        <p>
                            Track all proposals you have submitted.
                        </p>

                    </div>

                    <button
                        className="proposal-secondary-btn"
                        onClick={() => navigate("/projects")}
                    >
                        Browse Projects
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
                            ? " proposal"
                            : " proposals"}
                    </span>

                </div>


                {proposals.length === 0 ? (

                    <div className="proposal-empty">

                        <div className="proposal-empty-icon">
                            📩
                        </div>

                        <h2>
                            No Proposals Yet
                        </h2>

                        <p>
                            Browse available projects and
                            submit your first proposal.
                        </p>

                        <button
                            className="proposal-primary-btn"
                            onClick={() =>
                                navigate("/projects")
                            }
                        >
                            Find Projects
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

                                            <button
                                                className="proposal-delete-btn"
                                                onClick={() =>
                                                    handleWithdraw(
                                                        proposal._id
                                                    )
                                                }
                                            >
                                                Withdraw
                                            </button>

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

export default MyProposals