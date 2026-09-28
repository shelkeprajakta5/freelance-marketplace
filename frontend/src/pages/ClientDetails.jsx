import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "../css/ClientDetails.css"
import API_URL from "../config"

function ClientDetails() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [client, setClient] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")


    useEffect(() => {

        const fetchClient = async () => {

            try {

                const token =
                    localStorage.getItem("token")

                const response = await fetch(
                   `${API_URL}/clients/${id}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                )

                const data = await response.json()

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Client not found"
                    )

                }

                setClient(data.client)

            } catch (error) {

                setError(error.message)

            } finally {

                setLoading(false)

            }

        }


        fetchClient()

    }, [id])


    if (loading) {

        return (
            <div className="client-details-page">
                Loading client details...
            </div>
        )

    }


    if (error) {

        return (
            <div className="client-details-page">

                <div className="client-details-error">

                    <h2>
                        Client Not Found
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={() =>
                            navigate("/clients")
                        }
                    >
                        Back to Clients
                    </button>

                </div>

            </div>
        )

    }


    return (

        <div className="client-details-page">

            <div className="client-details-container">

                <button
                    className="client-back-btn"
                    onClick={() =>
                        navigate("/clients")
                    }
                >
                    ← Back to Clients
                </button>


                <div className="client-details-card">


                    <div className="client-details-top">

                        <div className="client-details-avatar">

                            {client?.companyName
                                ?.charAt(0)
                                ?.toUpperCase()
                            }

                        </div>


                        <div>

                            <p className="client-details-label">
                                CLIENT
                            </p>

                            <h1>
                                {client?.companyName}
                            </h1>

                            <span>
                                {client?.user?.name}
                            </span>

                        </div>

                    </div>


                    <div className="client-details-content">


                        <div>

                            <h3>
                                About Client
                            </h3>

                            <p>
                                {client?.about}
                            </p>

                        </div>


                        <div>

                            <h3>
                                Contact Information
                            </h3>

                            <p>
                                {client?.contactInformation}
                            </p>

                        </div>


                        <div>

                            <h3>
                                Email
                            </h3>

                            <p>
                                {client?.user?.email}
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    )

}

export default ClientDetails