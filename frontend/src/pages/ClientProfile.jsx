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


    /* =========================
       LOADING
    ========================= */

    if (loading) {

        return (

            <div className="client-profile-page">

                <div className="client-profile-loading">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading client profile...
                    </p>

                </div>

            </div>

        )

    }


    /* PROFILE NOT FOUND */

    if (error) {

        return (

            <div className="client-profile-page">

                <div className="client-profile-error-card">

                    <div className="profile-error-icon">
                        🏢
                    </div>


                    <p className="client-profile-label">
                        CLIENT PROFILE
                    </p>


                    <h1>
                        Create Your Client Profile
                    </h1>


                    <p className="profile-error-message">
                        {error === "Client profile not found"
                            ? "You haven't created your client profile yet. Add your company and contact information to get started."
                            : error
                        }
                    </p>


                    <div className="client-error-actions">

                        <button
                            className="create-profile-button"
                            onClick={() =>
                                navigate(
                                    "/client/profile/create"
                                )
                            }
                        >
                            + Create Client Profile
                        </button>


                        <button
                            className="back-dashboard-button"
                            onClick={() =>
                                navigate(
                                    "/client-dashboard"
                                )
                            }
                        >
                            Back to Dashboard
                        </button>

                    </div>

                </div>

            </div>

        )

    }


    /* PROFILE DISPLAY*/

    return (

        <div className="client-profile-page">

            <div className="client-profile-container">


                {/* TOP NAVIGATION */}

                <div className="client-profile-topbar">

                    <button
                        className="back-dashboard-link"
                        onClick={() =>
                            navigate(
                                "/client-dashboard"
                            )
                        }
                    >
                        ← Back to Dashboard
                    </button>

                </div>


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
                        ✏️ Edit Profile
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


                {/* INFORMATION GRID */}

                <div className="client-information-grid">


                    {/* ABOUT */}

                    <div className="client-info-card">

                        <div className="client-info-card-title">

                            <div className="client-info-icon">
                                🏢
                            </div>

                            <h3>
                                About Client
                            </h3>

                        </div>


                        <p>
                            {client?.about ||
                                "No information available."
                            }
                        </p>

                    </div>


                    {/* CONTACT */}

                    <div className="client-info-card">

                        <div className="client-info-card-title">

                            <div className="client-info-icon">
                                📞
                            </div>

                            <h3>
                                Contact Information
                            </h3>

                        </div>


                        <p>
                            {client?.contactInformation ||
                                "No contact information available."
                            }
                        </p>

                    </div>


                    {/* ACCOUNT */}

                    <div className="client-info-card account-info-card">

                        <div className="client-info-card-title">

                            <div className="client-info-icon">
                                👤
                            </div>

                            <h3>
                                Account Information
                            </h3>

                        </div>


                        <div className="client-info-row">

                            <span>
                                Name
                            </span>

                            <strong>
                                {client?.user?.name ||
                                    user?.name ||
                                    "N/A"
                                }
                            </strong>

                        </div>


                        <div className="client-info-row">

                            <span>
                                Email
                            </span>

                            <strong>
                                {client?.user?.email ||
                                    user?.email ||
                                    "N/A"
                                }
                            </strong>

                        </div>


                        <div className="client-info-row">

                            <span>
                                Role
                            </span>

                            <strong className="client-role-badge">
                                Client
                            </strong>

                        </div>

                    </div>

                </div>


                {/* BOTTOM ACTION */}

                <div className="client-profile-bottom">

                    <button
                        className="client-profile-edit-bottom"
                        onClick={() =>
                            navigate(
                                "/client/profile/edit"
                            )
                        }
                    >
                        ✏️ Edit Client Profile
                    </button>

                </div>

            </div>

        </div>

    )

}


export default ClientProfile