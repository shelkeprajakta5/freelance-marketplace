const express = require("express")

const router = express.Router()


const { createClientProfile, getMyClientProfile, updateClientProfile, getAllClients, getClientById} = require("../controllers/clientController")


const { protect, authorizeRoles} = require("../middleware/authMiddleware")

// CLIENT'S OWN PROFILE

router.post( "/profile", protect, authorizeRoles("Client"), createClientProfile)


router.get(  "/profile",  protect,  authorizeRoles("Client"),  getMyClientProfile)


router.put( "/profile", protect, authorizeRoles("Client"), updateClientProfile)


// VIEW CLIENTS

router.get( "/", protect, authorizeRoles(  "Admin",  "Client",  "Freelancer"), getAllClients)


// CLIENT DETAILS

router.get( "/:id", protect, authorizeRoles( "Admin", "Client", "Freelancer"), getClientById)


module.exports = router