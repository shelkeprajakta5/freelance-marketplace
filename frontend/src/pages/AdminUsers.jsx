import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../css/AdminUser.css"
import API_URL from "../config"

function AdminUsers() {

    const navigate = useNavigate()

    const { user } = useAuth()

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [search, setSearch] = useState("")
    const [roleFilter, setRoleFilter] = useState("All")


    // FETCH USERS

    const fetchUsers = async () => {

        try {

            setLoading(true)
            setError("")

            const token =
                localStorage.getItem("token")


            const response = await fetch(
                `${API_URL}/admin/users`,
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
                    "Failed to load users"
                )

            }


            setUsers(
                data.users || []
            )


        } catch (error) {

            setError(
                error.message
            )

        } finally {

            setLoading(false)

        }

    }


    useEffect(() => {

        if (user?.role === "Admin") {

            fetchUsers()

        }

    }, [user])


  
    // BLOCK / UNBLOCK USER

    const handleBlock = async (
        id,
        isBlocked
    ) => {

        const action =
            isBlocked
                ? "unblock"
                : "block"


        const confirmed =
            window.confirm(
                `Are you sure you want to ${action} this user?`
            )


        if (!confirmed) {

            return

        }


        try {

            const token =
                localStorage.getItem("token")


            const response = await fetch(
                `${API_URL}/admin/users/${id}/block`,
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
                    `Failed to ${action} user`
                )

            }


            alert(
                data.message
            )


            fetchUsers()


        } catch (error) {

            alert(
                error.message
            )

        }

    }


    // DELETE USER

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to permanently delete this user?"
            )


        if (!confirmed) {

            return

        }


        try {

            const token =
                localStorage.getItem("token")


            const response = await fetch(
                `${API_URL}/admin/users/${id}`,
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
                    "Failed to delete user"
                )

            }


            alert(
                "User deleted successfully"
            )


            fetchUsers()


        } catch (error) {

            alert(
                error.message
            )

        }

    }


    // FILTER USERS

    const filteredUsers =
        users.filter((item) => {

            const searchText =
                search
                    .toLowerCase()
                    .trim()


            const matchesSearch =
                item.name
                    ?.toLowerCase()
                    .includes(searchText) ||

                item.email
                    ?.toLowerCase()
                    .includes(searchText)


            const matchesRole =
                roleFilter === "All" ||
                item.role === roleFilter


            return (
                matchesSearch &&
                matchesRole
            )

        })

    // LOADING

    if (loading) {

        return (

            <div className="admin-user-page">

                <div className="admin-user-loading">

                    Loading users...

                </div>

            </div>

        )

    }

    // PAGE

    return (

        <div className="admin-user-page">


            {/* HEADER */}

            <div className="admin-user-header">

                <div>

                    <p className="admin-user-label">
                        ADMIN MANAGEMENT
                    </p>


                    <h1>
                        User Management
                    </h1>


                    <p>
                        Manage all users in the
                        freelance marketplace.
                    </p>

                </div>


                <button
                    className="admin-back-btn"
                    onClick={() =>
                        navigate(
                            "/admin-dashboard"
                        )
                    }
                >

                    ← Dashboard

                </button>

            </div>


            {/* ERROR */}

            {error && (

                <div className="admin-user-error">

                    {error}

                </div>

            )}


            {/* FILTERS */}

            <div className="admin-user-filters">

                <div className="admin-search-box">

                    <span>
                        🔍
                    </span>


                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                </div>


                <select
                    value={roleFilter}
                    onChange={(event) =>
                        setRoleFilter(
                            event.target.value
                        )
                    }
                >

                    <option value="All">
                        All Roles
                    </option>


                    <option value="Admin">
                        Admin
                    </option>


                    <option value="Client">
                        Client
                    </option>


                    <option value="Freelancer">
                        Freelancer
                    </option>

                </select>

            </div>


            {/* SUMMARY */}

            <div className="admin-user-summary">

                <div>

                    <strong>
                        {filteredUsers.length}
                    </strong>

                    <span>
                        Users Found
                    </span>

                </div>


                <div>

                    <strong>
                        {
                            users.filter(
                                item =>
                                    item.role ===
                                    "Client"
                            ).length
                        }
                    </strong>

                    <span>
                        Clients
                    </span>

                </div>


                <div>

                    <strong>
                        {
                            users.filter(
                                item =>
                                    item.role ===
                                    "Freelancer"
                            ).length
                        }
                    </strong>

                    <span>
                        Freelancers
                    </span>

                </div>


                <div>

                    <strong>
                        {
                            users.filter(
                                item =>
                                    item.isBlocked
                            ).length
                        }
                    </strong>

                    <span>
                        Blocked
                    </span>

                </div>

            </div>


            {/* EMPTY */}

            {filteredUsers.length === 0 && (

                <div className="admin-user-empty">

                    <div>
                        👥
                    </div>


                    <h2>
                        No Users Found
                    </h2>


                    <p>
                        No users match the
                        current search or filter.
                    </p>

                </div>

            )}


            {/* TABLE */}

            {filteredUsers.length > 0 && (

                <div className="admin-user-table-wrapper">

                    <table className="admin-user-table">

                        <thead>

                            <tr>

                                <th>
                                    User
                                </th>

                                <th>
                                    Email
                                </th>

                                <th>
                                    Role
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Joined
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredUsers.map(
                                (item) => (

                                    <tr
                                        key={item._id}
                                    >

                                        <td>

                                            <div className="admin-user-info">

                                                <div className="admin-user-avatar">

                                                    {
                                                        item.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase()
                                                    }

                                                </div>


                                                <div>

                                                    <strong>
                                                        {item.name}
                                                    </strong>


                                                    {item._id ===
                                                        user?._id && (

                                                        <small>
                                                            You
                                                        </small>

                                                    )}

                                                </div>

                                            </div>

                                        </td>


                                        <td>
                                            {item.email}
                                        </td>


                                        <td>

                                            <span
                                                className={
                                                    `admin-role ${item.role.toLowerCase()}`
                                                }
                                            >

                                                {item.role}

                                            </span>

                                        </td>


                                        <td>

                                            <span
                                                className={
                                                    item.isBlocked
                                                        ? "admin-status blocked"
                                                        : "admin-status active"
                                                }
                                            >

                                                {
                                                    item.isBlocked
                                                        ? "Blocked"
                                                        : "Active"
                                                }

                                            </span>

                                        </td>


                                        <td>

                                            {
                                                item.createdAt
                                                    ? new Date(
                                                        item.createdAt
                                                    ).toLocaleDateString()
                                                    : "N/A"
                                            }

                                        </td>


                                        <td>

                                            <div className="admin-user-actions">


                                                {/* EDIT */}

                                                <button
                                                    className="admin-edit-btn"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/users/${item._id}`
                                                        )
                                                    }
                                                >

                                                    Edit

                                                </button>


                                                {/* BLOCK / UNBLOCK */}

                                                {item.role !==
                                                    "Admin" && (

                                                    <>

                                                        <button
                                                            className={
                                                                item.isBlocked
                                                                    ? "admin-unblock-btn"
                                                                    : "admin-block-btn"
                                                            }
                                                            onClick={() =>
                                                                handleBlock(
                                                                    item._id,
                                                                    item.isBlocked
                                                                )
                                                            }
                                                        >

                                                            {
                                                                item.isBlocked
                                                                    ? "Unblock"
                                                                    : "Block"
                                                            }

                                                        </button>


                                                        {/* DELETE */}

                                                        <button
                                                            className="admin-delete-btn"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    item._id
                                                                )
                                                            }
                                                        >

                                                            Delete

                                                        </button>

                                                    </>

                                                )}

                                            </div>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>

            )}

        </div>

    )

}


export default AdminUsers