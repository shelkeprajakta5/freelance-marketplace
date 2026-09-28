import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../css/Project.css"
import API_URL from "../config"


function MyProjects() {

    const navigate = useNavigate()

    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")


    useEffect(() => {

        const fetchMyProjects = async () => {

            try {

                const token =
                    localStorage.getItem("token")

                const response =
                    await fetch(
                        `${API_URL}/projects`,
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
                        "Failed to load projects"
                    )

                }


                const allProjects =
                    data.projects || []


                const user =
                    JSON.parse(
                        localStorage.getItem("user") ||
                        "null"
                    )


                const myProjects =
                    allProjects.filter(
                        project => {

                            const clientId =
                                project.client?._id ||
                                project.client

                            return (
                                clientId === user?._id
                            )

                        }
                    )


                setProjects(
                    myProjects
                )


            } catch (error) {

                setError(
                    error.message
                )

            } finally {

                setLoading(false)

            }

        }

        fetchMyProjects()

    }, [])


    if (loading) {

        return (
            <div className="project-page">

                <div className="project-loading">
                    Loading your projects...
                </div>

            </div>
        )

    }


    return (

        <div className="project-page">

            <div className="project-container">

                <div className="project-header">

                    <div>

                        <p className="project-label">
                            CLIENT PROJECTS
                        </p>

                        <h1>
                            My Projects
                        </h1>

                        <p>
                            Manage projects posted by you.
                        </p>

                    </div>


                    <button
                        className="project-primary-btn"
                        onClick={() =>
                            navigate("/projects/add")
                        }
                    >
                        + Add Project
                    </button>

                </div>


                {error && (

                    <div className="project-error">
                        {error}
                    </div>

                )}


                {projects.length === 0 ? (

                    <div className="project-empty">

                        <div className="project-empty-icon">
                            📁
                        </div>

                        <h2>
                            No Projects Yet
                        </h2>

                        <p>
                            You haven't created any projects yet.
                        </p>

                        <button
                            className="project-primary-btn"
                            onClick={() =>
                                navigate("/projects/add")
                            }
                        >
                            Create Project
                        </button>

                    </div>

                ) : (

                    <div className="project-grid">

                        {projects.map(project => (

                            <div
                                className="project-card"
                                key={project._id}
                            >

                                <div className="project-card-top">

                                    <span
                                        className={`project-status ${project.status?.toLowerCase()}`}
                                    >
                                        {project.status}
                                    </span>

                                    <span className="project-budget">
                                        ₹{project.budget}
                                    </span>

                                </div>


                                <h2>
                                    {project.title}
                                </h2>


                                <p className="project-description">
                                    {project.description}
                                </p>


                                <div className="project-meta">

                                    <div>

                                        <span>
                                            Category
                                        </span>

                                        <strong>
                                            {project.category?.name ||
                                                "N/A"}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Deadline
                                        </span>

                                        <strong>
                                            {project.deadline
                                                ? new Date(
                                                    project.deadline
                                                ).toLocaleDateString()
                                                : "N/A"}
                                        </strong>

                                    </div>

                                </div>


                                <div className="project-card-actions">

                                    <button
                                        className="project-view-btn"
                                        onClick={() =>
                                            navigate(
                                                `/projects/${project._id}`
                                            )
                                        }
                                    >
                                        View
                                    </button>


                                    <button
                                        className="project-edit-btn"
                                        onClick={() =>
                                            navigate(
                                                `/projects/edit/${project._id}`
                                            )
                                        }
                                    >
                                        Edit
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>

    )

}

export default MyProjects