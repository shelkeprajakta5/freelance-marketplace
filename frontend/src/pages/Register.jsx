import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../css/Register.css"

function Register() {

    const navigate = useNavigate()
    const { register } = useAuth()

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "Client"
    })

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false)


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })

    }


    const handleSubmit = async (e) => {

        e.preventDefault()

        setError("")
        setSuccess("")
        setLoading(true)

        try {

            await register(
                formData.name,
                formData.email,
                formData.password,
                formData.role
            )

            setSuccess(
                "Registration successful! Redirecting to login..."
            )

            setTimeout(() => {
                navigate("/login")
            }, 1500)

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Registration failed"
            )

        } finally {

            setLoading(false)

        }
    }


    return (

        <div className="register-page">

            <div className="register-card">

                <div className="register-header">

                    <div className="register-logo">
                        FM
                    </div>

                    <h1>
                        Create Account
                    </h1>

                    <p>
                        Join the Freelance Marketplace
                    </p>

                </div>


                {error && (
                    <div className="register-error">
                        {error}
                    </div>
                )}


                {success && (
                    <div className="register-success">
                        {success}
                    </div>
                )}


                <form onSubmit={handleSubmit}>

                    <div className="register-form-group">

                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div className="register-form-group">

                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div className="register-form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            minLength="6"
                            required
                        />

                    </div>


                    <div className="register-form-group">

                        <label>
                            I want to join as
                        </label>

                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >

                            <option value="Client">
                                Client
                            </option>

                            <option value="Freelancer">
                                Freelancer
                            </option>

                            <option value="Admin">
                                Admin
                            </option>

                        </select>

                    </div>


                    <button
                        type="submit"
                        className="register-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Account..."
                            : "Create Account"
                        }

                    </button>

                </form>


                <div className="login-link">

                    Already have an account?

                    <button
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Login
                    </button>

                </div>

            </div>

        </div>

    )
}

export default Register