import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../css/FreelancerList.css"
import API_URL from "../config"

function FreelancerList() {

    const navigate = useNavigate()

    const [freelancers, setFreelancers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {

        const fetchFreelancers = async () => {

            try {

                const token = localStorage.getItem("token")

                const response = await fetch(
                    `${API_URL}/freelancers`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch freelancers"
                    )
                }

                setFreelancers(data.freelancers || [])

            } catch (error) {

                setError(error.message)

            } finally {

                setLoading(false)

            }

        }

        fetchFreelancers()

    }, [])


    if (loading) {

        return (
            <div className="freelancer-page-message">
                Loading freelancers...
            </div>
        )

    }


    return (

        <div className="freelancer-list-page">

            <div className="freelancer-list-header">

                <div>
                    <p className="page-label">
                        FREELANCE MARKETPLACE
                    </p>

                    <h1>
                        Find Freelancers
                    </h1>

                    <p>
                        Browse skilled professionals and
                        find the right person for your project.
                    </p>
                </div>

                <button
                    className="back-dashboard-btn"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>

            </div>


            {error && (
                <div className="freelancer-error">
                    {error}
                </div>
            )}


            {!error && freelancers.length === 0 && (

                <div className="no-freelancers">
                    <div className="no-freelancer-icon">
                        👨‍💻
                    </div>

                    <h2>
                        No freelancers found
                    </h2>

                    <p>
                        Freelancer profiles will appear here
                        once they are created.
                    </p>
                </div>

            )}


            <div className="freelancer-grid">

                {freelancers.map((freelancer) => (

                    <div
                        className="freelancer-card"
                        key={freelancer._id}
                    >

                        <div className="freelancer-card-top">

                            <div className="freelancer-avatar">

                                {freelancer.user?.name
                                    ?.charAt(0)
                                    ?.toUpperCase()
                                    || "F"
                                }

                            </div>

                            <div>

                                <h2>
                                    {freelancer.user?.name || "Freelancer"}
                                </h2>

                                <span className="availability">
                                    {freelancer.availability || "Available"}
                                </span>

                            </div>

                        </div>


                        <p className="freelancer-bio">

                            {freelancer.bio
                                ? freelancer.bio.length > 110
                                    ? freelancer.bio.substring(0, 110) + "..."
                                    : freelancer.bio
                                : "No bio available."
                            }

                        </p>


                        <div className="skills-container">

                            {freelancer.skills?.slice(0, 4).map(
                                (skill, index) => (

                                    <span
                                        className="skill-tag"
                                        key={index}
                                    >
                                        {skill}
                                    </span>

                                )
                            )}

                        </div>


                        <div className="freelancer-card-bottom">

                            <div>

                                <span>
                                    Hourly Rate
                                </span>

                                <strong>
                                    ₹{freelancer.hourlyRate || 0}/hr
                                </strong>

                            </div>


                            <button
                                className="view-freelancer-btn"
                                onClick={() =>
                                    navigate(
                                        `/freelancers/${freelancer._id}`
                                    )
                                }
                            >
                                View Profile
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    )

}

export default FreelancerList