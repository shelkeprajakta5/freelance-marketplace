import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "../css/NotificationList.css"
import API_URL from "../config"

function NotificationList() {

    const navigate =
        useNavigate()


    const [notifications, setNotifications] =
        useState([])


    const [loading, setLoading] =
        useState(true)


    const [error, setError] =
        useState("")


    const [unreadCount, setUnreadCount] =
        useState(0)


    const token =
        localStorage.getItem("token")


    // FETCH NOTIFICATIONS
    
    const fetchNotifications =
        async () => {

            try {

                setLoading(true)

                setError("")


                const response =
                    await axios.get(

                        `${API_URL}/notifications/my`,

                        {

                            headers: {

                                Authorization:
                                    `Bearer ${token}`

                            }

                        }

                    )


                setNotifications(

                    response.data.notifications ||
                    []

                )


                setUnreadCount(

                    response.data.unreadCount ||
                    0

                )


            } catch (error) {

                console.error(error)


                setError(

                    error.response?.data?.message ||
                    "Failed to load notifications"

                )

            } finally {

                setLoading(false)

            }

        }


    useEffect(() => {

        fetchNotifications()

    }, [])

    // MARK ONE AS READ

    const markAsRead =
        async (id) => {

            try {

                await axios.put(

                    `${API_URL}/notifications/${id}/read`,

                    {},

                    {

                        headers: {

                            Authorization:
                                `Bearer ${token}`

                        }

                    }

                )


                fetchNotifications()


            } catch (error) {

                console.error(error)

            }

        }


    // MARK ALL AS READ

    const markAllAsRead =
        async () => {

            try {

                await axios.put(

                    `${API_URL}/notifications/read-all`,

                    {},

                    {

                        headers: {

                            Authorization:
                                `Bearer ${token}`

                        }

                    }

                )


                fetchNotifications()


            } catch (error) {

                console.error(error)

            }

        }

    // DELETE

    const deleteNotification =
        async (id) => {

            try {

                await axios.delete(

                    `${API_URL}/notifications/${id}`,

                    {

                        headers: {

                            Authorization:
                                `Bearer ${token}`

                        }

                    }

                )


                fetchNotifications()


            } catch (error) {

                console.error(error)

            }

        }


    // FORMAT DATE

    const formatDate =
        (date) => {

            return new Date(
                date
            ).toLocaleString()

        }

    // NOTIFICATION ICON

    const getIcon =
        (type) => {

            switch (type) {

                case "New Proposal":
                    return "📩"

                case "Proposal Accepted":
                    return "✅"

                case "Proposal Rejected":
                    return "❌"

                case "New Message":
                    return "💬"

                case "Work Submitted":
                    return "📤"

                case "Work Approved":
                    return "✔️"

                case "Revision Requested":
                    return "🔄"

                case "New Review":
                    return "⭐"

                case "Contract Completed":
                    return "🎉"

                default:
                    return "🔔"

            }

        }


    if (loading) {

        return (

            <div className="notifications-page">

                <div className="notifications-container">

                    <p className="notification-loading">

                        Loading notifications...

                    </p>

                </div>

            </div>

        )

    }


    return (

        <div className="notifications-page">

            <div className="notifications-container">


                {/* HEADER */}

                <div className="notifications-header">

                    <div>

                        <span className="notifications-label">
                            NOTIFICATIONS
                        </span>

                        <h1>
                            Notifications
                        </h1>

                        <p>
                            Stay updated with your
                            marketplace activity.
                        </p>

                    </div>


                    <div className="notifications-header-actions">

                        {unreadCount > 0 && (

                            <button
                                onClick={markAllAsRead}
                                className="mark-all-btn"
                            >
                                Mark All as Read
                            </button>

                        )}


                        <button
                            onClick={() => navigate(-1)}
                            className="notification-back-btn"
                        >
                            Back
                        </button>

                    </div>

                </div>


                {/*  ERROR */}

                {error && (

                    <div className="notification-error">

                        {error}

                    </div>

                )}


                {/*  SUMMARY*/}

                <div className="notification-summary">

                    <div>

                        <strong>
                            {notifications.length}
                        </strong>

                        <span>
                            Total Notifications
                        </span>

                    </div>


                    <div>

                        <strong>
                            {unreadCount}
                        </strong>

                        <span>
                            Unread
                        </span>

                    </div>

                </div>


                {/*  EMPTY*/}

                {notifications.length === 0 ? (

                    <div className="notifications-empty">

                        <div className="empty-icon">
                            🔔
                        </div>

                        <h2>
                            No Notifications
                        </h2>

                        <p>
                            You're all caught up.
                            New activity will appear here.
                        </p>

                    </div>

                ) : (

                    <div className="notification-list">

                        {notifications.map(
                            notification => (

                                <div
                                    key={
                                        notification._id
                                    }
                                    className={`notification-card ${
                                        notification.isRead
                                            ? "read"
                                            : "unread"
                                    }`}
                                >

                                    <div className="notification-icon">

                                        {
                                            getIcon(
                                                notification.type
                                            )
                                        }

                                    </div>


                                    <div className="notification-content">

                                        <div className="notification-top">

                                            <h3>
                                                {
                                                    notification.type
                                                }
                                            </h3>

                                            {!notification.isRead && (

                                                <span className="unread-badge">
                                                    NEW
                                                </span>

                                            )}

                                        </div>


                                        <p>
                                            {
                                                notification.message
                                            }
                                        </p>


                                        <span className="notification-date">

                                            {
                                                formatDate(
                                                    notification.createdAt
                                                )
                                            }

                                        </span>


                                        <div className="notification-actions">

                                            {!notification.isRead && (

                                                <button
                                                    onClick={() =>
                                                        markAsRead(
                                                            notification._id
                                                        )
                                                    }
                                                >
                                                    Mark as Read
                                                </button>

                                            )}


                                            <button
                                                className="delete-notification"
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
                        )}

                    </div>

                )}

            </div>

        </div>

    )

}


export default NotificationList