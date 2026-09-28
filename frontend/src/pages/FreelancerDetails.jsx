import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "../css/FreelancerDetails.css"
import API_URL from "../config"

function FreelancerDetails() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [freelancer, setFreelancer] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")


    useEffect(() => {

        const fetchFreelancer = async () => {

            try {

                const token = localStorage.getItem("token")

                const response = await fetch(
                    `${API_URL}/freelancers/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(
                        data.message || "Freelancer not found"
                    )
                }

                setFreelancer(data.freelancer)

            } catch (error) {

                setError(error.message)

            } finally {

                setLoading(false)

            }

        }

        fetchFreelancer()

    }, [id])


    if (loading) {

        return (
            <div className="freelancer-details-message">
                Loading profile...
            </div>
        )

    }


    if (error) {

        return (
            <div className="freelancer-details-message">

                <h2>
                    {error}
                </h2>

                <button
                    onClick={() => navigate("/freelancers")}
                >
                    Back to Freelancers
                </button>

            </div>
        )

    }


    return (

        <div className="freelancer-details-page">

            <button
                className="details-back-btn"
                onClick={() => navigate("/freelancers")}
            >
                ← Back to Freelancers
            </button>


            <div className="freelancer-profile-card">

                <div className="profile-top-section">

                    <div className="large-freelancer-avatar">

                        {freelancer?.user?.name
                            ?.charAt(0)
                            ?.toUpperCase()
                            || "F"
                        }

                    </div>


                    <div className="profile-main-info">

                        <h1>
                            {freelancer?.user?.name}
                        </h1>

                        <p>
                            {freelancer?.user?.email}
                        </p>

                        <span className="profile-availability">
                            {freelancer?.availability || "Available"}
                        </span>

                    </div>


                    <div className="profile-rate">

                        <span>
                            Hourly Rate
                        </span>

                        <strong>
                            ₹{freelancer?.hourlyRate || 0}
                        </strong>

                        <small>
                            per hour
                        </small>

                    </div>

                </div>


                <div className="profile-content-grid">

                    <section className="profile-section">

                        <h2>
                            About
                        </h2>

                        <p>
                            {freelancer?.bio ||
                                "No biography provided."
                            }
                        </p>

                    </section>


                    <section className="profile-section">

                        <h2>
                            Experience
                        </h2>

                        <p>
                            {freelancer?.experience ||
                                "No experience information provided."
                            }
                        </p>

                    </section>


                    <section className="profile-section">

                        <h2>
                            Skills
                        </h2>

                        <div className="detail-skills">

                            {freelancer?.skills?.length > 0
                                ? freelancer.skills.map(
                                    (skill, index) => (
                                        <span
                                            key={index}
                                            className="detail-skill"
                                        >
                                            {skill}
                                        </span>
                                    )
                                )
                                : (
                                    <p>
                                        No skills added.
                                    </p>
                                )
                            }

                        </div>

                    </section>


                    <section className="profile-section">

                        <h2>
                            Education
                        </h2>

                        <p>
                            {freelancer?.education ||
                                "No education information provided."
                            }
                        </p>

                    </section>

                </div>


                <div className="portfolio-section">

                    <h2>
                        Portfolio
                    </h2>

                    {freelancer?.portfolio ? (

                        <a
                            href={freelancer.portfolio}
                            target="_blank"
                            rel="noreferrer"
                            className="portfolio-link"
                        >
                            View Portfolio →
                        </a>

                    ) : (

                        <p>
                            No portfolio link provided.
                        </p>

                    )}

                </div>

            </div>

        </div>

    )

}

export default FreelancerDetails