import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../css/EditFreelancerProfile.css"
import API_URL from "../config"


function EditFreelancerProfile() {

    const navigate = useNavigate()

    const [existingProfile, setExistingProfile] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    const [formData, setFormData] = useState({

        skills: "",
        experience: "",
        bio: "",
        hourlyRate: "",
        portfolio: "",
        education: "",
        availability: "Available"

    })


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

                if (response.ok) {

                    const profile = data.freelancer

                    setExistingProfile(true)

                    setFormData({

                        skills: profile.skills?.join(", ") || "",

                        experience:
                            profile.experience || "",

                        bio:
                            profile.bio || "",

                        hourlyRate:
                            profile.hourlyRate || "",

                        portfolio:
                            profile.portfolio || "",

                        education:
                            profile.education || "",

                        availability:
                            profile.availability || "Available"

                    })

                }

            } catch (error) {

                console.log(error)

            } finally {

                setLoading(false)

            }

        }

        fetchProfile()

    }, [])


    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        })

    }


    const handleSubmit = async (e) => {

        e.preventDefault()

        setSaving(true)
        setMessage("")
        setError("")

        try {

            const token = localStorage.getItem("token")

            const url =
                `${API_URL}/freelancers/profile`

            const method =
                existingProfile ? "PUT" : "POST"


            const response = await fetch(
                url,
                {
                    method,

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({

                        skills: formData.skills
                            .split(",")
                            .map(skill => skill.trim())
                            .filter(skill => skill !== ""),

                        experience: formData.experience,

                        bio: formData.bio,

                        hourlyRate:
                            Number(formData.hourlyRate) || 0,

                        portfolio: formData.portfolio,

                        education: formData.education,

                        availability: formData.availability

                    })
                }
            )


            const data = await response.json()


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to save freelancer profile"
                )

            }


            setMessage(data.message)

            setExistingProfile(true)

            setTimeout(() => {

                navigate("/freelancer/profile")

            }, 1000)


        } catch (error) {

            setError(error.message)

        } finally {

            setSaving(false)

        }

    }


    if (loading) {

        return (
            <div className="edit-profile-message">
                Loading...
            </div>
        )

    }


    return (

        <div className="edit-freelancer-page">

            <div className="edit-profile-header">

                <div>

                    <p>
                        FREELANCER PROFILE
                    </p>

                    <h1>
                        {existingProfile
                            ? "Edit Freelancer Profile"
                            : "Create Freelancer Profile"
                        }
                    </h1>

                    <span>
                        Add your professional information
                    </span>

                </div>


                <button
                    className="edit-back-btn"
                    onClick={() =>
                        navigate("/freelancer/profile")
                    }
                >
                    ← Back
                </button>

            </div>


            <form
                className="freelancer-form"
                onSubmit={handleSubmit}
            >

                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}


                <div className="form-section">

                    <h2>
                        Professional Information
                    </h2>

                    <p>
                        Tell clients about your skills and experience.
                    </p>


                    <div className="form-group">

                        <label>
                            Skills
                        </label>

                        <input
                            type="text"
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            placeholder="React, Node.js, MongoDB, Express"
                        />

                        <small>
                            Separate skills with commas.
                        </small>

                    </div>


                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Experience
                            </label>

                            <input
                                type="text"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                placeholder="e.g. 2 years"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Hourly Rate (₹)
                            </label>

                            <input
                                type="number"
                                name="hourlyRate"
                                value={formData.hourlyRate}
                                onChange={handleChange}
                                min="0"
                                placeholder="500"
                            />

                        </div>

                    </div>


                    <div className="form-group">

                        <label>
                            Bio
                        </label>

                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows="5"
                            placeholder="Write a short description about yourself..."
                        />

                    </div>

                </div>


                <div className="form-section">

                    <h2>
                        Additional Information
                    </h2>

                    <p>
                        Add your education, portfolio and availability.
                    </p>


                    <div className="form-group">

                        <label>
                            Education
                        </label>

                        <input
                            type="text"
                            name="education"
                            value={formData.education}
                            onChange={handleChange}
                            placeholder="Bachelor of Engineering"
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Portfolio URL
                        </label>

                        <input
                            type="url"
                            name="portfolio"
                            value={formData.portfolio}
                            onChange={handleChange}
                            placeholder="https://myportfolio.com"
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Availability
                        </label>

                        <select
                            name="availability"
                            value={formData.availability}
                            onChange={handleChange}
                        >

                            <option value="Available">
                                Available
                            </option>

                            <option value="Part Time">
                                Part Time
                            </option>

                            <option value="Busy">
                                Busy
                            </option>

                            <option value="Not Available">
                                Not Available
                            </option>

                        </select>

                    </div>

                </div>


                <div className="form-actions">

                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() =>
                            navigate("/freelancer/profile")
                        }
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        className="save-profile-btn"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : existingProfile
                                ? "Update Profile"
                                : "Create Profile"
                        }
                    </button>

                </div>

            </form>

        </div>

    )

}

export default EditFreelancerProfile