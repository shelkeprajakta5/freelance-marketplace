import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../css/Project.css"
import API_URL from "../config"


function ProjectList() {

    const navigate = useNavigate()
    const { user } = useAuth()

    const [projects, setProjects] = useState([])
    const [categories, setCategories] = useState([])

    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("")
    const [skills, setSkills] = useState("")
    const [minimumBudget, setMinimumBudget] = useState("")
    const [maximumBudget, setMaximumBudget] = useState("")
    const [status, setStatus] = useState("")

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")


    // FETCH CATEGORIES

    const fetchCategories = async () => {

        try {

            const token =
                localStorage.getItem("token")

            const response =
                await fetch(
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

            console.log(error.message)

        }

    }


    // FETCH PROJECTS
    const fetchProjects = async () => {

        setLoading(true)
        setError("")

        try {

            const token =
                localStorage.getItem("token")

            const params =
                new URLSearchParams()


            // SEARCH

            if (search.trim()) {

                params.append(
                    "search",
                    search.trim()
                )

            }


            // CATEGORY

            if (category) {

                params.append(
                    "category",
                    category
                )

            }


            // SKILLS

            if (skills.trim()) {

                params.append(
                    "skills",
                    skills.trim()
                )

            }


            // MINIMUM BUDGET

            if (minimumBudget !== "") {

                params.append(
                    "minimumBudget",
                    minimumBudget
                )

            }


            // MAXIMUM BUDGET

            if (maximumBudget !== "") {

                params.append(
                    "maximumBudget",
                    maximumBudget
                )

            }


            // STATUS

            if (status) {

                params.append(
                    "status",
                    status
                )

            }


            const queryString =
                params.toString()


            const url =
    queryString
        ? `${API_URL}/projects?${queryString}`
        : `${API_URL}/projects`

            const response =
                await fetch(
                    url,
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


            setProjects(
                data.projects || []
            )

        } catch (error) {

            setError(
                error.message
            )

        } finally {

            setLoading(false)

        }

    }


    // INITIAL LOAD

    useEffect(() => {

        fetchCategories()
        fetchProjects()

    }, [])

    const handleSearch = (e) => {

        e.preventDefault()

        fetchProjects()

    }


   
    // CLEAR FILTERS


    const handleClearFilters = () => {

        setSearch("")
        setCategory("")
        setSkills("")
        setMinimumBudget("")
        setMaximumBudget("")
        setStatus("")

        setTimeout(() => {

            fetchProjects()

        }, 0)

    }


    // DELETE PROJECT

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this project?"
            )

        if (!confirmDelete) return


        try {

            const token =
                localStorage.getItem("token")


            const response =
                await fetch(
                    `${API_URL}/projects/${id}`,
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
                    "Failed to delete project"
                )

            }


            setProjects(
                projects.filter(
                    project =>
                        project._id !== id
                )
            )

        } catch (error) {

            alert(
                error.message
            )

        }

    }

    // LOADING

    if (loading) {

        return (

            <div className="project-page">

                <div className="project-loading">

                    Loading projects...

                </div>

            </div>

        )

    }


    return (

        <div className="project-page">

            <div className="project-container">


                {/* HEADER*/}

                <div className="project-header">

                    <div>

                        <p className="project-label">
                            PROJECT MARKETPLACE
                        </p>

                        <h1>
                            Projects
                        </h1>

                        <p>
                            Browse and find freelance projects
                        </p>

                    </div>


                    <div className="project-header-actions">

                        {user?.role === "Client" && (

                            <button
                                className="project-primary-btn"
                                onClick={() =>
                                    navigate("/projects/add")
                                }
                            >
                                + Add Project
                            </button>

                        )}

                        <button
                            className="project-secondary-btn"
                            onClick={() => navigate(-1)}
                        >
                            Back
                        </button>

                    </div>

                </div>


                {/*SEARCH & FILTE= */}

                <div className="project-filter-container">

                    <form
                        className="project-filter-form"
                        onSubmit={handleSearch}
                    >


                        {/* SEARCH */}

                        <div className="project-filter-group search-group">

                            <label>
                                Search Project
                            </label>

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                placeholder="Search by title, description or skill"
                            />

                        </div>


                        {/* CATEGORY */}

                        <div className="project-filter-group">

                            <label>
                                Category
                            </label>

                            <select
                                value={category}
                                onChange={(e) =>
                                    setCategory(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    All Categories
                                </option>

                                {categories.map(
                                    categoryItem => (

                                        <option
                                            key={
                                                categoryItem._id
                                            }
                                            value={
                                                categoryItem._id
                                            }
                                        >
                                            {
                                                categoryItem.name
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* SKILLS */}

                        <div className="project-filter-group">

                            <label>
                                Skills
                            </label>

                            <input
                                type="text"
                                value={skills}
                                onChange={(e) =>
                                    setSkills(
                                        e.target.value
                                    )
                                }
                                placeholder="React, Node.js"
                            />

                        </div>


                        {/* MINIMUM BUDGET */}

                        <div className="project-filter-group">

                            <label>
                                Min Budget
                            </label>

                            <input
                                type="number"
                                value={minimumBudget}
                                onChange={(e) =>
                                    setMinimumBudget(
                                        e.target.value
                                    )
                                }
                                placeholder="₹ Minimum"
                                min="0"
                            />

                        </div>


                        {/* MAXIMUM BUDGET */}

                        <div className="project-filter-group">

                            <label>
                                Max Budget
                            </label>

                            <input
                                type="number"
                                value={maximumBudget}
                                onChange={(e) =>
                                    setMaximumBudget(
                                        e.target.value
                                    )
                                }
                                placeholder="₹ Maximum"
                                min="0"
                            />

                        </div>


                        {/* STATUS */}

                        <div className="project-filter-group">

                            <label>
                                Status
                            </label>

                            <select
                                value={status}
                                onChange={(e) =>
                                    setStatus(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    All Status
                                </option>

                                <option value="Open">
                                    Open
                                </option>

                                <option value="In Progress">
                                    In Progress
                                </option>

                                <option value="Completed">
                                    Completed
                                </option>

                                <option value="Closed">
                                    Closed
                                </option>

                            </select>

                        </div>


                        {/* BUTTONS */}

                        <div className="project-filter-actions">

                            <button
                                type="submit"
                                className="project-primary-btn"
                            >
                                Search
                            </button>

                            <button
                                type="button"
                                className="project-secondary-btn"
                                onClick={
                                    handleClearFilters
                                }
                            >
                                Clear
                            </button>

                        </div>

                    </form>

                </div>


                {/*ERROR*/}

                {error && (

                    <div className="project-error">

                        {error}

                    </div>

                )}


                {/*  RESULT COUNT*/}

                <div className="project-result-info">

                    <strong>
                        {projects.length}
                    </strong>

                    <span>
                        {projects.length === 1
                            ? " project found"
                            : " projects found"}
                    </span>

                </div>


                {/* PROJECT*/}

                {projects.length === 0 ? (

                    <div className="project-empty">

                        <div className="project-empty-icon">
                            🔍
                        </div>

                        <h2>
                            No Projects Found
                        </h2>

                        <p>
                            Try changing your search or filters.
                        </p>

                        <button
                            className="project-secondary-btn"
                            onClick={
                                handleClearFilters
                            }
                        >
                            Clear Filters
                        </button>

                    </div>

                ) : (

                    <div className="project-grid">

                        {projects.map(
                            project => (

                                <div
                                    className="project-card"
                                    key={
                                        project._id
                                    }
                                >

                                    {/* CARD TOP */}

                                    <div className="project-card-top">

                                        <span
                                            className={`project-status ${project.status?.toLowerCase().replace(" ", "-")}`}
                                        >
                                            {
                                                project.status
                                            }
                                        </span>

                                        <span className="project-budget">
                                            ₹
                                            {
                                                project.budget
                                            }
                                        </span>

                                    </div>


                                    {/* TITLE */}

                                    <h2>
                                        {
                                            project.title
                                        }
                                    </h2>


                                    {/* DESCRIPTION */}

                                    <p className="project-description">

                                        {
                                            project.description?.length >
                                            120
                                                ? project.description.substring(
                                                    0,
                                                    120
                                                ) + "..."
                                                : project.description
                                        }

                                    </p>


                                    {/* SKILLS */}

                                    {project.requiredSkills?.length >
                                        0 && (

                                        <div className="project-skills">

                                            {project.requiredSkills
                                                .slice(
                                                    0,
                                                    4
                                                )
                                                .map(
                                                    (
                                                        skill,
                                                        index
                                                    ) => (

                                                        <span
                                                            key={
                                                                index
                                                            }
                                                        >
                                                            {
                                                                skill
                                                            }
                                                        </span>

                                                    )
                                                )}

                                        </div>

                                    )}


                                    {/* META */}

                                    <div className="project-meta">

                                        <div>

                                            <span>
                                                Category
                                            </span>

                                            <strong>
                                                {
                                                    project.category?.name ||
                                                    project.category ||
                                                    "N/A"
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Deadline
                                            </span>

                                            <strong>

                                                {
                                                    project.deadline
                                                        ? new Date(
                                                            project.deadline
                                                        ).toLocaleDateString()
                                                        : "N/A"
                                                }

                                            </strong>

                                        </div>

                                    </div>


                                    {/* ACTIONS */}

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


                                        {user?.role ===
                                            "Client" && (

                                            <>

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


                                                <button
                                                    className="project-delete-btn"
                                                    onClick={() =>
                                                        handleDelete(
                                                            project._id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </>

                                        )}

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>

    )

}

export default ProjectList