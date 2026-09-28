import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../css/Project.css"
import API_URL from "../config"

function ProjectDetails() {

    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")


    useEffect(() => {

        const fetchProject = async () => {

            try {

                const token =
                    localStorage.getItem("token")

                const response = await fetch(
                    `${API_URL}/projects/${id}`,
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
                        "Failed to load project"
                    )

                }

                setProject(data.project)

            } catch (error) {

                setError(error.message)

            } finally {

                setLoading(false)

            }

        }

        fetchProject()

    }, [id])


    const handleClose = async () => {

        const confirmClose =
            window.confirm(
                "Are you sure you want to close this project?"
            )

        if (!confirmClose) return

        try {

            const token =
                localStorage.getItem("token")

            const response =
                await fetch(
                   `${API_URL}/projects/${id}/close`,
                    {
                        method: "PUT",
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
                    "Failed to close project"
                )

            }

            setProject(data.project)

        } catch (error) {

            alert(error.message)

        }

    }


    const handleSubmitProposal = () => {

        navigate(
            `/proposals/add/${project._id}`
        )

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


    if (error) {

        return (

            <div className="project-page">

                <div className="project-error-page">

                    <h2>
                        Project
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        className="project-primary-btn"
                        onClick={() =>
                            navigate("/projects")
                        }
                    >
                        Back to Projects
                    </button>

                </div>

            </div>

        )

    }


    return (

        <div className="project-page">

            <div className="project-details-container">


                {/*HEADE */}

                <div className="project-details-header">

                    <div>

                        <p className="project-label">
                            PROJECT DETAILS
                        </p>

                        <h1>
                            {project?.title}
                        </h1>

                        <span
                            className={`project-status ${
                                project?.status
                                    ?.toLowerCase()
                                    .replace(" ", "-")
                            }`}
                        >
                            {project?.status}
                        </span>

                    </div>


                    <button
                        className="project-secondary-btn"
                        onClick={() =>
                            navigate("/projects")
                        }
                    >
                        ← Back
                    </button>

                </div>


                {/*  DETAILS GRID */}

                <div className="project-details-grid">


                    {/* MAIN CARD*/}

                    <div className="project-main-card">

                        <h2>
                            Project Description
                        </h2>

                        <p className="project-full-description">
                            {project?.description}
                        </p>


                        <div className="project-detail-section">

                            <h3>
                                Required Skills
                            </h3>

                            <div className="project-skills">

                                {project?.requiredSkills?.length > 0 ? (

                                    project.requiredSkills.map(
                                        (skill, index) => (

                                            <span
                                                key={index}
                                            >
                                                {skill}
                                            </span>

                                        )
                                    )

                                ) : (

                                    <span>
                                        No specific skills mentioned
                                    </span>

                                )}

                            </div>

                        </div>


                        {/* ATTACHMENTS */}

                        {project?.attachments?.length > 0 && (

                            <div className="project-detail-section">

                                <h3>
                                    Attachments
                                </h3>

                                <div className="project-attachments">

                                    {project.attachments.map(
                                        (file, index) => (

                                            <div
                                                key={index}
                                                className="project-attachment"
                                            >
                                                📎 {file}
                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        )}

                    </div>


                    {/*  SIDE CARD*/}

                    <div className="project-side-card">

                        <h2>
                            Project Information
                        </h2>


                        <div className="project-detail-row">

                            <span>
                                Budget
                            </span>

                            <strong>
                                ₹{project?.budget}
                            </strong>

                        </div>


                        <div className="project-detail-row">

                            <span>
                                Category
                            </span>

                            <strong>
                                {project?.category?.name ||
                                    project?.category ||
                                    "N/A"}
                            </strong>

                        </div>


                        <div className="project-detail-row">

                            <span>
                                Deadline
                            </span>

                            <strong>
                                {project?.deadline
                                    ? new Date(
                                        project.deadline
                                    ).toLocaleDateString()
                                    : "N/A"}
                            </strong>

                        </div>


                        <div className="project-detail-row">

                            <span>
                                Created
                            </span>

                            <strong>
                                {project?.createdAt
                                    ? new Date(
                                        project.createdAt
                                    ).toLocaleDateString()
                                    : "N/A"}
                            </strong>

                        </div>


                        {/*  FREELANCER ACTION*/}

                        {user?.role === "Freelancer" &&
                            project?.status === "Open" && (

                                <div className="project-proposal-action">

                                    <button
                                        className="submit-proposal-btn"
                                        onClick={
                                            handleSubmitProposal
                                        }
                                    >
                                        📩 Submit Proposal
                                    </button>

                                    <p>
                                        Interested in this project?
                                        Send your proposal to the client.
                                    </p>

                                </div>

                            )}


                        {/* CLIENT ACTIONS*/}

                        {user?.role === "Client" && (

                            <div className="project-details-actions">

                                <button
                                    className="project-edit-btn large"
                                    onClick={() =>
                                        navigate(
                                            `/projects/edit/${project._id}`
                                        )
                                    }
                                >
                                    ✏️ Edit Project
                                </button>


                                {project?.status !== "Closed" && (

                                    <button
                                        className="project-close-btn"
                                        onClick={handleClose}
                                    >
                                        🔒 Close Project
                                    </button>

                                )}

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>

    )

}

export default ProjectDetails