import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "../css/FreelancerContracts.css"
import API_URL from "../config"

function FreelancerContracts() {

    const { user, loading: authLoading } = useAuth()

    const navigate = useNavigate()

    const [contracts, setContracts] = useState([])

    const [loading, setLoading] = useState(true)

    const [error, setError] = useState("")


    useEffect(() => {

        // Wait until AuthContext finishes loading
        if (authLoading) {
            return
        }


        const fetchContracts = async () => {

            try {

                setLoading(true)

                setError("")


                const token =
                    localStorage.getItem("token")


                if (!token) {

                    setError(
                        "Authentication token not found"
                    )

                    setLoading(false)

                    return

                }


                if (!user) {

                    setError(
                        "User information not available"
                    )

                    setLoading(false)

                    return

                }


                // Support both _id and id
                const freelancerId =
                    user._id || user.id


                if (!freelancerId) {

                    setError(
                        "Freelancer ID not found"
                    )

                    setLoading(false)

                    return

                }


                const response =
                    await axios.get(

                        `${API_URL}/contracts/freelancer/${freelancerId}`,

                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }

                    )


                setContracts(
                    response.data.contracts || []
                )


            } catch (error) {

                console.error(
                    "Freelancer contracts error:",
                    error
                )


                setError(
                    error.response?.data?.message ||
                    "Failed to load contracts"
                )


            } finally {

                setLoading(false)

            }

        }


        fetchContracts()

    }, [user, authLoading])

    // AUTH LOADING
    

    if (authLoading) {

        return (

            <div className="freelancer-contracts-page">

                <div className="freelancer-empty-contracts">

                    <h3>
                        Loading user information...
                    </h3>

                    <p>
                        Please wait.
                    </p>

                </div>

            </div>

        )

    }


   
    // CONTRACT LOADING

    if (loading) {

        return (

            <div className="freelancer-contracts-page">

                <div className="freelancer-contracts-header">

                    <div>

                        <h2>
                            My Contracts
                        </h2>

                        <p>
                            Manage your assigned projects and work
                        </p>

                    </div>

                </div>


                <div className="freelancer-empty-contracts">

                    <h3>
                        Loading contracts...
                    </h3>

                    <p>
                        Please wait while your contracts are loaded.
                    </p>

                </div>

            </div>

        )

    }


    return (

        <div className="freelancer-contracts-page">


            {/* HEADER */}

            <div className="freelancer-contracts-header">

                <div>

                    <h2>
                        My Contracts
                    </h2>

                    <p>
                        Manage your assigned projects and work
                    </p>

                </div>


                <button
                    onClick={() =>
                        navigate(
                            "/freelancer-dashboard"
                        )
                    }
                >
                    Back to Dashboard
                </button>

            </div>


            {/* ERROR */}

            {error && (

                <div className="freelancer-contract-error">

                    {error}

                </div>

            )}


            {/*  NO CONTRACTS */}

            {!error && contracts.length === 0 ? (

                <div className="freelancer-empty-contracts">

                    <h3>
                        No Contracts Yet
                    </h3>

                    <p>
                        Accepted proposals will appear here as
                        contracts.
                    </p>

                </div>

            ) : (

                <div className="freelancer-contracts-grid">

                    {contracts.map(
                        (contract) => (

                            <div
                                className="freelancer-contract-card"
                                key={contract._id}
                            >

                                <div className="freelancer-contract-card-header">

                                    <h3>
                                        {
                                            contract.project?.title ||
                                            "Untitled Project"
                                        }
                                    </h3>


                                    <span
                                        className={
                                            `freelancer-contract-status ${
                                                contract.status
                                                    ?.toLowerCase()
                                                    .replace(
                                                        /\s+/g,
                                                        "-"
                                                    )
                                            }`
                                        }
                                    >
                                        {
                                            contract.status ||
                                            "Active"
                                        }
                                    </span>

                                </div>


                                <div className="freelancer-contract-info">

                                    <p>

                                        <strong>
                                            Client:
                                        </strong>{" "}

                                        {
                                            contract.client?.name ||
                                            "N/A"
                                        }

                                    </p>


                                    <p>

                                        <strong>
                                            Amount:
                                        </strong>{" "}

                                        ₹
                                        {
                                            contract.agreedAmount ||
                                            contract.amount ||
                                            0
                                        }

                                    </p>


                                    <p>

                                        <strong>
                                            Delivery:
                                        </strong>{" "}

                                        {
                                            contract.deliveryTime ||
                                            0
                                        }{" "}

                                        days

                                    </p>

                                </div>


                                <button
                                    onClick={() =>
                                        navigate(
                                            `/contracts/${contract._id}`
                                        )
                                    }
                                >
                                    View Contract
                                </button>


                            </div>

                        )
                    )}

                </div>

            )}

        </div>

    )

}


export default FreelancerContracts