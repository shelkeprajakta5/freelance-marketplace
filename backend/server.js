const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")
const path = require("path")


dotenv.config()


const app = express()

// MIDDLEWARE

app.use( cors())


app.use( express.json())


app.use(
    express.urlencoded({
         extended: true
        })
    )

// STATIC UPLOADS

app.use( "/uploads", express.static( path.join(__dirname,"uploads")))


// DATABASE

mongoose

    .connect(
        process.env.MONGO_URI
    )

    .then(() => {

        console.log(
            "MongoDb Connected Successfully"
        )

    })

    .catch((error) => {

        console.log(
            "MongoDb Connection Failed"
        )

        console.log(
            error.message
        )

    })


// ROUTES

const authRoutes =require("./routes/authRoutes")


const profileRoutes = require("./routes/profileRoutes")


const freelancerRoutes = require("./routes/freelancerRoutes")


const clientRoutes = require("./routes/clientRoutes")


const categoryRoutes = require("./routes/categoryRoutes")


const projectRoutes = require("./routes/projectRoutes")


const proposalRoutes =  require("./routes/proposalRoutes")


const contractRoutes = require("./routes/contractRoutes")


const uploadRoutes = require("./routes/uploadRoutes")


const messageRoutes = require("./routes/messageRoutes")


const reviewRoutes = require("./routes/reviewRoutes")


const notificationRoutes = require("./routes/notificationRoutes")


const freelancerDashboardRoutes = require("./routes/freelancerDashboardRoutes")


const clientDashboardRoutes = require("./routes/clientDashboardRoutes")


const adminRoutes = require("./routes/adminRoutes")


const analyticsRoutes = require("./routes/analyticsRoutes")

// AUTH==

app.use( "/api/auth",authRoutes)


// PROFILE
app.use( "/api/profile", profileRoutes)


// FREELANCERS

app.use( "/api/freelancers", freelancerRoutes)


// CLIENTS

app.use( "/api/clients",  clientRoutes)


// CATEGORIES

app.use( "/api/categories",categoryRoutes)

// PROJECTS

app.use( "/api/projects", projectRoutes)


// PROPOSALS

app.use("/api/proposals",proposalRoutes)


// CONTRACTS

app.use( "/api/contracts", contractRoutes)


// UPLOADS

app.use("/api/uploads",uploadRoutes)


// MESSAGES

app.use( "/api/messages", messageRoutes)


// REVIEWS

app.use( "/api/reviews", reviewRoutes)


// NOTIFICATIONS

app.use("/api/notifications",notificationRoutes)


// FREELANCER DASHBOARD

app.use( "/api/freelancer-dashboard", freelancerDashboardRoutes)



// CLIENT DASHBOARD

app.use( "/api/client-dashboard", clientDashboardRoutes)


// ADMIN DASHBOARD + MANAGEMENT

app.use( "/api/admin", adminRoutes)


// ANALYTICS

app.use( "/api/analytics",analyticsRoutes)


// TEST ROUTE

app.get(

    "/",

    (req, res) => {

        res.json({

            message:
                "Freelance Marketplace API Running"

        })

    }

)

// SERVER

const PORT =
    process.env.PORT ||
    5000


app.listen(

    PORT,

    () => {

        console.log(

            `Server Running on Port ${PORT}`

        )

    }

)