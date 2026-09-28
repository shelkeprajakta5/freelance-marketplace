import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../css/CreateClientProfile.css"
import API_URL from "../config"

function CreateClientProfile() {

    const { user } = useAuth()
    const navigate = useNavigate()

    const [companyName, setCompanyName] = useState("")
    const [about, setAbout] = useState("")
    const [contactInformation, setContactInformation] = useState("")

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")


    const handleSubmit = async (e) => {

        e.preventDefault()

        setError("")

        if (
            !companyName ||
            !about ||
            !contactInformation
        ) {

            setError("Please fill all fields")

            return
        }


        try {

            setLoading(true)

            const token =
                localStorage.getItem("token")


            const response = await fetch(
                `${API_URL}/clients/profile`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        companyName,
                        about,
                        contactInformation
                    })
                }
            )


            const data = await response.json()


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to create client profile"
                )

            }


            alert(
                "Client profile created successfully"
            )


            navigate("/client/profile")


        } catch (error) {

            setError(error.message)

        } finally {

            setLoading(false)

        }

    }


    return (

        <div className="create-client-page">

            <div className="create-client-container">


                {/* HEADER */}

                <div className="create-client-header">

                    <div>

                        <p>
                            CLIENT PROFILE
                        </p>

                        <h1>
                            Create Client Profile
                        </h1>

                        <span>
                            Add your company and contact
                            information
                        </span>

                    </div>

                    <div className="create-client-avatar">

                        {user?.name
                            ?.charAt(0)
                            ?.toUpperCase()
                        }

                    </div>

                </div>


                {/* FORM CARD */}

                <div className="create-client-card">

                    <form
                        onSubmit={handleSubmit}
                    >


                        {/* COMPANY NAME */}

                        <div className="form-group">

                            <label>
                                Company Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter company name"
                                value={companyName}
                                onChange={(e) =>
                                    setCompanyName(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* ABOUT */}

                        <div className="form-group">

                            <label>
                                About Client
                            </label>

                            <textarea
                                placeholder="Tell freelancers about yourself or your company"
                                value={about}
                                onChange={(e) =>
                                    setAbout(
                                        e.target.value
                                    )
                                }
                                rows="5"
                            />

                        </div>


                        {/* CONTACT */}

                        <div className="form-group">

                            <label>
                                Contact Information
                            </label>

                            <input
                                type="text"
                                placeholder="Enter phone number or contact details"
                                value={contactInformation}
                                onChange={(e) =>
                                    setContactInformation(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="create-client-error">

                                {error}

                            </div>

                        )}


                        {/* USER INFORMATION */}

                        <div className="create-client-account">

                            <h3>
                                Account Information
                            </h3>

                            <div>

                                <span>
                                    Name
                                </span>

                                <strong>
                                    {user?.name}
                                </strong>

                            </div>

                            <div>

                                <span>
                                    Email
                                </span>

                                <strong>
                                    {user?.email}
                                </strong>

                            </div>

                        </div>


                        {/* BUTTONS */}

                        <div className="create-client-actions">

                            <button
                                type="button"
                                className="cancel-client-btn"
                                onClick={() =>
                                    navigate(
                                        "/client-dashboard"
                                    )
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="create-client-btn"
                                disabled={loading}
                            >

                                {loading
                                    ? "Creating..."
                                    : "Create Profile"
                                }

                            </button>

                        </div>


                    </form>

                </div>

            </div>

        </div>

    )

}


export default CreateClientProfile