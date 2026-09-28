import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../css/AdminDashboard.css"
import API_URL from "../config"

function AdminDashboard() {

    const { user, logout } = useAuth()

    const navigate = useNavigate()


    const [stats, setStats] = useState({
        totalUsers: 0,
        totalFreelancers: 0,
        totalClients: 0,
        totalProjects: 0
    })


    const [loading, setLoading] = useState(true)


    // ========================================
    // FETCH ADMIN STATISTICS
    // ========================================

    useEffect(() => {

        const fetchAdminStats = async () => {

            try {

                const token =
                    localStorage.getItem("token")


                const response =
                    await fetch(
                        `${API_URL}/admin/dashboard`,
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
                        "Failed to load dashboard"
                    )

                }


                setStats({

                    totalUsers:
                        data.stats?.totalUsers || 0,

                    totalFreelancers:
                        data.stats?.totalFreelancers || 0,

                    totalClients:
                        data.stats?.totalClients || 0,

                    totalProjects:
                        data.stats?.totalProjects || 0

                })


            } catch (error) {

                console.log(
                    "Admin Dashboard Error:",
                    error.message
                )

            } finally {

                setLoading(false)

            }

        }


        fetchAdminStats()

    }, [])


    // ========================================
    // LOGOUT
    // ========================================

    const handleLogout = async () => {

        await logout()

        navigate("/login")

    }


    return (

        <div className="admin-dashboard">


            {/* ========================================
                NAVBAR
            ======================================== */}

            <nav className="admin-navbar">


                <div className="admin-brand">

                    <div className="admin-logo">
                        FM
                    </div>


                    <div>

                        <h2>
                            Freelance Marketplace
                        </h2>

                        <span>
                            Admin Panel
                        </span>

                    </div>

                </div>


                <div className="admin-user">

                    <div className="admin-user-info">

                        <strong>
                            {user?.name}
                        </strong>

                        <span>
                            Administrator
                        </span>

                    </div>


                    <button
                        className="admin-profile"
                        onClick={() =>
                            navigate("/profile")
                        }
                    >
                        Profile
                    </button>


                    <button
                        className="admin-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </nav>


            {/* ========================================
                MAIN CONTENT
            ======================================== */}

            <main className="admin-content">


                {/* ========================================
                    WELCOME
                ======================================== */}

                <section className="admin-welcome">

                    <p className="admin-label">
                        ADMIN PANEL
                    </p>


                    <h1>
                        Admin Dashboard
                    </h1>


                    <p>
                        Monitor and manage your freelance
                        marketplace.
                    </p>

                </section>


                {/* ========================================
                    STATISTICS
                ======================================== */}

                <section className="admin-stats">


                    {/* USERS */}

                    <div
                        className="admin-stat-card"
                        onClick={() =>
                            navigate("/admin/users")
                        }
                    >

                        <div className="admin-stat-icon blue">
                            👥
                        </div>


                        <div>

                            <span>
                                Total Users
                            </span>

                            <h2>
                                {loading
                                    ? "..."
                                    : stats.totalUsers
                                }
                            </h2>

                        </div>

                    </div>


                    {/* FREELANCERS */}

                    <div
                        className="admin-stat-card"
                        onClick={() =>
                            navigate("/freelancers")
                        }
                    >

                        <div className="admin-stat-icon purple">
                            💼
                        </div>


                        <div>

                            <span>
                                Freelancers
                            </span>

                            <h2>
                                {loading
                                    ? "..."
                                    : stats.totalFreelancers
                                }
                            </h2>

                        </div>

                    </div>


                    {/* CLIENTS */}

                    <div
                        className="admin-stat-card"
                        onClick={() =>
                            navigate("/admin/users")
                        }
                    >

                        <div className="admin-stat-icon green">
                            👤
                        </div>


                        <div>

                            <span>
                                Clients
                            </span>

                            <h2>
                                {loading
                                    ? "..."
                                    : stats.totalClients
                                }
                            </h2>

                        </div>

                    </div>


                    {/* PROJECTS */}

                    <div
                        className="admin-stat-card"
                        onClick={() =>
                            navigate("/projects")
                        }
                    >

                        <div className="admin-stat-icon orange">
                            📁
                        </div>


                        <div>

                            <span>
                                Projects
                            </span>

                            <h2>
                                {loading
                                    ? "..."
                                    : stats.totalProjects
                                }
                            </h2>

                        </div>

                    </div>


                </section>


                {/* ========================================
                    ADMIN MANAGEMENT
                ======================================== */}

                <section className="admin-section">


                    <div className="admin-section-header">

                        <div>

                            <p className="admin-label">
                                ADMIN MANAGEMENT
                            </p>

                            <h2>
                                Manage Marketplace
                            </h2>

                        </div>

                    </div>


                    <div className="admin-management-grid">


                        {/* USER MANAGEMENT */}

                        <div
                            className="admin-management-card"
                            onClick={() =>
                                navigate("/admin/users")
                            }
                        >

                            <div className="management-icon">
                                👥
                            </div>


                            <div>

                                <h3>
                                    User Management
                                </h3>

                                <p>
                                    View, edit, block and
                                    delete marketplace users.
                                </p>

                            </div>

                        </div>


                        {/* PROJECT MANAGEMENT */}

                        <div
                            className="admin-management-card"
                            onClick={() =>
                                navigate("/projects")
                            }
                        >

                            <div className="management-icon">
                                📁
                            </div>


                            <div>

                                <h3>
                                    Project Management
                                </h3>

                                <p>
                                    View and manage
                                    marketplace projects.
                                </p>

                            </div>

                        </div>


                        {/* CATEGORY MANAGEMENT */}

                        <div
                            className="admin-management-card"
                            onClick={() =>
                                navigate("/categories")
                            }
                        >

                            <div className="management-icon">
                                🗂️
                            </div>


                            <div>

                                <h3>
                                    Category Management
                                </h3>

                                <p>
                                    Add, edit and delete
                                    project categories.
                                </p>

                            </div>

                        </div>


                        {/* FREELANCER MANAGEMENT */}

                        <div
                            className="admin-management-card"
                            onClick={() =>
                                navigate("/freelancers")
                            }
                        >

                            <div className="management-icon">
                                💼
                            </div>


                            <div>

                                <h3>
                                    Freelancer Management
                                </h3>

                                <p>
                                    View freelancer profiles
                                    and information.
                                </p>

                            </div>

                        </div>


                        {/* ANALYTICS */}

                        <div
                            className="admin-management-card"
                            onClick={() =>
                                navigate("/admin/analytics")
                            }
                        >

                            <div className="management-icon">
                                📊
                            </div>


                            <div>

                                <h3>
                                    Analytics
                                </h3>

                                <p>
                                    View users, projects,
                                    proposals, contracts
                                    and category analytics.
                                </p>

                            </div>

                        </div>


                    </div>

                </section>


                {/* ========================================
                    QUICK ACTIONS
                ======================================== */}

                <section className="admin-quick-section">


                    <div>

                        <p className="admin-label">
                            QUICK ACTIONS
                        </p>


                        <h2>
                            Quick Access
                        </h2>

                    </div>


                    <div className="admin-quick-actions">


                        <button
                            onClick={() =>
                                navigate("/admin/users")
                            }
                        >
                            👥 Manage Users
                        </button>


                        <button
                            onClick={() =>
                                navigate("/categories")
                            }
                        >
                            🗂️ Manage Categories
                        </button>


                        <button
                            onClick={() =>
                                navigate("/projects")
                            }
                        >
                            📁 View Projects
                        </button>


                        <button
                            onClick={() =>
                                navigate("/freelancers")
                            }
                        >
                            💼 View Freelancers
                        </button>


                        <button
                            onClick={() =>
                                navigate("/admin/analytics")
                            }
                        >
                            📊 View Analytics
                        </button>


                        <button
                            onClick={() =>
                                navigate("/profile")
                            }
                        >
                            👤 My Profile
                        </button>


                    </div>

                </section>


            </main>

        </div>

    )

}


export default AdminDashboard