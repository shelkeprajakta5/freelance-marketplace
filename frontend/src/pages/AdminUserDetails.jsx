import { useEffect, useState } from "react"
import { useNavigate, useParams} from "react-router-dom"

import "../css/AdminUserDetails.css"
import API_URL from "../config"

function AdminUserDetails() {

    const {
        id
    } = useParams()


    const navigate =
        useNavigate()


    const [user, setUser] =
        useState(null)

    const [formData, setFormData] =
        useState({

            name: "",

            email: "",

            role: "",

            phone: "",

            bio: "",

            skills: "",

            hourlyRate: ""

        })


    const [loading, setLoading] =
        useState(true)

    const [saving, setSaving] =
        useState(false)

    const [error, setError] =
        useState("")


    const fetchUser = async () => {

        try {

            const token =
                localStorage.getItem("token")


            const response =
                await fetch(

                    `${API_URL}/admin/users/${id}`,

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
                    "Failed to load user"
                )

            }


            const selectedUser =
                data.user


            setUser(
                selectedUser
            )


            setFormData({

                name:
                    selectedUser.name || "",

                email:
                    selectedUser.email || "",

                role:
                    selectedUser.role || "",

                phone:
                    selectedUser.phone || "",

                bio:
                    selectedUser.bio || "",

                skills:
                    Array.isArray(
                        selectedUser.skills
                    )
                        ? selectedUser.skills.join(", ")
                        : "",

                hourlyRate:
                    selectedUser.hourlyRate || ""

            })


        } catch (error) {

            setError(
                error.message
            )

        } finally {

            setLoading(false)

        }

    }


    useEffect(() => {

        fetchUser()

    }, [id])


    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]:
                e.target.value

        })

    }


    const handleSubmit = async (e) => {

        e.preventDefault()


        try {

            setSaving(true)

            setError("")


            const token =
                localStorage.getItem("token")


            const response =
                await fetch(

                    `${API_URL}/admin/users/${id}`,

                    {

                        method: "PUT",

                        headers: {

                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`

                        },

                        body:
                            JSON.stringify(
                                formData
                            )

                    }

                )


            const data =
                await response.json()


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to update user"
                )

            }


            alert(
                "User updated successfully"
            )


            setUser(
                data.user
            )


        } catch (error) {

            setError(
                error.message
            )

        } finally {

            setSaving(false)

        }

    }


    if (loading) {

        return (

            <div className="admin-user-details-page">

                <div className="admin-user-details-loading">

                    Loading user...

                </div>

            </div>

        )

    }


    if (error && !user) {

        return (

            <div className="admin-user-details-page">

                <div className="admin-user-details-error">

                    {error}

                </div>


                <button
                    onClick={() =>
                        navigate(
                            "/admin/users"
                        )
                    }
                >

                    Back to Users

                </button>

            </div>

        )

    }


    return (

        <div className="admin-user-details-page">

            {/*  HEADER */}

            <div className="admin-user-details-header">

                <div>

                    <p className="admin-user-details-label">

                        USER MANAGEMENT

                    </p>


                    <h1>

                        User Details

                    </h1>


                    <p>

                        View and update user information.

                    </p>

                </div>


                <button
                    className="back-users-btn"
                    onClick={() =>
                        navigate(
                            "/admin/users"
                        )
                    }
                >

                    ← Back to Users

                </button>

            </div>


            {/*  USER SUMMARY*/}

            <div className="admin-user-summary">

                <div className="admin-user-large-avatar">

                    {user?.name
                        ?.charAt(0)
                        ?.toUpperCase()
                    }

                </div>


                <div>

                    <h2>

                        {user?.name}

                    </h2>


                    <p>

                        {user?.email}

                    </p>


                    <span
                        className={`admin-role ${user?.role?.toLowerCase()}`}
                    >

                        {user?.role}

                    </span>

                </div>

            </div>


            {/*ERROr */}

            {error && (

                <div className="admin-user-details-error">

                    {error}

                </div>

            )}


            {/* UPDATE FORM*/}

            <form
                className="admin-user-form"
                onSubmit={
                    handleSubmit
                }
            >

                <div className="admin-form-grid">

                    <div className="admin-form-group">

                        <label>
                            Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={
                                formData.name
                            }
                            onChange={
                                handleChange
                            }
                            required
                        />

                    </div>


                    <div className="admin-form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={
                                formData.email
                            }
                            onChange={
                                handleChange
                            }
                            required
                        />

                    </div>


                    <div className="admin-form-group">

                        <label>
                            Role
                        </label>

                        <select
                            name="role"
                            value={
                                formData.role
                            }
                            onChange={
                                handleChange
                            }
                        >

                            <option value="Admin">
                                Admin
                            </option>

                            <option value="Client">
                                Client
                            </option>

                            <option value="Freelancer">
                                Freelancer
                            </option>

                        </select>

                    </div>


                    <div className="admin-form-group">

                        <label>
                            Phone
                        </label>

                        <input
                            type="text"
                            name="phone"
                            value={
                                formData.phone
                            }
                            onChange={
                                handleChange
                            }
                        />

                    </div>


                    <div className="admin-form-group">

                        <label>
                            Hourly Rate
                        </label>

                        <input
                            type="number"
                            name="hourlyRate"
                            value={
                                formData.hourlyRate
                            }
                            onChange={
                                handleChange
                            }
                            min="0"
                        />

                    </div>


                    <div className="admin-form-group admin-full-width">

                        <label>
                            Skills
                        </label>

                        <input
                            type="text"
                            name="skills"
                            value={
                                formData.skills
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="React, Node.js, MongoDB"
                        />

                    </div>


                    <div className="admin-form-group admin-full-width">

                        <label>
                            Bio
                        </label>

                        <textarea
                            name="bio"
                            value={
                                formData.bio
                            }
                            onChange={
                                handleChange
                            }
                            rows="5"
                        />

                    </div>

                </div>


                <div className="admin-form-actions">

                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() =>
                            navigate(
                                "/admin/users"
                            )
                        }
                    >

                        Cancel

                    </button>


                    <button
                        type="submit"
                        className="save-user-btn"
                        disabled={saving}
                    >

                        {saving
                            ? "Saving..."
                            : "Save Changes"
                        }

                    </button>

                </div>

            </form>

        </div>

    )

}


export default AdminUserDetails