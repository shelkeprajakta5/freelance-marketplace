import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from "../services/api"
import "../css/Profile.css"
import API_URL from "../config"

function Profile() {

    const {
        user,
        logout
    } = useAuth()

    const navigate = useNavigate()


    const [profile, setProfile] = useState(null)

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        bio: "",
        skills: "",
        hourlyRate: ""
    })


    const [profileImage, setProfileImage] = useState(null)

    const [preview, setPreview] = useState("")


    const [message, setMessage] = useState("")

    const [error, setError] = useState("")

    const [loading, setLoading] = useState(true)

    const [saving, setSaving] = useState(false)


    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: ""
    })


    const [passwordMessage, setPasswordMessage] = useState("")

    const [passwordError, setPasswordError] = useState("")

    // GET PROFILE

    const getProfile = async () => {

        try {

            const response = await api.get("/profile")

            const data = response.data.user

            setProfile(data)

            setFormData({

                name: data.name || "",

                phone: data.phone || "",

                bio: data.bio || "",

                skills: data.skills?.join(", ") || "",

                hourlyRate: data.hourlyRate ?? ""

            })


            if (data.profileImage) {

                setPreview(
                    `${API_URL.replace("/api", "")}${data.profileImage}`
                )

            }

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to load profile"
            )

        } finally {

            setLoading(false)

        }

    }


    useEffect(() => {

        getProfile()

    }, [])

    // HANDLE INPUT

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        })

    }


    // HANDLE PROFILE IMAGE


    const handleImageChange = (e) => {

        const file = e.target.files[0]

        if (!file) {
            return
        }


        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ]


        if (!allowedTypes.includes(file.type)) {

            setError(
                "Only JPG, JPEG, PNG and WEBP images are allowed"
            )

            return

        }


        if (file.size > 5 * 1024 * 1024) {

            setError(
                "Profile image must be less than 5MB"
            )

            return

        }


        setError("")

        setMessage("")

        setProfileImage(file)


        const imageUrl = URL.createObjectURL(file)

        setPreview(imageUrl)

    }


  
    // UPDATE PROFILE

    const handleSubmit = async (e) => {

        e.preventDefault()

        setMessage("")

        setError("")

        setSaving(true)


        try {

            const data = new FormData()


            data.append(
                "name",
                formData.name
            )


            data.append(
                "phone",
                formData.phone
            )


            data.append(
                "bio",
                formData.bio
            )


            data.append(
                "skills",
                formData.skills
            )


            data.append(
                "hourlyRate",
                formData.hourlyRate
            )


            if (profileImage) {

                data.append(
                    "profileImage",
                    profileImage
                )

            }


            const response = await api.put(
                "/profile/update",
                data
            )


            const updatedUser =
                response.data.user


            setProfile(updatedUser)


            setFormData({

                name: updatedUser.name || "",

                phone: updatedUser.phone || "",

                bio: updatedUser.bio || "",

                skills:
                    updatedUser.skills?.join(", ") || "",

                hourlyRate:
                    updatedUser.hourlyRate ?? ""

            })


            if (updatedUser.profileImage) {

                setPreview(
                    `${API_URL.replace("/api", "")}${updatedUser.profileImage}`
                )

            }


            localStorage.setItem(
                "user",
                JSON.stringify(updatedUser)
            )


            setProfileImage(null)


            setMessage(
                "Profile updated successfully"
            )

        } catch (error) {

            console.error(error)

            setError(
                error.response?.data?.message ||
                "Profile update failed"
            )

        } finally {

            setSaving(false)

        }

    }


    // PASSWORD INPUT

    const handlePasswordChange = (e) => {

        setPasswordData({

            ...passwordData,

            [e.target.name]:
                e.target.value

        })

    }


    // CHANGE PASSWORD

    const handlePasswordSubmit = async (e) => {

        e.preventDefault()

        setPasswordMessage("")

        setPasswordError("")


        try {

            const response =
                await api.put(
                    "/profile/change-password",
                    passwordData
                )


            setPasswordMessage(
                response.data.message
            )


            setPasswordData({

                currentPassword: "",
                newPassword: ""

            })

        } catch (error) {

            setPasswordError(
                error.response?.data?.message ||
                "Password change failed"
            )

        }

    }


    // LOGOUT

    const handleLogout = async () => {

        await logout()

        navigate("/login")

    }


 
    // LOADING

    if (loading) {

        return (

            <div className="profile-loading">

                Loading Profile...

            </div>

        )

    }


    // UI

    return (

        <div className="profile-page">


            {/* NAVBAR */}

            <nav className="profile-navbar">

                <div className="profile-brand">

                    <div className="profile-logo">
                        FM
                    </div>

                    <h2>
                        Freelance Marketplace
                    </h2>

                </div>


                <div className="profile-nav-right">

                    <button
                        onClick={() => navigate(-1)}
                        className="back-button"
                    >
                        Back
                    </button>


                    <span>
                        {user?.name}
                    </span>


                    <button
                        onClick={handleLogout}
                        className="profile-logout"
                    >
                        Logout
                    </button>

                </div>

            </nav>


            <main className="profile-container">


                {/* HEADING */}

                <div className="profile-heading">

                    <h1>
                        My Profile
                    </h1>

                    <p>
                        Manage your personal information
                    </p>

                </div>


                {/* SUCCESS */}

                {message && (

                    <div className="profile-success">

                        {message}

                    </div>

                )}


                {/* ERROR */}

                {error && (

                    <div className="profile-error">

                        {error}

                    </div>

                )}


                <div className="profile-grid">


                    {/* PROFILE INFORMATION */}

                    <div className="profile-card">

                        <h2>
                            Profile Information
                        </h2>


                        {/* PROFILE IMAGE */}

                        <div className="profile-image-section">

                            <div className="profile-image-wrapper">

                                {preview ? (

                                    <img
                                        src={preview}
                                        alt="Profile"
                                    />

                                ) : (

                                    <div className="profile-placeholder">

                                        {formData.name
                                            ?.charAt(0)
                                            ?.toUpperCase() || "U"
                                        }

                                    </div>

                                )}

                            </div>


                            <div>

                                <label className="image-upload-button">

                                    Change Photo

                                    <input
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={handleImageChange}
                                    />

                                </label>


                                <p className="image-help">

                                    JPG, PNG or WEBP
                                    <br />
                                    Maximum 5MB

                                </p>


                                {profileImage && (

                                    <p className="selected-image">

                                        Selected:
                                        {" "}

                                        <strong>
                                            {profileImage.name}
                                        </strong>

                                    </p>

                                )}

                            </div>

                        </div>


                        {/* PROFILE FORM */}

                        <form
                            onSubmit={handleSubmit}
                            className="profile-form"
                        >


                            <div className="profile-form-group">

                                <label>
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="profile-form-group">

                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={profile?.email || ""}
                                    disabled
                                />

                            </div>


                            <div className="profile-form-group">

                                <label>
                                    Role
                                </label>

                                <input
                                    type="text"
                                    value={profile?.role || ""}
                                    disabled
                                />

                            </div>


                            <div className="profile-form-group">

                                <label>
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Enter phone number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />

                            </div>


                            <div className="profile-form-group">

                                <label>
                                    Bio
                                </label>

                                <textarea
                                    name="bio"
                                    rows="4"
                                    placeholder="Tell us about yourself"
                                    value={formData.bio}
                                    onChange={handleChange}
                                />

                            </div>


                            <div className="profile-form-group">

                                <label>
                                    Skills
                                </label>

                                <input
                                    type="text"
                                    name="skills"
                                    placeholder="React, Node.js, MongoDB"
                                    value={formData.skills}
                                    onChange={handleChange}
                                />

                                <small>
                                    Separate skills with commas
                                </small>

                            </div>


                            {profile?.role === "Freelancer" && (

                                <div className="profile-form-group">

                                    <label>
                                        Hourly Rate
                                    </label>

                                    <input
                                        type="number"
                                        name="hourlyRate"
                                        min="0"
                                        placeholder="Enter hourly rate"
                                        value={formData.hourlyRate}
                                        onChange={handleChange}
                                    />

                                </div>

                            )}


                            <button
                                type="submit"
                                className="save-profile-button"
                                disabled={saving}
                            >

                                {saving
                                    ? "Saving..."
                                    : "Save Changes"
                                }

                            </button>

                        </form>

                    </div>


                    {/* CHANGE PASSWORD */}

                    <div className="password-card">

                        <h2>
                            Change Password
                        </h2>

                        <p>
                            Keep your account secure
                            by using a strong password.
                        </p>


                        {passwordMessage && (

                            <div className="profile-success">

                                {passwordMessage}

                            </div>

                        )}


                        {passwordError && (

                            <div className="profile-error">

                                {passwordError}

                            </div>

                        )}


                        <form
                            onSubmit={handlePasswordSubmit}
                            className="profile-form"
                        >

                            <div className="profile-form-group">

                                <label>
                                    Current Password
                                </label>

                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={
                                        passwordData.currentPassword
                                    }
                                    onChange={
                                        handlePasswordChange
                                    }
                                    required
                                />

                            </div>


                            <div className="profile-form-group">

                                <label>
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    name="newPassword"
                                    minLength="6"
                                    value={
                                        passwordData.newPassword
                                    }
                                    onChange={
                                        handlePasswordChange
                                    }
                                    required
                                />

                                <small>
                                    Minimum 6 characters
                                </small>

                            </div>


                            <button
                                type="submit"
                                className="password-button"
                            >
                                Change Password
                            </button>

                        </form>

                    </div>

                </div>

            </main>

        </div>

    )

}


export default Profile