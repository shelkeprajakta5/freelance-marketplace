const express = require("express")

const router = express.Router()


const { createContract, getAllContracts, getContractById, getClientContracts,
 getFreelancerContracts,startWork, submitWork, updateContractStatus, cancelContract} =
    require("../controllers/contractController")


const {protect,authorizeRoles} = require( "../middleware/authMiddleware")

// CREATE CONTRACT
// CLIENT + ADMIN

router.post( "/add", protect, authorizeRoles(  "Admin",  "Client"), createContract)

// GET ALL CONTRACTS
// ADMIN

router.get( "/", protect, authorizeRoles("Admin"),getAllContracts)


// GET CLIENT CONTRACT

router.get( "/client/:clientId", protect, authorizeRoles( "Client"), getClientContracts)


// GET FREELANCER CONTRACTS

router.get( "/freelancer/:freelancerId", protect, authorizeRoles( "Freelancer"), getFreelancerContracts)


// START WORK
// FREELANCER

router.put( "/:id/start", protect, authorizeRoles( "Freelancer"), startWork)


// SUBMIT WORK
// FREELANCER

router.put( "/:id/submit", protect, authorizeRoles( "Freelancer"),submitWork)


// UPDATE CONTRACT STATUS
// CLIENT + FREELANCER

router.put( "/:id/status", protect, authorizeRoles( "Client","Freelancer"), updateContractStatus)

// CANCEL CONTRACT
// CLIENT + FREELANCER

router.put(  "/:id/cancel",  protect,  authorizeRoles(  "Client",  "Freelancer"),cancelContract)


// GET CONTRACT BY ID

router.get( "/:id",  protect,  authorizeRoles( "Admin", "Client", "Freelancer"), getContractById)


module.exports = router