import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import API_URL from "../config"

function NotificationBell() {

    const navigate =
        useNavigate()


    const [unreadCount, setUnreadCount] =
        useState(0)


    const token =
        localStorage.getItem("token")


    const fetchUnreadCount =
        async () => {

            try {

                const response =
                    await axios.get(

                        `${API_URL}/notifications/unread-count`,

                        {

                            headers: {

                                Authorization:
                                    `Bearer ${token}`

                            }

                        }

                    )


                setUnreadCount(

                    response.data.unreadCount ||
                    0

                )

            } catch (error) {

                console.error(
                    "Notification count error:",
                    error
                )

            }

        }


    useEffect(() => {

        if (!token) {
            return
        }


        fetchUnreadCount()


        const interval =
            setInterval(
                fetchUnreadCount,
                30000
            )


        return () =>
            clearInterval(interval)

    }, [])


    return (

        <button
            className="notification-bell"
            onClick={() =>
                navigate("/notifications")
            }
            title="Notifications"
        >

            <span className="bell-icon">
                🔔
            </span>


            {unreadCount > 0 && (

                <span className="notification-count">

                    {
                        unreadCount > 99
                            ? "99+"
                            : unreadCount
                    }

                </span>

            )}

        </button>

    )

}


export default NotificationBell