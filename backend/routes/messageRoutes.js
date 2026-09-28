const express = require("express")

const router = express.Router()


const {createConversation,  getConversations,  getMessages, sendMessage, markMessageRead, markConversationRead} = require("../controllers/messageController")


const { protect, authorizeRoles} = require("../middleware/authMiddleware")


// CREATE CONVERSATION

router.post( "/conversation", protect, authorizeRoles( "Client", "Freelancer"),createConversation)


// GET MY CONVERSATIONS

router.get( "/conversations",protect, authorizeRoles(  "Client", "Freelancer"), getConversations)

// GET MESSAGES

router.get( "/conversation/:conversationId", protect, authorizeRoles( "Client", "Freelancer"), getMessages)


// SEND MESSAGE

router.post("/send", protect, authorizeRoles( "Client", "Freelancer"),sendMessage)

// MARK SINGLE MESSAGE READ

router.put( "/read/:id", protect, authorizeRoles( "Client", "Freelancer"), markMessageRead)


// MARK CONVERSATION READ

router.put( "/conversation/:conversationId/read", protect, authorizeRoles( "Client", "Freelancer"),  markConversationRead)


module.exports = router