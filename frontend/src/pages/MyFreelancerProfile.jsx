import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../css/MyFreelancerProfile.css"
import API_URL from "../config"

function MyFreelancerProfile() {

    const navigate = useNavigate()

    const [freelancer, setFreelancer] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")


    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const token = localStorage.getItem("token")

                const response = await fetch(
                    `${API_URL}/freelancers/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(
                        data.message || "Profile not found"
                    )
                }

                setFreelancer(data.freelancer)

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
            <div className="my-profile-message">
                Loading your profile...
            </div>
        )

    }


    return (

        <div className="my-freelancer-page">

            <div className="my-profile-header">

                <div>

                    <p>
                        FREELANCER PROFILE
                    </p>

                    <h1>
                        My Freelancer Profile
                    </h1>

                    <span>
                        Manage your professional information
                    </span>

                </div>


                <button
                    className="my-profile-back-btn"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>

            </div>


            {error ? (

                <div className="profile-not-created">

                    <div className="profile-empty-icon">
                        👨‍💻
                    </div>

                    <h2>
                        Freelancer Profile Not Found
                    </h2>

                    <p>
                        You haven't created your Freelancer
                        profile yet.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/freelancer/profile/edit")
                        }
                    >
                        Create Freelancer Profile
                    </button>

                </div>

            ) : (

                <div className="my-profile-card">

                    <div className="my-profile-summary">

                        <div className="my-profile-avatar">

                            {freelancer?.user?.name
                                ?.charAt(0)
                                ?.toUpperCase()
                                || "F"
                            }

                        </div>


                        <div>

                            <h2>
                                {freelancer?.user?.name}
                            </h2>

                            <p>
                                {freelancer?.user?.email}
                            </p>

                            <span>
                                {freelancer?.availability}
                            </span>

                        </div>


                        <button
                            className="edit-freelancer-btn"
                            onClick={() =>
                                navigate(
                                    "/freelancer/profile/edit"
                                )
                            }
                        >
                            Edit Profile
                        </button>

                    </div>


                    <div className="my-profile-grid">

                        <div className="my-info-box">

                            <span>
                                Skills
                            </span>

                            <div className="my-skills">

                                {freelancer?.skills?.length > 0
                                    ? freelancer.skills.map(
                                        (skill, index) => (
                                            <span
                                                key={index}
                                            >
                                                {skill}
                                            </span>
                                        )
                                    )
                                    : "No skills added"
                                }

                            </div>

                        </div>


                        <div className="my-info-box">

                            <span>
                                Experience
                            </span>

                            <strong>
                                {freelancer?.experience || "Not added"}
                            </strong>

                        </div>


                        <div className="my-info-box">

                            <span>
                                Hourly Rate
                            </span>

                            <strong>
                                ₹{freelancer?.hourlyRate || 0}/hr
                            </strong>

                        </div>


                        <div className="my-info-box">

                            <span>
                                Education
                            </span>

                            <strong>
                                {freelancer?.education || "Not added"}
                            </strong>

                        </div>


                        <div className="my-info-box full-width">

                            <span>
                                Bio
                            </span>

                            <p>
                                {freelancer?.bio ||
                                    "No bio added."
                                }
                            </p>

                        </div>


                        <div className="my-info-box full-width">

                            <span>
                                Portfolio
                            </span>

                            {freelancer?.portfolio ? (

                                <a
                                    href={freelancer.portfolio}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {freelancer.portfolio}
                                </a>

                            ) : (

                                <p>
                                    No portfolio added.
                                </p>

                            )}

                        </div>

                    </div>

                </div>

            )}

        </div>

    )

}

export default MyFreelancerProfile