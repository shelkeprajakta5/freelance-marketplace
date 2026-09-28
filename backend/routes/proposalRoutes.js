const express = require("express")

const router = express.Router()


const { addProposal, getProposals, getProposalById, updateProposal, deleteProposal, acceptProposal, rejectProposal
} = require("../controllers/proposalController")


const { protect, authorizeRoles} = require("../middleware/authMiddleware")


const upload = require("../middleware/uploadMiddleware")

// GET ALL PROPOSALS

router.get( "/", protect, authorizeRoles("Admin","Client","Freelancer"),  getProposals)


// GET MY PROPOSALS
// FREELANCER ONLY

router.get( "/my", protect, authorizeRoles("Freelancer"), getProposals)


// ADD PROPOSAL
// FREELANCER ONLY

router.post( "/add", protect,authorizeRoles("Freelancer"), upload.array("attachments", 5), addProposal)


// GET PROPOSAL BY ID

router.get( "/:id", protect, authorizeRoles(  "Admin",  "Client","Freelancer"),  getProposalById)


// UPDATE PROPOSAL

router.put( "/:id", protect, authorizeRoles("Freelancer"), upload.array("attachments", 5), updateProposal)


// WITHDRAW PROPOSAL

router.delete( "/:id", protect, authorizeRoles("Freelancer"), deleteProposal)


// ACCEPT PROPOSAL

router.put( "/:id/accept", protect, authorizeRoles("Client"), acceptProposal)


// REJECT PROPOSAL

router.put( "/:id/reject", protect, authorizeRoles("Client"), rejectProposal)


module.exports = router