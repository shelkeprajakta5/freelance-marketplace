import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../css/AddProject.css"
import API_URL from "../config"

function AddProject() {

    const navigate = useNavigate()

    const [categories, setCategories] = useState([])

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        requiredSkills: "",
        budget: "",
        deadline: ""
    })

    const [attachment, setAttachment] = useState(null)

    const [loading, setLoading] = useState(false)

    const [error, setError] = useState("")

    const [success, setSuccess] = useState("")


    // FETCH CATEGORIES


    useEffect(() => {

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

                if (response.ok) {

                    setCategories(
                        data.categories || []
                    )

                }

            } catch (error) {

                console.log(
                    error.message
                )

            }

        }

        fetchCategories()

    }, [])


    // HANDLE INPUT
  

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })

    }


    // HANDLE FILE
    

    const handleFileChange = (e) => {

        const file = e.target.files[0]

        if (!file) {
            setAttachment(null)
            return
        }

        setAttachment(file)

    }

    // SUBMIT PROJECT
  

    const handleSubmit = async (e) => {

        e.preventDefault()

        setError("")
        setSuccess("")
        setLoading(true)


        try {

            const token =
                localStorage.getItem("token")


            // CONVERT SKILLS
    

            const skills =
                formData.requiredSkills
                    .split(",")
                    .map(skill => skill.trim())
                    .filter(skill => skill !== "")


            // CREATE FORMDATA

            const data = new FormData()


            data.append(
                "title",
                formData.title
            )

            data.append(
                "description",
                formData.description
            )

            data.append(
                "category",
                formData.category
            )

            data.append(
                "requiredSkills",
                JSON.stringify(skills)
            )

            data.append(
                "budget",
                formData.budget
            )

            data.append(
                "deadline",
                formData.deadline
            )

            // ADD ATTACHMENT
        

            if (attachment) {

                data.append(
                    "attachments",
                    attachment
                )

            }


            // CREATE PROJECT

            const response = await fetch(
                `${API_URL}/projects/add`,
                {
                    method: "POST",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    },

                    body: data
                }
            )


            const responseData =
                await response.json()


            // ERROR


            if (!response.ok) {

                throw new Error(
                    responseData.message ||
                    "Failed to create project"
                )

            }

            // SUCCESS
    

            setSuccess(
                "Project created successfully."
            )


            setTimeout(() => {

                navigate("/projects")

            }, 1000)


        } catch (error) {

            console.error(error)

            setError(
                error.message
            )

        } finally {

            setLoading(false)

        }

    }


    return (

        <div className="project-page">

            <div className="project-form-container">


                {/*HEADER */}

                <div className="project-form-header">

                    <p className="project-label">
                        PROJECT MANAGEMENT
                    </p>

                    <h1>
                        Create New Project
                    </h1>

                    <p>
                        Post your project and find the right freelancer.
                    </p>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="project-error">
                        {error}
                    </div>

                )}


                {/*  SUCCESS*/}

                {success && (

                    <div className="project-success">
                        {success}
                    </div>

                )}


                {/* FORM */}

                <form
                    className="project-form"
                    onSubmit={handleSubmit}
                >


                    {/*  TITL */}

                    <div className="project-form-group">

                        <label>
                            Project Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter project title"
                            required
                        />

                    </div>


                    {/*  DESCRIPTION */}

                    <div className="project-form-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe your project"
                            rows="6"
                            required
                        />

                    </div>


                    {/*  CATEGORY + BUDGET*/}

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

                                {categories.map(category => (

                                    <option
                                        key={category._id}
                                        value={category._id}
                                    >
                                        {category.name}
                                    </option>

                                ))}

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
                                placeholder="Enter budget"
                                min="0"
                                required
                            />

                        </div>

                    </div>


                    {/*  REQUIRED SKILL*/}

                    <div className="project-form-group">

                        <label>
                            Required Skills
                        </label>

                        <input
                            type="text"
                            name="requiredSkills"
                            value={formData.requiredSkills}
                            onChange={handleChange}
                            placeholder="React, Node.js, MongoDB"
                        />

                        <small>
                            Enter skills separated by commas.
                        </small>

                    </div>


                    {/*  DEADLIN */}

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


                    {/* PROJECT ATTACHMENT*/}

                    <div className="project-form-group">

                        <label>
                            Project Attachment
                        </label>

                        <input
                            type="file"
                            onChange={handleFileChange}
                        />

                        <small>
                            Attach project requirements,
                            documents, images, or reference files.
                        </small>


                        {attachment && (

                            <p className="selected-file">

                                Selected file:{" "}

                                <strong>
                                    {attachment.name}
                                </strong>

                            </p>

                        )}

                    </div>


                    {/*  BUTTONS */}

                    <div className="project-form-actions">


                        <button
                            type="button"
                            className="project-secondary-btn"
                            onClick={() =>
                                navigate("/projects")
                            }
                            disabled={loading}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="project-primary-btn"
                            disabled={loading}
                        >

                            {loading
                                ? "Creating..."
                                : "Create Project"
                            }

                        </button>


                    </div>

                </form>

            </div>

        </div>

    )

}


export default AddProject