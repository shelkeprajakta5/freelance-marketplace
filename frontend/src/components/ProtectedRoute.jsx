import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function ProtectedRoute({ allowedRoles }) {

    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="loading-screen">
                Loading...
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (
        allowedRoles &&
        !allowedRoles.includes(user.role)
    ) {

        if (user.role === "Admin") {
            return <Navigate to="/admin-dashboard" replace />
        }

        if (user.role === "Client") {
            return <Navigate to="/client-dashboard" replace />
        }

        if (user.role === "Freelancer") {
            return <Navigate to="/freelancer-dashboard" replace />
        }
    }

    return <Outlet />
}

export default ProtectedRoute