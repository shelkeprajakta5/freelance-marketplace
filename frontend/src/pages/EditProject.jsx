import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "../css/Project.css"
import API_URL from "../config"


function EditProject() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [categories, setCategories] = useState([])

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        requiredSkills: "",
        budget: "",
        deadline: "",
        status: ""
    })

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")


    useEffect(() => {

        const loadData = async () => {

            try {

                const token =
                    localStorage.getItem("token")


                const projectResponse =
                    await fetch(
                        `${API_URL}/projects/${id}`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    )


                const projectData =
                    await projectResponse.json()


                if (!projectResponse.ok) {

                    throw new Error(
                        projectData.message ||
                        "Failed to load project"
                    )

                }


                const project =
                    projectData.project


                const categoryResponse =
                    await fetch(
                        `${API_URL}/categories`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    )


                const categoryData =
                    await categoryResponse.json()


                setCategories(
                    categoryData.categories || []
                )


                setFormData({

                    title:
                        project.title || "",

                    description:
                        project.description || "",

                    category:
                        project.category?._id ||
                        project.category ||
                        "",

                    requiredSkills:
                        Array.isArray(
                            project.requiredSkills
                        )
                            ? project.requiredSkills.join(", ")
                            : "",

                    budget:
                        project.budget || "",

                    deadline:
                        project.deadline
                            ? project.deadline.substring(0, 10)
                            : "",

                    status:
                        project.status || ""

                })


            } catch (error) {

                setError(
                    error.message
                )

            } finally {

                setLoading(false)

            }

        }

        loadData()

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

        setSaving(true)
        setError("")

        try {

            const token =
                localStorage.getItem("token")


            const skills =
                formData.requiredSkills
                    .split(",")
                    .map(skill => skill.trim())
                    .filter(skill => skill !== "")


            const response =
                await fetch(
                    `${API_URL}/projects/${id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({

                            title:
                                formData.title,

                            description:
                                formData.description,

                            category:
                                formData.category,

                            requiredSkills:
                                skills,

                            budget:
                                Number(formData.budget),

                            deadline:
                                formData.deadline,

                            status:
                                formData.status

                        })
                    }
                )


            const data =
                await response.json()


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to update project"
                )

            }


            alert(
                "Project updated successfully."
            )

            navigate(
                `/projects/${id}`
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
            <div className="project-page">

                <div className="project-loading">
                    Loading project...
                </div>

            </div>
        )

    }


    return (

        <div className="project-page">

            <div className="project-form-container">

                <div className="project-form-header">

                    <p className="project-label">
                        PROJECT MANAGEMENT
                    </p>

                    <h1>
                        Edit Project
                    </h1>

                    <p>
                        Update your project information.
                    </p>

                </div>


                {error && (

                    <div className="project-error">
                        {error}
                    </div>

                )}


                <form
                    className="project-form"
                    onSubmit={handleSubmit}
                >

                    <div className="project-form-group">

                        <label>
                            Project Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div className="project-form-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="6"
                            required
                        />

                    </div>


                    <div className="project-form-row">

                        <div className="project-form-group">

                            <label>
                                Category
                            </label>

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select Category
                                </option>

                                {categories.map(
                                    category => (

                                        <option
                                            key={category._id}
                                            value={category._id}
                                        >
                                            {category.name}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        <div className="project-form-group">

                            <label>
                                Budget
                            </label>

                            <input
                                type="number"
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                                min="0"
                                required
                            />

                        </div>

                    </div>


                    <div className="project-form-group">

                        <label>
                            Required Skills
                        </label>

                        <input
                            type="text"
                            name="requiredSkills"
                            value={formData.requiredSkills}
                            onChange={handleChange}
                        />

                    </div>


                    <div className="project-form-row">

                        <div className="project-form-group">

                            <label>
                                Deadline
                            </label>

                            <input
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="project-form-group">

                            <label>
                                Status
                            </label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >

                                <option value="Open">
                                    Open
                                </option>

                                <option value="Closed">
                                    Closed
                                </option>

                            </select>

                        </div>

                    </div>


                    <div className="project-form-actions">

                        <button
                            type="button"
                            className="project-secondary-btn"
                            onClick={() =>
                                navigate(
                                    `/projects/${id}`
                                )
                            }
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="project-primary-btn"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "Update Project"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>

    )

}

export default EditProject