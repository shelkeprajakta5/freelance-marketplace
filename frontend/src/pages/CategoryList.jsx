import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../css/CategoryList.css"
import API_URL from "../config"

function CategoryList() {

    const navigate = useNavigate()
    const { user } = useAuth()

    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")


    const fetchCategories = async () => {

        try {

            const token =
                localStorage.getItem("token")


            const response = await fetch(
                `${API_URL}/categories`,
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
                    "Failed to load categories"
                )

            }


            setCategories(
                data.categories || []
            )


        } catch (error) {

            setError(error.message)

        } finally {

            setLoading(false)

        }

    }


    useEffect(() => {

        fetchCategories()

    }, [])


    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this category?"
            )


        if (!confirmDelete) {
            return
        }


        try {

            const token =
                localStorage.getItem("token")


            const response = await fetch(
                `${API_URL}/categories/${id}`,
                {
                    method: "DELETE",

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
                    "Failed to delete category"
                )

            }


            alert(
                "Category deleted successfully"
            )


            fetchCategories()


        } catch (error) {

            alert(error.message)

        }

    }


    if (loading) {

        return (

            <div className="category-page">

                <div className="category-loading">

                    Loading categories...

                </div>

            </div>

        )

    }


    return (

        <div className="category-page">

            {/* HEADER */}

            <div className="category-header">

                <div>

                    <p className="category-label">
                        CATEGORY MANAGEMENT
                    </p>

                    <h1>
                        Categories
                    </h1>

                    <p>
                        Manage freelance marketplace
                        categories
                    </p>

                </div>


                {user?.role === "Admin" && (

                    <button
                        className="add-category-btn"
                        onClick={() =>
                            navigate(
                                "/categories/add"
                            )
                        }
                    >
                        + Add Category
                    </button>

                )}

            </div>


            {/* ERROR */}

            {error && (

                <div className="category-error">
                    {error}
                </div>

            )}


            {/* EMPTY */}

            {!error &&
                categories.length === 0 && (

                    <div className="category-empty">

                        <div className="category-empty-icon">
                            📂
                        </div>

                        <h2>
                            No Categories Found
                        </h2>

                        <p>
                            There are no categories
                            available yet.
                        </p>


                        {user?.role === "Admin" && (

                            <button
                                onClick={() =>
                                    navigate(
                                        "/categories/add"
                                    )
                                }
                            >
                                Add First Category
                            </button>

                        )}

                    </div>

                )}


            {/* CATEGORY GRID */}

            {categories.length > 0 && (

                <div className="category-grid">

                    {categories.map(
                        (category) => (

                            <div
                                className="category-card"
                                key={category._id}
                            >

                                <div className="category-card-top">

                                    <div className="category-icon">
                                        {category.name
                                            ?.charAt(0)
                                            ?.toUpperCase()
                                        }
                                    </div>


                                    <span
                                        className={
                                            category.status ===
                                            "Active"
                                                ? "category-status active"
                                                : "category-status inactive"
                                        }
                                    >
                                        {category.status}
                                    </span>

                                </div>


                                <h2>
                                    {category.name}
                                </h2>


                                <p>

                                    {category.description ||
                                        "No description available"}

                                </p>


                                <div className="category-card-footer">

                                    <small>

                                        Created:

                                        {" "}

                                        {category.createdAt
                                            ? new Date(
                                                category.createdAt
                                            ).toLocaleDateString()
                                            : "N/A"
                                        }

                                    </small>


                                    {user?.role ===
                                        "Admin" && (

                                        <div className="category-actions">

                                            <button
                                                className="edit-category-btn"
                                                onClick={() =>
                                                    navigate(
                                                        `/categories/edit/${category._id}`
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>


                                            <button
                                                className="delete-category-btn"
                                                onClick={() =>
                                                    handleDelete(
                                                        category._id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    )}

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

        </div>

    )

}


export default CategoryList