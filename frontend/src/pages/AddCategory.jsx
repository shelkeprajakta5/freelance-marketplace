import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../css/AddCategory.css"
import API_URL from "../config"

function AddCategory() {

    const navigate = useNavigate()


    const [formData, setFormData] = useState({

        name: "",
        description: "",
        status: "Active"

    })


    const [loading, setLoading] =
        useState(false)


    const [error, setError] =
        useState("")


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

            setLoading(true)


            const token =
                localStorage.getItem("token")


            const response = await fetch(
                `${API_URL}/categories`,
                {
                    method: "POST",

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
                    "Failed to add category"
                )

            }


            alert(
                "Category added successfully"
            )


            navigate("/categories")


        } catch (error) {

            setError(error.message)

        } finally {

            setLoading(false)

        }

    }


    return (

        <div className="add-category-page">

            <div className="add-category-container">

                {/* HEADER */}

                <div className="add-category-header">

                    <button
                        className="back-category-btn"
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
                            Add Category
                        </h1>

                        <span>
                            Create a new marketplace
                            category
                        </span>

                    </div>

                </div>


                {/* FORM */}

                <div className="add-category-card">

                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >

                        <div className="form-group">

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


                        <div className="form-group">

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


                        <div className="form-group">

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


                        {error && (

                            <div className="add-category-error">
                                {error}
                            </div>

                        )}


                        <div className="add-category-actions">

                            <button
                                type="button"
                                className="cancel-category-btn"
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
                                className="save-category-btn"
                                disabled={loading}
                            >

                                {loading
                                    ? "Adding..."
                                    : "Add Category"
                                }

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    )

}


export default AddCategory