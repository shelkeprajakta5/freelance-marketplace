import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../css/FreelancerDashboard.css"
import API_URL from "../config"

function FreelancerDashboard() {

    const {
        user,
        logout
    } = useAuth()

    const navigate = useNavigate()


    const [statistics, setStatistics] = useState({

        totalProposals: 0,
        pendingProposals: 0,
        acceptedProposals: 0,
        activeContracts: 0,
        completedContracts: 0,
        averageRating: 0,
        totalReviews: 0

    })


    const [loading, setLoading] = useState(true)


    // GET FREELANCER DASHBOARD
    
    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                const token =
                    localStorage.getItem("token")

                const response =
                    await fetch(
                        `${API_URL}/freelancer-dashboard`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    )


                const data =
                    await response.json()


                if (response.ok) {

                    setStatistics(
                        data.statistics
                    )

                } else {

                    console.log(
                        data.message
                    )

                }

            } catch (error) {

                console.log(
                    "Dashboard Error:",
                    error
                )

            } finally {

                setLoading(false)

            }

        }


        fetchDashboard()

    }, [])


    // LOGOUT

    const handleLogout = async () => {

        await logout()

        navigate("/login")

    }


    return (

        <div className="freelancer-dashboard">


            {/*  NAVBAR*/}

            <nav className="freelancer-navbar">


                <div className="freelancer-brand">

                    <div className="freelancer-logo">
                        FM
                    </div>

                    <h2>
                        Freelance Marketplace
                    </h2>

                </div>


                <div className="freelancer-user">


                    <div className="freelancer-user-info">

                        <strong>
                            {user?.name}
                        </strong>

                        <span>
                            Freelancer
                        </span>

                    </div>


                    <button
                        className="freelancer-contract-btn"
                        onClick={() =>
                            navigate(
                                "/freelancer/contracts"
                            )
                        }
                    >
                        Contracts
                    </button>


                    <button
                        className="freelancer-message-btn"
                        onClick={() =>
                            navigate("/messages")
                        }
                    >
                        💬 Messages
                    </button>


                    <button
                        onClick={handleLogout}
                        className="freelancer-logout"
                    >
                        Logout
                    </button>


                </div>


            </nav>



            {/* MAIN CONTENT */}

            <main className="freelancer-content">


                {/* WELCOME*/}

                <div className="freelancer-welcome">

                    <h1>
                        Freelancer Dashboard
                    </h1>

                    <p>
                        Welcome back, {user?.name}
                    </p>

                </div>



                {/*  STATISTICS */}

                <div className="freelancer-statistics">


                    {/* TOTAL PROPOSALS */}

                    <div className="freelancer-stat-card">

                        <div className="freelancer-stat-icon">
                            📩
                        </div>

                        <div>

                            <h3>
                                Total Proposals
                            </h3>

                            <strong>
                                {loading
                                    ? "..."
                                    : statistics.totalProposals}
                            </strong>

                        </div>

                    </div>



                    {/* PENDING PROPOSALS */}

                    <div className="freelancer-stat-card">

                        <div className="freelancer-stat-icon">
                            ⏳
                        </div>

                        <div>

                            <h3>
                                Pending
                            </h3>

                            <strong>
                                {loading
                                    ? "..."
                                    : statistics.pendingProposals}
                            </strong>

                        </div>

                    </div>



                    {/* ACCEPTED PROPOSALS */}

                    <div className="freelancer-stat-card">

                        <div className="freelancer-stat-icon">
                            ✅
                        </div>

                        <div>

                            <h3>
                                Accepted
                            </h3>

                            <strong>
                                {loading
                                    ? "..."
                                    : statistics.acceptedProposals}
                            </strong>

                        </div>

                    </div>



                    {/* ACTIVE CONTRACTS */}

                    <div className="freelancer-stat-card">

                        <div className="freelancer-stat-icon">
                            📋
                        </div>

                        <div>

                            <h3>
                                Active Contracts
                            </h3>

                            <strong>
                                {loading
                                    ? "..."
                                    : statistics.activeContracts}
                            </strong>

                        </div>

                    </div>



                    {/* COMPLETED CONTRACTS */}

                    <div className="freelancer-stat-card">

                        <div className="freelancer-stat-icon">
                            🏆
                        </div>

                        <div>

                            <h3>
                                Completed
                            </h3>

                            <strong>
                                {loading
                                    ? "..."
                                    : statistics.completedContracts}
                            </strong>

                        </div>

                    </div>



                    {/* RATING */}

                    <div className="freelancer-stat-card">

                        <div className="freelancer-stat-icon">
                            ⭐
                        </div>

                        <div>

                            <h3>
                                Average Rating
                            </h3>

                            <strong>
                                {loading
                                    ? "..."
                                    : statistics.averageRating}
                            </strong>

                            {!loading &&
                                statistics.totalReviews > 0 && (

                                    <span className="review-count">
                                        {statistics.totalReviews}
                                        {" "}
                                        reviews
                                    </span>

                                )}

                        </div>

                    </div>


                </div>



                {/* QUICK ACTION CARDS*/}

                <div className="freelancer-cards">


                    {/* FIND PROJECTS */}

                    <div
                        className="freelancer-card"
                        onClick={() =>
                            navigate("/projects")
                        }
                    >

                        <div className="freelancer-card-icon">
                            🔍
                        </div>

                        <h3>
                            Find Projects
                        </h3>

                        <p>
                            Browse available freelance projects
                        </p>

                    </div>



                    {/* MY PROPOSALS */}

                    <div
                        className="freelancer-card"
                        onClick={() =>
                            navigate("/my-proposals")
                        }
                    >

                        <div className="freelancer-card-icon">
                            📩
                        </div>

                        <h3>
                            My Proposals
                        </h3>

                        <p>
                            Track your submitted proposals
                        </p>

                    </div>



                    {/* MY CONTRACTS */}

                    <div
                        className="freelancer-card contract-card"
                        onClick={() =>
                            navigate(
                                "/freelancer/contracts"
                            )
                        }
                    >

                        <div className="freelancer-card-icon">
                            📋
                        </div>

                        <h3>
                            My Contracts
                        </h3>

                        <p>
                            View and manage your current work
                        </p>

                    </div>



                    {/* MESSAGES */}

                    <div
                        className="freelancer-card message-card"
                        onClick={() =>
                            navigate("/messages")
                        }
                    >

                        <div className="freelancer-card-icon">
                            💬
                        </div>

                        <h3>
                            Messages
                        </h3>

                        <p>
                            Chat with your clients
                        </p>

                    </div>



                    {/* REVIEWS */}

                    <div
                        className="freelancer-card review-card"
                        onClick={() =>
                            navigate("/reviews")
                        }
                    >

                        <div className="freelancer-card-icon">
                            ⭐
                        </div>

                        <h3>
                            Reviews
                        </h3>

                        <p>
                            View your ratings and reviews
                        </p>

                    </div>



                    {/* PROFILE */}

                    <div
                        className="freelancer-card"
                        onClick={() =>
                            navigate(
                                "/freelancer/profile"
                            )
                        }
                    >

                        <div className="freelancer-card-icon">
                            👤
                        </div>

                        <h3>
                            My Profile
                        </h3>

                        <p>
                            Manage your freelancer profile
                        </p>

                    </div>


                </div>



                {/*  CONTRACT SECTION= */}

                <div className="freelancer-contract-section">

                    <div>

                        <h2>
                            Contract & Work Management
                        </h2>

                        <p>
                            View your contracts, manage active
                            work and submit completed work to clients.
                        </p>

                    </div>


                    <button
                        onClick={() =>
                            navigate(
                                "/freelancer/contracts"
                            )
                        }
                    >
                        View My Contracts
                    </button>


                </div>



                {/*  MESSAGE SECTION */}

                <div className="freelancer-message-section">

                    <div>

                        <h2>
                            Messages
                        </h2>

                        <p>
                            Communicate with your clients
                            about projects and contracts.
                        </p>

                    </div>


                    <button
                        onClick={() =>
                            navigate("/messages")
                        }
                    >
                        Open Messages
                    </button>


                </div>


            </main>


        </div>

    )

}


export default FreelancerDashboard