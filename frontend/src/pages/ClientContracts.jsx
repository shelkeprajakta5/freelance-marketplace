import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "../css/ClientContracts.css"
import API_URL from "../config"

function ClientContracts() {

    const { user } = useAuth()
    const navigate = useNavigate()

    const [contracts, setContracts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")


    useEffect(() => {

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

                    return

                }

                if (!user?._id) {

                    setError(
                        "User information not available"
                    )

                    return

                }


                const response =
                    await axios.get(
                        `${API_URL}/contracts/client/${user._id}`,
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
                    "Client contracts error:",
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

    }, [user])


    if (loading) {

        return (

            <div className="contracts-page">

                <div className="contracts-header">

                    <div>

                        <h2>
                            My Contracts
                        </h2>

                        <p>
                            Manage your active and completed projects
                        </p>

                    </div>

                </div>

                <div className="empty-contracts">

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

        <div className="contracts-page">


            {/*  HEADER */}

            <div className="contracts-header">

                <div>

                    <h2>
                        My Contracts
                    </h2>

                    <p>
                        Manage your active and completed projects
                    </p>

                </div>


                <button
                    onClick={() =>
                        navigate("/client-dashboard")
                    }
                >
                    Back to Dashboard
                </button>

            </div>


            {/*  ERROR*/}

            {error && (

                <div className="contract-error">

                    {error}

                </div>

            )}


            {/*  NO CONTRACTS*/}

            {!error && contracts.length === 0 ? (

                <div className="empty-contracts">

                    <h3>
                        No Contracts Yet
                    </h3>

                    <p>
                        Contracts will appear here after you
                        accept a freelancer proposal.
                    </p>

                </div>

            ) : (

                <div className="contracts-grid">

                    {contracts.map(
                        contract => (

                            <div
                                className="contract-card"
                                key={contract._id}
                            >


                                <div className="contract-card-header">

                                    <h3>
                                        {contract.project?.title ||
                                            "Untitled Project"
                                        }
                                    </h3>


                                    <span
                                        className={`contract-status ${contract.status
                                            ?.toLowerCase()
                                            .replace(/\s+/g, "-")
                                        }`}
                                    >
                                        {contract.status}
                                    </span>

                                </div>


                                <div className="contract-info">

                                    <p>

                                        <strong>
                                            Freelancer:
                                        </strong>{" "}

                                        {contract.freelancer?.name ||
                                            "N/A"
                                        }

                                    </p>


                                    <p>

                                        <strong>
                                            Amount:
                                        </strong>{" "}

                                        ₹{contract.agreedAmount}

                                    </p>


                                    <p>

                                        <strong>
                                            Delivery:
                                        </strong>{" "}

                                        {contract.deliveryTime} days

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


export default ClientContracts