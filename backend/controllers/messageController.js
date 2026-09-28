const Conversation = require("../models/Conversation")
const Message = require("../models/Message")
const User = require("../models/User")

// CREATE / GET CONVERSATION
// CLIENT + FREELANCER

const createConversation = async (req, res) => {

    try {

        const { userId } = req.body

        if (!userId) {

            return res.status(400).json({
                message: "User ID is required"
            })

        }


        if (userId === req.user.id) {

            return res.status(400).json({
                message: "You cannot create a conversation with yourself"
            })

        }


        const otherUser =
            await User.findById(userId)


        if (!otherUser) {

            return res.status(404).json({
                message: "User not found"
            })

        }


        if (
            otherUser.role !== "Client" &&
            otherUser.role !== "Freelancer"
        ) {

            return res.status(400).json({
                message:
                    "Conversation can only be created between Client and Freelancer"
            })

        }


        let client
        let freelancer


        if (req.user.role === "Client") {

            client = req.user.id
            freelancer = userId

        } else if (req.user.role === "Freelancer") {

            freelancer = req.user.id
            client = userId

        } else {

            return res.status(403).json({
                message:
                    "Only Client and Freelancer can create conversations"
            })

        }


        const existingConversation =
            await Conversation.findOne({
                client,
                freelancer
            })


        if (existingConversation) {

            const conversation =
                await Conversation.findById(
                    existingConversation._id
                )
                    .populate(
                        "client",
                        "name email role"
                    )
                    .populate(
                        "freelancer",
                        "name email role"
                    )


            return res.status(200).json({
                message:
                    "Conversation already exists",
                conversation
            })

        }


        const conversation =
            await Conversation.create({
                client,
                freelancer
            })


        const populatedConversation =
            await Conversation.findById(
                conversation._id
            )
                .populate(
                    "client",
                    "name email role"
                )
                .populate(
                    "freelancer",
                    "name email role"
                )


        res.status(201).json({

            message:
                "Conversation created successfully",

            conversation:
                populatedConversation

        })


    } catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "Failed to create conversation",

            error:
                error.message

        })

    }

}

// GET MY CONVERSATIONS
// CLIENT + FREELANCER
const getConversations = async (req, res) => {

    try {

        let filter = {}


        if (req.user.role === "Client") {

            filter.client =
                req.user.id

        }


        if (req.user.role === "Freelancer") {

            filter.freelancer =
                req.user.id

        }


        const conversations =
            await Conversation.find(filter)

                .populate(
                    "client",
                    "name email role"
                )

                .populate(
                    "freelancer",
                    "name email role"
                )

                .sort({
                    updatedAt: -1
                })


        res.status(200).json({

            count:
                conversations.length,

            conversations

        })


    } catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "Failed to fetch conversations",

            error:
                error.message

        })

    }

}

// GET MESSAGES

const getMessages = async (req, res) => {

    try {

        const { conversationId } =
            req.params


        const conversation =
            await Conversation.findById(
                conversationId
            )


        if (!conversation) {

            return res.status(404).json({
                message: "Conversation not found"
            })

        }


        const isParticipant =
            conversation.client.toString() ===
                req.user.id ||

            conversation.freelancer.toString() ===
                req.user.id


        if (!isParticipant) {

            return res.status(403).json({
                message:
                    "You are not allowed to view this conversation"
            })

        }


        const messages =
            await Message.find({
                conversation: conversationId
            })

                .populate(
                    "sender",
                    "name email role"
                )

                .sort({
                    createdAt: 1
                })


        res.status(200).json({

            count:
                messages.length,

            messages

        })


    } catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "Failed to fetch messages",

            error:
                error.message

        })

    }

}

// SEND MESSAGE

const sendMessage = async (req, res) => {

    try {

        const {
            conversation,
            message,
            attachment
        } = req.body


        if (!conversation) {

            return res.status(400).json({
                message:
                    "Conversation is required"
            })

        }


        if (
            !message &&
            !attachment
        ) {

            return res.status(400).json({
                message:
                    "Message or attachment is required"
            })

        }


        const conversationExists =
            await Conversation.findById(
                conversation
            )


        if (!conversationExists) {

            return res.status(404).json({
                message:
                    "Conversation not found"
            })

        }


        const isParticipant =
            conversationExists.client.toString() ===
                req.user.id ||

            conversationExists.freelancer.toString() ===
                req.user.id


        if (!isParticipant) {

            return res.status(403).json({
                message:
                    "You are not allowed to send messages in this conversation"
            })

        }


        const newMessage =
            await Message.create({

                conversation,

                sender:
                    req.user.id,

                message:
                    message || "",

                attachment:
                    attachment || ""

            })


        await Conversation.findByIdAndUpdate(
            conversation,
            {
                updatedAt: new Date()
            }
        )


        const populatedMessage =
            await Message.findById(
                newMessage._id
            )
                .populate(
                    "sender",
                    "name email role"
                )


        res.status(201).json({

            message:
                "Message sent successfully",

            data:
                populatedMessage

        })


    } catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "Failed to send message",

            error:
                error.message

        })

    }

}


// MARK MESSAGE AS READ

const markMessageRead = async (req, res) => {

    try {

        const { id } =
            req.params


        const message =
            await Message.findById(id)


        if (!message) {

            return res.status(404).json({
                message:
                    "Message not found"
            })

        }


        const conversation =
            await Conversation.findById(
                message.conversation
            )


        if (!conversation) {

            return res.status(404).json({
                message:
                    "Conversation not found"
            })

        }


        const isParticipant =
            conversation.client.toString() ===
                req.user.id ||

            conversation.freelancer.toString() ===
                req.user.id


        if (!isParticipant) {

            return res.status(403).json({
                message:
                    "You are not allowed to update this message"
            })

        }


        message.read = true

        await message.save()


        res.status(200).json({

            message:
                "Message marked as read",

            data:
                message

        })


    } catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "Failed to mark message as read",

            error:
                error.message

        })

    }

}

// MARK ALL CONVERSATION MESSAGES AS READ

const markConversationRead = async (req, res) => {

    try {

        const { conversationId } =
            req.params


        const conversation =
            await Conversation.findById(
                conversationId
            )


        if (!conversation) {

            return res.status(404).json({
                message:
                    "Conversation not found"
            })

        }


        const isParticipant =
            conversation.client.toString() ===
                req.user.id ||

            conversation.freelancer.toString() ===
                req.user.id


        if (!isParticipant) {

            return res.status(403).json({
                message:
                    "You are not allowed to update this conversation"
            })

        }


        await Message.updateMany(

            {
                conversation:
                    conversationId,

                sender: {
                    $ne:
                        req.user.id
                },

                read:
                    false
            },

            {
                $set: {
                    read: true
                }
            }

        )


        res.status(200).json({

            message:
                "Conversation messages marked as read"

        })


    } catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "Failed to mark conversation as read",

            error:
                error.message

        })

    }

}

// EXPORT

module.exports = { createConversation, getConversations, getMessages,  sendMessage,  markMessageRead,  markConversationRead}