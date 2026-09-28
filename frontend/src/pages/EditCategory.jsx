import { useEffect, useState} from "react"

import { useNavigate, useParams} from "react-router-dom"

import "../css/EditCategory.css"
import API_URL from "../config"

function EditCategory() {

    const navigate = useNavigate()
    const { id } = useParams()


    const [formData, setFormData] =
        useState({

            name: "",
            description: "",
            status: "Active"

        })


    const [loading, setLoading] =
        useState(true)


    const [saving, setSaving] =
        useState(false)


    const [error, setError] =
        useState("")


    useEffect(() => {

        const fetchCategory = async () => {

            try {

                const token =
                    localStorage.getItem("token")


                const response =
                    await fetch(
                        `${API_URL}/categories/${id}`,
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
                        "Failed to load category"
                    )

                }


                setFormData({

                    name:
                        data.category?.name || "",

                    description:
                        data.category?.description || "",

                    status:
                        data.category?.status ||
                        "Active"

                })


            } catch (error) {

                setError(error.message)

            } finally {

                setLoading(false)

            }

        }


        fetchCategory()

    }, [id])


    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target


        setFormData({
            ...formData,
            [name]: value
        })

    }


    const handleSubmit = async (e) => {

        e.preventDefault()

        setError("")


        if (!formData.name.trim()) {

            setError(
                "Category name is required"
            )

            return

        }


        try {

            setSaving(true)


            const token =
                localStorage.getItem("token")


            const response =
                await fetch(
                    `${API_URL}/categories/${id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify(
                            formData
                        )
                    }
                )


            const data =
                await response.json()


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to update category"
                )

            }


            alert(
                "Category updated successfully"
            )


            navigate("/categories")


        } catch (error) {

            setError(error.message)

        } finally {

            setSaving(false)

        }

    }


    if (loading) {

        return (

            <div className="edit-category-page">

                <div className="edit-category-loading">
                    Loading category...
                </div>

            </div>

        )

    }


    return (

        <div className="edit-category-page">

            <div className="edit-category-container">

                {/* HEADER */}

                <div className="edit-category-header">

                    <button
                        className="back-edit-category-btn"
                        onClick={() =>
                            navigate(
                                "/categories"
                            )
                        }
                    >
                        ← Back
                    </button>


                    <div>

                        <p>
                            CATEGORY MANAGEMENT
                        </p>

                        <h1>
                            Edit Category
                        </h1>

                        <span>
                            Update category information
                        </span>

                    </div>

                </div>


                {/* FORM */}

                <div className="edit-category-card">

                    {error && (

                        <div className="edit-category-error">
                            {error}
                        </div>

                    )}


                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >

                        <div className="edit-form-group">

                            <label>
                                Category Name
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
                                placeholder="Enter category name"
                            />

                        </div>


                        <div className="edit-form-group">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter category description"
                                rows="5"
                            />

                        </div>


                        <div className="edit-form-group">

                            <label>
                                Status
                            </label>

                            <select
                                name="status"
                                value={
                                    formData.status
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <option value="Active">
                                    Active
                                </option>

                                <option value="Inactive">
                                    Inactive
                                </option>

                            </select>

                        </div>


                        <div className="edit-category-actions">

                            <button
                                type="button"
                                className="cancel-edit-category-btn"
                                onClick={() =>
                                    navigate(
                                        "/categories"
                                    )
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="update-category-btn"
                                disabled={saving}
                            >

                                {saving
                                    ? "Updating..."
                                    : "Update Category"
                                }

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    )

}


export default EditCategory