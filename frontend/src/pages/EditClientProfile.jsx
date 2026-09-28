import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../css/ClientProfile.css"
import API_URL from "../config"

function ClientProfile() {

    const { user } = useAuth()
    const navigate = useNavigate()

    const [client, setClient] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")


    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const token =
                    localStorage.getItem("token")

                const response = await fetch(
                    `${API_URL}/clients/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to load profile"
                    )
                }

                setClient(data.client)

            } catch (error) {

                setError(error.message)

            } finally {

                setLoading(false)

            }

        }


        fetchProfile()

    }, [])


    if (loading) {

        return (
            <div className="client-profile-page">
                <div className="client-profile-loading">
                    Loading profile...
                </div>
            </div>
        )

    }


    if (error) {

        return (
            <div className="client-profile-page">

                <div className="client-profile-error">

                    <h2>
                        Client Profile
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={() =>
                            navigate("/client/profile/edit")
                        }
                    >
                        Create Profile
                    </button>

                </div>

            </div>
        )

    }


    return (

        <div className="client-profile-page">

            <div className="client-profile-container">

                {/* HEADER */}

                <div className="client-profile-header">

                    <div>

                        <p className="client-profile-label">
                            CLIENT PROFILE
                        </p>

                        <h1>
                            {client?.companyName}
                        </h1>

                        <p>
                            Manage your professional
                            client information
                        </p>

                    </div>


                    <button
                        className="client-profile-edit"
                        onClick={() =>
                            navigate(
                                "/client/profile/edit"
                            )
                        }
                    >
                        Edit Profile
                    </button>

                </div>


                {/* PROFILE CARD */}

                <div className="client-profile-card">

                    <div className="client-company-icon">
                        {client?.companyName
                            ?.charAt(0)
                            ?.toUpperCase()
                        }
                    </div>


                    <div className="client-company-info">

                        <h2>
                            {client?.companyName}
                        </h2>

                        <span className="client-role">
                            Client
                        </span>

                    </div>

                </div>


                {/* INFORMATION */}

                <div className="client-information-grid">


                    <div className="client-info-card">

                        <h3>
                            About Client
                        </h3>

                        <p>
                            {client?.about}
                        </p>

                    </div>


                    <div className="client-info-card">

                        <h3>
                            Contact Information
                        </h3>

                        <p>
                            {client?.contactInformation}
                        </p>

                    </div>


                    <div className="client-info-card">

                        <h3>
                            Account Information
                        </h3>

                        <div className="client-info-row">

                            <span>
                                Name
                            </span>

                            <strong>
                                {client?.user?.name ||
                                    user?.name}
                            </strong>

                        </div>


                        <div className="client-info-row">

                            <span>
                                Email
                            </span>

                            <strong>
                                {client?.user?.email ||
                                    user?.email}
                            </strong>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    )

}

export default ClientProfile