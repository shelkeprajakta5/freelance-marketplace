const express = require("express")

const router = express.Router()

const {  createFreelancerProfile,  getMyFreelancerProfile,  updateFreelancerProfile,  getAllFreelancers,  getFreelancerById
} = require("../controllers/freelancerController")

const {protect,authorizeRoles} = require("../middleware/authMiddleware")


   // CREATE FREELANCER PROFILE

   // Freelancer only


router.post("/profile",protect,authorizeRoles("Freelancer"),createFreelancerProfile)

//GET MY FREELANCER PROFILE

    //Freelancer only


router.get(  "/profile",  protect,  authorizeRoles("Freelancer"),  getMyFreelancerProfile)


//UPDATE MY FREELANCER PROFILE
//  Freelancer only


router.put("/profile", protect, authorizeRoles("Freelancer"), updateFreelancerProfile)


    //GET ALL FREELANCERS

   // Admin / Client / Freelancer


router.get( "/", protect, authorizeRoles( "Admin", "Client", "Freelancer"), getAllFreelancers)



   // GET FREELANCER BY ID

   // Admin / Client / Freelancer


router.get( "/:id", protect, authorizeRoles( "Admin", "Client", "Freelancer"), getFreelancerById)


module.exports = router