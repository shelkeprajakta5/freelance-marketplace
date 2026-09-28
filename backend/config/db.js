const mongoose = require("mongoose")

const connectDb = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDb Connected Successfully")
    } catch (error) {
        console.log("Database Connection Error:",error.message)
        process.exit(1)
    }
} 

module.exports = connectDb

