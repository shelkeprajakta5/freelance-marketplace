import { createContext, useContext, useEffect, useState} from "react"

import api from "../services/api"


const AuthContext = createContext()


export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user") || "null")
    )

    const [loading, setLoading] = useState(true)


    useEffect(() => {

        const checkUser = async () => {

            const token = localStorage.getItem("token")

            if (!token) {

                setLoading(false)
                return

            }


            try {

                const response = await api.get("/auth/me")

                setUser(response.data.user)

                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                )

            } catch (error) {

                localStorage.removeItem("token")
                localStorage.removeItem("user")

                setUser(null)

            } finally {

                setLoading(false)

            }

        }


        checkUser()

    }, [])



    const login = async (email, password) => {

        const response = await api.post(
            "/auth/login",
            {
                email,
                password
            }
        )


        const {
            token,
            user
        } = response.data


        localStorage.setItem(
            "token",
            token
        )

        localStorage.setItem(
            "user",
            JSON.stringify(user)
        )


        setUser(user)


        return user

    }



    const register = async (
        name,
        email,
        password,
        role
    ) => {

        const response = await api.post(
            "/auth/register",
            {
                name,
                email,
                password,
                role
            }
        )


        return response.data

    }



    const logout = async () => {

        try {

            if (localStorage.getItem("token")) {

                await api.post("/auth/logout")

            }

        } catch (error) {

            console.log(error)

        }


        localStorage.removeItem("token")

        localStorage.removeItem("user")

        setUser(null)

    }



    return (

        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout
            }}
        >

            {children}

        </AuthContext.Provider>

    )

}



export const useAuth = () => {

    return useContext(AuthContext)

}