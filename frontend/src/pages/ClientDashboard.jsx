import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../css/ClientDashboard.css"
import API_URL from "../config"

function ClientDashboard() {

    const navigate = useNavigate()

    const {
        user,
        logout
    } = useAuth()


    // DASHBOARD STATISTICS


    const [dashboardStats, setDashboardStats] = useState({
        totalProjects: 0,
        openProjects: 0,
        closedProjects: 0,
        proposalsReceived: 0,
        activeContracts: 0,
        completedContracts: 0
    })


    const [loadingStats, setLoadingStats] = useState(true)

    // PROJECTS

    const [myProjects, setMyProjects] = useState([])

    const [loadingProjects, setLoadingProjects] =
        useState(true)

    // NOTIFICATIONS


    const [notifications, setNotifications] =
        useState([])

    const [unreadCount, setUnreadCount] =
        useState(0)

    const [showNotifications, setShowNotifications] =
        useState(false)

    const [loadingNotifications, setLoadingNotifications] =
        useState(false)


    // FETCH DASHBOARD STATISTICS

    useEffect(() => {

        const fetchDashboardStats = async () => {

            try {

                setLoadingStats(true)


                const token =
                    localStorage.getItem("token")


                const response =
                    await fetch(
                        `${API_URL}/client-dashboard`,
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
                        "Failed to load dashboard statistics"
                    )

                }


                setDashboardStats({

                    totalProjects:
                        data.totalProjects || 0,

                    openProjects:
                        data.openProjects || 0,

                    closedProjects:
                        data.closedProjects || 0,

                    proposalsReceived:
                        data.proposalsReceived || 0,

                    activeContracts:
                        data.activeContracts || 0,

                    completedContracts:
                        data.completedContracts || 0

                })


            } catch (error) {

                console.log(
                    "Dashboard Error:",
                    error.message
                )

            } finally {

                setLoadingStats(false)

            }

        }


        if (user?._id) {

            fetchDashboardStats()

        }

    }, [user])


    // FETCH CLIENT PROJECTS

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


                const currentUserId =
                    user?._id?.toString()


                const clientProjects =
                    allProjects.filter(
                        project => {

                            const projectClientId =
                                (
                                    project.client?._id ||
                                    project.client
                                )?.toString()


                            return (
                                projectClientId ===
                                currentUserId
                            )

                        }
                    )


                setMyProjects(
                    clientProjects
                )


            } catch (error) {

                console.log(
                    error.message
                )

            } finally {

                setLoadingProjects(false)

            }

        }


        if (user?._id) {

            fetchMyProjects()

        }

    }, [user])


    // FETCH NOTIFICATIONS
    const fetchNotifications = async () => {

        try {

            setLoadingNotifications(true)


            const token =
                localStorage.getItem("token")


            const response =
                await fetch(
                    `${API_URL}/notifications/my`,
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
                    "Failed to load notifications"
                )

            }


            setNotifications(
                data.notifications || []
            )


            setUnreadCount(
                data.unreadCount || 0
            )


        } catch (error) {

            console.log(
                "Notification Error:",
                error.message
            )

        } finally {

            setLoadingNotifications(false)

        }

    }

    // LOAD NOTIFICATIONS

    useEffect(() => {

        if (user?._id) {

            fetchNotifications()

        }

    }, [user])

    // MARK ONE NOTIFICATION AS READ

    const markAsRead = async (notificationId) => {

        try {

            const token =
                localStorage.getItem("token")


            const response =
                await fetch(
                    `${API_URL}/notifications/${notificationId}/read`,
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
                    "Failed to mark notification as read"
                )

            }


            setNotifications(
                previous =>
                    previous.map(
                        notification =>
                            notification._id === notificationId
                                ? {
                                    ...notification,
                                    isRead: true
                                }
                                : notification
                    )
            )


            setUnreadCount(
                previous =>
                    previous > 0
                        ? previous - 1
                        : 0
            )


        } catch (error) {

            console.log(
                error.message
            )

        }

    }


    // MARK ALL AS READ

    const markAllAsRead = async () => {

        try {

            const token =
                localStorage.getItem("token")


            const response =
                await fetch(
                    `${API_URL}/notifications/read-all`,
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
                    "Failed to mark all notifications as read"
                )

            }


            setNotifications(
                previous =>
                    previous.map(
                        notification => ({
                            ...notification,
                            isRead: true
                        })
                    )
            )


            setUnreadCount(0)


        } catch (error) {

            console.log(
                error.message
            )

        }

    }

    // DELETE NOTIFICATION

    const deleteNotification = async (notificationId) => {

        try {

            const token =
                localStorage.getItem("token")


            const notification =
                notifications.find(
                    item =>
                        item._id === notificationId
                )


            const response =
                await fetch(
                    `${API_URL}/notifications/${notificationId}`,
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
                    "Failed to delete notification"
                )

            }


            setNotifications(
                previous =>
                    previous.filter(
                        item =>
                            item._id !== notificationId
                    )
            )


            if (
                notification &&
                !notification.isRead
            ) {

                setUnreadCount(
                    previous =>
                        previous > 0
                            ? previous - 1
                            : 0
                )

            }


        } catch (error) {

            console.log(
                error.message
            )

        }

    }


    // LOGOUT

    const handleLogout = async () => {

        await logout()

        navigate("/login")

    }

    // RECENT PROJECTS

    const recentProjects =
        myProjects.slice(0, 3)


    return (

        <div className="client-dashboard">


            {/*  NAVBAR */}

            <nav className="client-navbar">


                <div className="client-brand">

                    <div className="client-logo">
                        FM
                    </div>


                    <div>

                        <h2>
                            Freelance Marketplace
                        </h2>

                        <span>
                            Client Panel
                        </span>

                    </div>

                </div>


                <div className="client-nav-right">


                    <div className="client-user">

                        <div className="client-avatar">

                            {user?.name
                                ?.charAt(0)
                                ?.toUpperCase()
                            }

                        </div>


                        <div>

                            <strong>
                                {user?.name}
                            </strong>

                            <small>
                                {user?.role}
                            </small>

                        </div>

                    </div>


                    {/*  NOTIFICATIONS */}

                    <div className="notification-container">

                        <button
                            className="notification-btn"
                            onClick={() => {

                                setShowNotifications(
                                    previous =>
                                        !previous
                                )

                                if (!showNotifications) {

                                    fetchNotifications()

                                }

                            }}
                        >

                            🔔


                            {unreadCount > 0 && (

                                <span className="notification-badge">

                                    {unreadCount > 99
                                        ? "99+"
                                        : unreadCount
                                    }

                                </span>

                            )}

                        </button>


                        {showNotifications && (

                            <div className="notification-dropdown">


                                <div className="notification-header">

                                    <div>

                                        <h3>
                                            Notifications
                                        </h3>

                                        <span>
                                            {unreadCount} unread
                                        </span>

                                    </div>


                                    {unreadCount > 0 && (

                                        <button
                                            className="mark-all-btn"
                                            onClick={
                                                markAllAsRead
                                            }
                                        >
                                            Mark all as read
                                        </button>

                                    )}

                                </div>


                                <div className="notification-list">


                                    {loadingNotifications ? (

                                        <div className="notification-empty">

                                            Loading notifications...

                                        </div>

                                    ) : notifications.length === 0 ? (

                                        <div className="notification-empty">

                                            <div>
                                                🔔
                                            </div>

                                            <p>
                                                No notifications
                                            </p>

                                        </div>

                                    ) : (

                                        notifications.map(
                                            notification => (

                                                <div
                                                    key={
                                                        notification._id
                                                    }
                                                    className={
                                                        `notification-item ${
                                                            notification.isRead
                                                                ? "read"
                                                                : "unread"
                                                        }`
                                                    }
                                                >


                                                    <div className="notification-icon">

                                                        {notification.type ===
                                                            "New Proposal"
                                                            ? "📩"
                                                            : notification.type ===
                                                                "Proposal Accepted"
                                                                ? "✅"
                                                                : notification.type ===
                                                                    "Proposal Rejected"
                                                                    ? "❌"
                                                                    : notification.type ===
                                                                        "New Message"
                                                                        ? "💬"
                                                                        : notification.type ===
                                                                            "Work Submitted"
                                                                            ? "📤"
                                                                            : notification.type ===
                                                                                "Work Approved"
                                                                                ? "✅"
                                                                                : notification.type ===
                                                                                    "Revision Requested"
                                                                                    ? "🔄"
                                                                                    : notification.type ===
                                                                                        "New Review"
                                                                                        ? "⭐"
                                                                                        : notification.type ===
                                                                                            "Contract Completed"
                                                                                            ? "🎉"
                                                                                            : "🔔"
                                                        }

                                                    </div>


                                                    <div className="notification-content">

                                                        <strong>
                                                            {
                                                                notification.type
                                                            }
                                                        </strong>


                                                        <p>
                                                            {
                                                                notification.message
                                                            }
                                                        </p>


                                                        <small>

                                                            {new Date(
                                                                notification.createdAt
                                                            ).toLocaleString()}

                                                        </small>


                                                        <div className="notification-actions">


                                                            {!notification.isRead && (

                                                                <button
                                                                    onClick={() =>
                                                                        markAsRead(
                                                                            notification._id
                                                                        )
                                                                    }
                                                                >
                                                                    Mark as read
                                                                </button>

                                                            )}


                                                            <button
                                                                className="delete-notification-btn"
                                                                onClick={() =>
                                                                    deleteNotification(
                                                                        notification._id
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </button>


                                                        </div>

                                                    </div>

                                                </div>

                                            )
                                        )

                                    )}

                                </div>

                            </div>

                        )}

                    </div>


                    {/* PROFILE */}

                    <button
                        className="client-profile-btn"
                        onClick={() =>
                            navigate("/profile")
                        }
                    >
                        Profile
                    </button>


                    {/* CLIENT PROFILE */}

                    <button
                        className="client-profile-btn"
                        onClick={() =>
                            navigate("/client/profile")
                        }
                    >
                        Client Profile
                    </button>


                    {/* MESSAGES */}

                    <button
                        className="client-message-btn"
                        onClick={() =>
                            navigate("/messages")
                        }
                    >
                        💬 Messages
                    </button>


                    {/* LOGOUT */}

                    <button
                        className="client-logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>


                </div>

            </nav>


            {/* MAIN CONTENT */}

            <main className="client-main">


                {/* WELCOME */}

                <section className="client-welcome">

                    <div>

                        <p className="client-small-title">
                            CLIENT DASHBOARD
                        </p>


                        <h1>
                            Welcome, {user?.name}! 👋
                        </h1>


                        <p>
                            Find skilled freelancers and
                            get your projects completed.
                        </p>

                    </div>


                    <button
                        className="post-project-btn"
                        onClick={() =>
                            navigate("/projects/add")
                        }
                    >
                        + Post a Project
                    </button>


                </section>


                {/* STAT CARDS*/}

                <section className="client-stats">


                    {/* TOTAL PROJECTS */}

                    <div
                        className="client-stat-card"
                        onClick={() =>
                            navigate("/projects")
                        }
                        style={{
                            cursor: "pointer"
                        }}
                    >

                        <div className="stat-icon blue">
                            📁
                        </div>


                        <div>

                            <span>
                                Total Projects
                            </span>


                            <h2>
                                {loadingStats
                                    ? "..."
                                    : dashboardStats.totalProjects
                                }
                            </h2>

                        </div>

                    </div>


                    {/* OPEN PROJECTS */}

                    <div
                        className="client-stat-card"
                        onClick={() =>
                            navigate("/projects")
                        }
                        style={{
                            cursor: "pointer"
                        }}
                    >

                        <div className="stat-icon green">
                            📂
                        </div>


                        <div>

                            <span>
                                Open Projects
                            </span>


                            <h2>
                                {loadingStats
                                    ? "..."
                                    : dashboardStats.openProjects
                                }
                            </h2>

                        </div>

                    </div>


                    {/* CLOSED PROJECTS */}

                    <div
                        className="client-stat-card"
                        onClick={() =>
                            navigate("/projects")
                        }
                        style={{
                            cursor: "pointer"
                        }}
                    >

                        <div className="stat-icon purple">
                            📦
                        </div>


                        <div>

                            <span>
                                Closed Projects
                            </span>


                            <h2>
                                {loadingStats
                                    ? "..."
                                    : dashboardStats.closedProjects
                                }
                            </h2>

                        </div>

                    </div>


                    {/* PROPOSALS */}

                    <div
                        className="client-stat-card"
                        onClick={() =>
                            navigate("/received-proposals")
                        }
                        style={{
                            cursor: "pointer"
                        }}
                    >

                        <div className="stat-icon orange">
                            📩
                        </div>


                        <div>

                            <span>
                                Proposals Received
                            </span>


                            <h2>
                                {loadingStats
                                    ? "..."
                                    : dashboardStats.proposalsReceived
                                }
                            </h2>

                        </div>

                    </div>


                    {/* ACTIVE CONTRACTS */}

                    <div
                        className="client-stat-card"
                        onClick={() =>
                            navigate("/client/contracts")
                        }
                        style={{
                            cursor: "pointer"
                        }}
                    >

                        <div className="stat-icon blue">
                            📋
                        </div>


                        <div>

                            <span>
                                Active Contracts
                            </span>


                            <h2>
                                {loadingStats
                                    ? "..."
                                    : dashboardStats.activeContracts
                                }
                            </h2>

                        </div>

                    </div>


                    {/* COMPLETED CONTRACTS */}

                    <div
                        className="client-stat-card"
                        onClick={() =>
                            navigate("/client/contracts")
                        }
                        style={{
                            cursor: "pointer"
                        }}
                    >

                        <div className="stat-icon green">
                            ✅
                        </div>


                        <div>

                            <span>
                                Completed Contracts
                            </span>


                            <h2>
                                {loadingStats
                                    ? "..."
                                    : dashboardStats.completedContracts
                                }
                            </h2>

                        </div>

                    </div>


                </section>


                {/* CONTENT GRID */}

                <section className="client-content-grid">


                    {/* QUICK ACTIONS */}

                    <div className="client-card">

                        <div className="client-card-header">

                            <div>

                                <h2>
                                    Quick Actions
                                </h2>


                                <p>
                                    Manage your freelance
                                    activities
                                </p>

                            </div>

                        </div>


                        <div className="quick-actions">


                            <button
                                onClick={() =>
                                    navigate("/projects")
                                }
                            >

                                <span className="quick-icon">
                                    📁
                                </span>


                                <span>

                                    <strong>
                                        My Projects
                                    </strong>

                                    <small>
                                        View and manage projects
                                    </small>

                                </span>

                            </button>


                            <button
                                onClick={() =>
                                    navigate(
                                        "/projects/add"
                                    )
                                }
                            >

                                <span className="quick-icon">
                                    ➕
                                </span>


                                <span>

                                    <strong>
                                        Post a Project
                                    </strong>

                                    <small>
                                        Create a new project
                                    </small>

                                </span>

                            </button>


                            <button
                                onClick={() =>
                                    navigate(
                                        "/received-proposals"
                                    )
                                }
                            >

                                <span className="quick-icon">
                                    📩
                                </span>


                                <span>

                                    <strong>
                                        Received Proposals
                                    </strong>

                                    <small>
                                        Review and accept
                                        freelancer proposals
                                    </small>

                                </span>

                            </button>


                            <button
                                onClick={() =>
                                    navigate(
                                        "/client/contracts"
                                    )
                                }
                            >

                                <span className="quick-icon">
                                    📋
                                </span>


                                <span>

                                    <strong>
                                        My Contracts
                                    </strong>

                                    <small>
                                        Manage active and
                                        completed contracts
                                    </small>

                                </span>

                            </button>


                            <button
                                onClick={() =>
                                    navigate(
                                        "/freelancers"
                                    )
                                }
                            >

                                <span className="quick-icon">
                                    🔎
                                </span>


                                <span>

                                    <strong>
                                        Find Freelancers
                                    </strong>

                                    <small>
                                        Find skilled professionals
                                    </small>

                                </span>

                            </button>


                            <button
                                onClick={() =>
                                    navigate(
                                        "/profile"
                                    )
                                }
                            >

                                <span className="quick-icon">
                                    👤
                                </span>


                                <span>

                                    <strong>
                                        My Profile
                                    </strong>

                                    <small>
                                        Update account profile
                                    </small>

                                </span>

                            </button>


                            <button
                                onClick={() =>
                                    navigate(
                                        "/client/profile"
                                    )
                                }
                            >

                                <span className="quick-icon">
                                    🏢
                                </span>


                                <span>

                                    <strong>
                                        Client Profile
                                    </strong>

                                    <small>
                                        Manage company information
                                    </small>

                                </span>

                            </button>


                            <button
                                onClick={() =>
                                    navigate("/messages")
                                }
                            >

                                <span className="quick-icon">
                                    💬
                                </span>


                                <span>

                                    <strong>
                                        Messages
                                    </strong>

                                    <small>
                                        Chat with freelancers
                                    </small>

                                </span>

                            </button>


                            <button
                                onClick={() =>
                                    navigate("/reviews")
                                }
                            >

                                <span className="quick-icon">
                                    ⭐
                                </span>


                                <span>

                                    <strong>
                                        Reviews
                                    </strong>

                                    <small>
                                        View ratings and reviews
                                    </small>

                                </span>

                            </button>


                        </div>

                    </div>


                    {/* ACCOUNT CARD */}

                    <div className="client-card account-card">

                        <div className="client-card-header">

                            <div>

                                <h2>
                                    Account
                                </h2>


                                <p>
                                    Your account information
                                </p>

                            </div>

                        </div>


                        <div className="account-info">


                            <div className="account-row">

                                <span>
                                    Name
                                </span>


                                <strong>
                                    {user?.name}
                                </strong>

                            </div>


                            <div className="account-row">

                                <span>
                                    Email
                                </span>


                                <strong>
                                    {user?.email}
                                </strong>

                            </div>


                            <div className="account-row">

                                <span>
                                    Role
                                </span>


                                <strong className="role-badge">
                                    {user?.role}
                                </strong>

                            </div>


                        </div>


                        <button
                            className="edit-profile-btn"
                            onClick={() =>
                                navigate("/profile")
                            }
                        >
                            Edit Profile
                        </button>


                        <button
                            className="edit-profile-btn"
                            onClick={() =>
                                navigate(
                                    "/client/profile"
                                )
                            }
                            style={{
                                marginTop: "10px"
                            }}
                        >
                            View Client Profile
                        </button>


                    </div>


                </section>


                {/*   RECENT PROJECTS */}

                <section className="client-card recent-projects">


                    <div className="client-card-header">

                        <div>

                            <h2>
                                Recent Projects
                            </h2>


                            <p>
                                Your latest projects will
                                appear here.
                            </p>

                        </div>


                        <button
                            className="view-all-btn"
                            onClick={() =>
                                navigate(
                                    "/projects"
                                )
                            }
                        >
                            View All
                        </button>


                    </div>


                    {loadingProjects ? (

                        <div className="empty-projects">

                            <div className="empty-project-icon">
                                📁
                            </div>


                            <h3>
                                Loading projects...
                            </h3>

                        </div>

                    ) : recentProjects.length === 0 ? (

                        <div className="empty-projects">

                            <div className="empty-project-icon">
                                📁
                            </div>


                            <h3>
                                No projects yet
                            </h3>


                            <p>
                                Start by posting your first
                                project and find the right
                                freelancer.
                            </p>


                            <button
                                className="post-project-btn"
                                onClick={() =>
                                    navigate(
                                        "/projects/add"
                                    )
                                }
                            >
                                Post Your First Project
                            </button>

                        </div>

                    ) : (

                        <div className="dashboard-recent-projects">

                            {recentProjects.map(
                                project => (

                                    <div
                                        className="dashboard-project-item"
                                        key={project._id}
                                    >

                                        <div>

                                            <h3>
                                                {project.title}
                                            </h3>


                                            <p>

                                                {project.description?.length > 100
                                                    ? project.description.substring(
                                                        0,
                                                        100
                                                    ) + "..."
                                                    : project.description
                                                }

                                            </p>

                                        </div>


                                        <div className="dashboard-project-right">

                                            <span
                                                className={`project-status ${project.status?.toLowerCase().replace(" ", "-")}`}
                                            >
                                                {project.status}
                                            </span>


                                            <strong>
                                                ₹{project.budget}
                                            </strong>


                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/projects/${project._id}`
                                                    )
                                                }
                                            >
                                                View
                                            </button>


                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}


                </section>


            </main>


        </div>

    )

}


export default ClientDashboard