import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../css/Login.css"

function Login() {

    const navigate = useNavigate()
    const { login } = useAuth()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {

        e.preventDefault()

        setError("")
        setLoading(true)

        try {

            const user = await login(email, password)

            if (user.role === "Admin") {
                navigate("/admin-dashboard")
            }

            else if (user.role === "Client") {
                navigate("/client-dashboard")
            }

            else if (user.role === "Freelancer") {
                navigate("/freelancer-dashboard")
            }

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Login failed"
            )

        } finally {

            setLoading(false)

        }
    }

    return (

        <div className="login-page">

            <div className="login-left">

                <div className="brand-content">

                    <div className="brand-logo">
                        FM
                    </div>

                    <h1>
                        Freelance Marketplace
                    </h1>

                    <p>
                        Connect with talented freelancers
                        and build amazing projects.
                    </p>

                    <div className="brand-features">

                        <div>
                            <span>✓</span>
                            Find skilled freelancers
                        </div>

                        <div>
                            <span>✓</span>
                            Work on exciting projects
                        </div>

                        <div>
                            <span>✓</span>
                            Grow your career
                        </div>

                    </div>

                </div>

            </div>


            <div className="login-right">

                <div className="login-card">

                    <h2>
                        Welcome Back
                    </h2>

                    <p className="login-subtitle">
                        Login to your account
                    </p>


                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}


                    <form onSubmit={handleSubmit}>

                        <div className="form-group">

                            <label>
                                Email Address
                            </label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />

                        </div>


                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Logging in..."
                                : "Login"
                            }

                        </button>

                    </form>


                    <div className="register-link">

                        Don't have an account?

                        <button
                            onClick={() =>
                                navigate("/register")
                            }
                        >
                            Create Account
                        </button>

                    </div>

                </div>

            </div>

        </div>

    )
}

export default Login