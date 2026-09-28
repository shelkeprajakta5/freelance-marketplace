import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API_URL from "../config"

import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts"

import "../css/Analytics.css"


function Analytics() {

    const navigate = useNavigate()


    const [data, setData] = useState(null)

    const [loading, setLoading] = useState(true)

    const [error, setError] = useState("")


    // FETCH ANALYTICS


    useEffect(() => {

        const fetchAnalytics = async () => {

            try {

                const token =
                    localStorage.getItem("token")


                const response =
                    await fetch(
                        `${API_URL}/analytics`,
                        {
                            headers: {

                                Authorization:
                                    `Bearer ${token}`

                            }

                        }
                    )


                const result =
                    await response.json()


                if (!response.ok) {

                    throw new Error(

                        result.message ||
                        "Failed to load analytics"

                    )

                }


                setData(result)


            } catch (error) {

                console.log(
                    "Analytics Error:",
                    error.message
                )

                setError(
                    error.message
                )

            } finally {

                setLoading(false)

            }

        }


        fetchAnalytics()

    }, [])

    // LOADING

    if (loading) {

        return (

            <div className="analytics-loading">

                Loading Analytics...

            </div>

        )

    }



    // ERROR

    if (error) {

        return (

            <div className="analytics-error">

                <h2>
                    Failed to Load Analytics
                </h2>

                <p>
                    {error}
                </p>

                <button
                    onClick={() =>
                        navigate("/admin-dashboard")
                    }
                >
                    Back to Dashboard
                </button>

            </div>

        )

    }


    if (!data) {

        return null

    }


    const {

        totals,

        analytics

    } = data

    // COLORS

    const pieColors = [

        "#2563eb",
        "#7c3aed",
        "#f59e0b",
        "#10b981",
        "#ef4444",
        "#ec4899"

    ]


    return (

        <div className="analytics-page">


            {/*  HEADER*/}

            <div className="analytics-header">

                <div>

                    <button
                        className="analytics-back"
                        onClick={() =>
                            navigate("/admin-dashboard")
                        }
                    >
                        ← Dashboard
                    </button>

                    <p className="analytics-label">
                        ADMIN PANEL
                    </p>

                    <h1>
                        Analytics
                    </h1>

                    <p>
                        Monitor marketplace performance
                        and statistics.
                    </p>

                </div>

            </div>


            {/*SUMMARY CARDS*/}

            <section className="analytics-summary">


                <div className="analytics-summary-card">

                    <span>
                        Total Users
                    </span>

                    <h2>
                        {totals.users}
                    </h2>

                </div>


                <div className="analytics-summary-card">

                    <span>
                        Total Projects
                    </span>

                    <h2>
                        {totals.projects}
                    </h2>

                </div>


                <div className="analytics-summary-card">

                    <span>
                        Total Proposals
                    </span>

                    <h2>
                        {totals.proposals}
                    </h2>

                </div>


                <div className="analytics-summary-card">

                    <span>
                        Total Contracts
                    </span>

                    <h2>
                        {totals.contracts}
                    </h2>

                </div>


                <div className="analytics-summary-card">

                    <span>
                        Categories
                    </span>

                    <h2>
                        {totals.categories}
                    </h2>

                </div>


            </section>


            {/*  CHART GRID */}

            <section className="analytics-grid">


                {/* USERS BY ROLE */}

                <div className="analytics-card">

                    <div className="analytics-card-header">

                        <h2>
                            Users by Role
                        </h2>

                        <p>
                            Distribution of marketplace users
                        </p>

                    </div>


                    <div className="chart-container">

                        <ResponsiveContainer
                            width="100%"
                            height={320}
                        >

                            <PieChart>

                                <Pie
                                    data={
                                        analytics.usersByRole
                                    }
                                    dataKey="count"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={110}
                                    label
                                >

                                    {
                                        analytics.usersByRole.map(
                                            (entry, index) => (

                                                <Cell
                                                    key={
                                                        `user-${index}`
                                                    }
                                                    fill={
                                                        pieColors[
                                                            index %
                                                            pieColors.length
                                                        ]
                                                    }
                                                />

                                            )
                                        )
                                    }

                                </Pie>

                                <Tooltip />

                                <Legend />

                            </PieChart>

                        </ResponsiveContainer>

                    </div>

                </div>


                {/*  PROJECTS BY CATEGORY*/}

                <div className="analytics-card">

                    <div className="analytics-card-header">

                        <h2>
                            Projects by Category
                        </h2>

                        <p>
                            Number of projects in each category
                        </p>

                    </div>


                    <div className="chart-container">

                        <ResponsiveContainer
                            width="100%"
                            height={320}
                        >

                            <BarChart
                                data={
                                    analytics.projectsByCategory
                                }
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    dataKey="name"
                                />

                                <YAxis />

                                <Tooltip />

                                <Legend />

                                <Bar
                                    dataKey="count"
                                    name="Projects"
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </div>


                {/*  PROJECTS BY STATUS*/}

                <div className="analytics-card">

                    <div className="analytics-card-header">

                        <h2>
                            Projects by Status
                        </h2>

                        <p>
                            Current project status distribution
                        </p>

                    </div>


                    <div className="chart-container">

                        <ResponsiveContainer
                            width="100%"
                            height={320}
                        >

                            <BarChart
                                data={
                                    analytics.projectsByStatus
                                }
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    dataKey="name"
                                />

                                <YAxis />

                                <Tooltip />

                                <Legend />

                                <Bar
                                    dataKey="count"
                                    name="Projects"
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </div>


                {/*  PROPOSALS BY STATUS*/}

                <div className="analytics-card">

                    <div className="analytics-card-header">

                        <h2>
                            Proposals by Status
                        </h2>

                        <p>
                            Proposal status distribution
                        </p>

                    </div>


                    <div className="chart-container">

                        <ResponsiveContainer
                            width="100%"
                            height={320}
                        >

                            <PieChart>

                                <Pie
                                    data={
                                        analytics.proposalsByStatus
                                    }
                                    dataKey="count"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={110}
                                    label
                                >

                                    {
                                        analytics.proposalsByStatus.map(
                                            (entry, index) => (

                                                <Cell
                                                    key={
                                                        `proposal-${index}`
                                                    }
                                                    fill={
                                                        pieColors[
                                                            index %
                                                            pieColors.length
                                                        ]
                                                    }
                                                />

                                            )
                                        )
                                    }

                                </Pie>

                                <Tooltip />

                                <Legend />

                            </PieChart>

                        </ResponsiveContainer>

                    </div>

                </div>


                {/*  CONTRACTS BY STATUS */}

                <div className="analytics-card">

                    <div className="analytics-card-header">

                        <h2>
                            Contracts by Status
                        </h2>

                        <p>
                            Contract workflow distribution
                        </p>

                    </div>


                    <div className="chart-container">

                        <ResponsiveContainer
                            width="100%"
                            height={320}
                        >

                            <BarChart
                                data={
                                    analytics.contractsByStatus
                                }
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    dataKey="name"
                                />

                                <YAxis />

                                <Tooltip />

                                <Legend />

                                <Bar
                                    dataKey="count"
                                    name="Contracts"
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </div>


                {/* MONTHLY PROJECTS*/}

                <div className="analytics-card">

                    <div className="analytics-card-header">

                        <h2>
                            Monthly Projects
                        </h2>

                        <p>
                            Projects created over time
                        </p>

                    </div>


                    <div className="chart-container">

                        <ResponsiveContainer
                            width="100%"
                            height={320}
                        >

                            <LineChart
                                data={
                                    analytics.monthlyProjects
                                }
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    dataKey="month"
                                />

                                <YAxis />

                                <Tooltip />

                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    name="Projects"
                                    strokeWidth={3}
                                />

                            </LineChart>

                        </ResponsiveContainer>

                    </div>

                </div>


                {/*  MONTHLY USERS*/}

                <div className="analytics-card analytics-full">

                    <div className="analytics-card-header">

                        <h2>
                            Monthly Users
                        </h2>

                        <p>
                            New users registered over time
                        </p>

                    </div>


                    <div className="chart-container">

                        <ResponsiveContainer
                            width="100%"
                            height={320}
                        >

                            <LineChart
                                data={
                                    analytics.monthlyUsers
                                }
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    dataKey="month"
                                />

                                <YAxis />

                                <Tooltip />

                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    name="Users"
                                    strokeWidth={3}
                                />

                            </LineChart>

                        </ResponsiveContainer>

                    </div>

                </div>


            </section>


        </div>

    )

}


export default Analytics