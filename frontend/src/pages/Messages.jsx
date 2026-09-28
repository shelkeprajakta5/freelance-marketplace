import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../css/Messages.css"
import API_URL from "../config"

function Messages() {

    const { user } = useAuth()

    const [searchParams] =
        useSearchParams()


    const [conversations, setConversations] =
        useState([])


    const [clients, setClients] =
        useState([])


    const [selectedConversation, setSelectedConversation] =
        useState(null)


    const [messages, setMessages] =
        useState([])


    const [message, setMessage] =
        useState("")


    const [loading, setLoading] =
        useState(true)


    const [messagesLoading, setMessagesLoading] =
        useState(false)


    const [clientsLoading, setClientsLoading] =
        useState(false)


    const [creatingConversation, setCreatingConversation] =
        useState(false)


    const [showNewConversation, setShowNewConversation] =
        useState(false)


    const [error, setError] =
        useState("")


    const token =
        localStorage.getItem("token")


  
    // LOAD CONVERSATIONS

    useEffect(() => {

        fetchConversations()

    }, [])

    // OPEN CONVERSATION FROM URL

    useEffect(() => {

        const conversationId =
            searchParams.get("conversation")


        if (
            conversationId &&
            conversations.length > 0
        ) {

            const conversation =
                conversations.find(
                    item =>
                        item._id ===
                        conversationId
                )


            if (conversation) {

                selectConversation(
                    conversation
                )

            }

        }

    }, [
        searchParams,
        conversations
    ])


    // FETCH CONVERSATIONS

    const fetchConversations =
        async () => {

            try {

                setLoading(true)

                setError("")


                const response =
                    await fetch(
                        `${API_URL}/messages/conversations`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    )


                const data =
                    await response.json()


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to load conversations"
                    )

                }


                setConversations(
                    data.conversations || []
                )


            } catch (error) {

                setError(
                    error.message
                )

            } finally {

                setLoading(false)

            }

        }
    // FETCH CLIENTS
    // FREELANCER ONLY

    const fetchClients =
        async () => {

            try {

                setClientsLoading(true)

                setError("")


                const response =
                    await fetch(
                        `${API_URL}/clients`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    )


                const data =
                    await response.json()


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to load clients"
                    )

                }


                setClients(
                    data.clients || []
                )


            } catch (error) {

                setError(
                    error.message
                )

            } finally {

                setClientsLoading(false)

            }

        }


    // OPEN NEW CONVERSATION PANEL

    const openNewConversation =
        () => {

            setShowNewConversation(
                true
            )

            fetchClients()

        }

    // CREATE / GET CONVERSATION

    const startConversation =
        async (client) => {

            try {

                setCreatingConversation(
                    true
                )

                setError("")


                const response =
                    await fetch(
                        `${API_URL}/messages/conversation`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`
                            },

                            body: JSON.stringify({

                                userId:
                                    client.user?._id

                            })

                        }
                    )


                const data =
                    await response.json()


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to create conversation"
                    )

                }


                const conversation =
                    data.conversation


                setShowNewConversation(
                    false
                )


                setConversations(
                    previous => {

                        const exists =
                            previous.some(
                                item =>
                                    item._id ===
                                    conversation._id
                            )


                        if (exists) {

                            return previous

                        }


                        return [
                            conversation,
                            ...previous
                        ]

                    }
                )


                await selectConversation(
                    conversation
                )


            } catch (error) {

                setError(
                    error.message
                )

            } finally {

                setCreatingConversation(
                    false
                )

            }

        }


    // SELECT CONVERSATION

    const selectConversation =
        async (conversation) => {

            setSelectedConversation(
                conversation
            )


            setMessagesLoading(
                true
            )


            setError("")


            try {

                const response =
                    await fetch(
                        `${API_URL}/messages/conversation/${conversation._id}`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    )


                const data =
                    await response.json()


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to load messages"
                    )

                }


                setMessages(
                    data.messages || []
                )


                await fetch(
                    `${API_URL}/messages/conversation/${conversation._id}/read`,
                    {
                        method: "PUT",

                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                )


            } catch (error) {

                setError(
                    error.message
                )

            } finally {

                setMessagesLoading(
                    false
                )

            }

        }


    // SEND MESSAGE


    const sendMessage =
        async (e) => {

            e.preventDefault()


            if (
                !message.trim() ||
                !selectedConversation
            ) {

                return

            }


            try {

                setError("")


                const response =
                    await fetch(
                        `${API_URL}/messages/send`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`
                            },

                            body: JSON.stringify({

                                conversation:
                                    selectedConversation._id,

                                message:
                                    message.trim()

                            })

                        }
                    )


                const data =
                    await response.json()


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to send message"
                    )

                }


                setMessages(
                    previous => [
                        ...previous,
                        data.data
                    ]
                )


                setMessage("")


                fetchConversations()


            } catch (error) {

                setError(
                    error.message
                )

            }

        }


    // GET OTHER USER

    const getOtherUser =
        (conversation) => {

            if (
                user?.role ===
                "Client"
            ) {

                return conversation.freelancer

            }


            return conversation.client

        }

    // LOADING


    if (loading) {

        return (

            <div className="messages-page">

                <div className="messages-loading">

                    Loading conversations...

                </div>

            </div>

        )

    }


    // UI=

    return (

        <div className="messages-page">


            <div className="messages-container">


                {/* HEADER */}

                <div className="messages-header">

                    <div>

                        <p className="messages-label">
                            COMMUNICATION
                        </p>

                        <h1>
                            Messages
                        </h1>

                        <p>
                            Communicate with your clients
                            and freelancers.
                        </p>

                    </div>


                    {/* NEW MESSAGE BUTTON */}

                    {user?.role === "Freelancer" && (

                        <button
                            className="new-message-btn"
                            onClick={
                                openNewConversation
                            }
                        >
                            + New Message
                        </button>

                    )}

                </div>


                {/*  ERROR*/}

                {error && (

                    <div className="messages-error">

                        {error}

                    </div>

                )}


                {/*  NEW CONVERSATION PANEL*/}

                {showNewConversation && (

                    <div className="new-conversation-panel">


                        <div className="new-conversation-header">

                            <div>

                                <h2>
                                    Start New Conversation
                                </h2>

                                <p>
                                    Select a client to start
                                    messaging.
                                </p>

                            </div>


                            <button
                                className="close-conversation-btn"
                                onClick={() =>
                                    setShowNewConversation(
                                        false
                                    )
                                }
                            >
                                ×
                            </button>

                        </div>


                        {clientsLoading ? (

                            <div className="clients-loading">

                                Loading clients...

                            </div>

                        ) : clients.length === 0 ? (

                            <div className="no-clients">

                                No clients available.

                            </div>

                        ) : (

                            <div className="clients-list">

                                {clients.map(
                                    client => (

                                        <button
                                            key={
                                                client._id
                                            }
                                            className="client-select-item"
                                            onClick={() =>
                                                startConversation(
                                                    client
                                                )
                                            }
                                            disabled={
                                                creatingConversation
                                            }
                                        >

                                            <div className="client-select-avatar">

                                                {client.user?.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase() ||
                                                    "C"}

                                            </div>


                                            <div className="client-select-info">

                                                <strong>

                                                    {client.user?.name ||
                                                        "Client"}

                                                </strong>

                                                <span>

                                                    {client.user?.email ||
                                                        ""}

                                                </span>

                                            </div>


                                            <span className="start-chat-text">

                                                {creatingConversation
                                                    ? "Opening..."
                                                    : "Message →"}

                                            </span>

                                        </button>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                )}


                {/*MESSAGES LAYOUT*/}

                <div className="messages-layout">


                    {/*  CONVERSATIONS*/}

                    <div className="conversation-panel">


                        <div className="conversation-title">

                            <h2>
                                Conversations
                            </h2>

                        </div>


                        {conversations.length === 0 ? (

                            <div className="empty-conversations">

                                <div>
                                    💬
                                </div>

                                <p>
                                    No conversations yet.
                                </p>

                                {user?.role === "Freelancer" && (

                                    <button
                                        onClick={
                                            openNewConversation
                                        }
                                    >
                                        Start a Conversation
                                    </button>

                                )}

                            </div>

                        ) : (

                            conversations.map(
                                conversation => {

                                    const otherUser =
                                        getOtherUser(
                                            conversation
                                        )


                                    return (

                                        <button
                                            key={
                                                conversation._id
                                            }
                                            className={
                                                `conversation-item ${
                                                    selectedConversation?._id ===
                                                    conversation._id
                                                        ? "active"
                                                        : ""
                                                }`
                                            }
                                            onClick={() =>
                                                selectConversation(
                                                    conversation
                                                )
                                            }
                                        >

                                            <div className="conversation-avatar">

                                                {otherUser?.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase() ||
                                                    "U"}

                                            </div>


                                            <div className="conversation-info">

                                                <strong>

                                                    {otherUser?.name ||
                                                        "User"}

                                                </strong>

                                                <span>

                                                    {otherUser?.role ||
                                                        ""}

                                                </span>

                                            </div>

                                        </button>

                                    )

                                }
                            )

                        )}

                    </div>


                    {/* CHAT PANEL*/}

                    <div className="chat-panel">


                        {!selectedConversation ? (

                            <div className="no-chat">

                                <div className="no-chat-icon">
                                    💬
                                </div>

                                <h2>
                                    Select a conversation
                                </h2>

                                <p>
                                    Choose a conversation to
                                    start messaging.
                                </p>

                                {user?.role === "Freelancer" && (

                                    <button
                                        className="start-chat-main-btn"
                                        onClick={
                                            openNewConversation
                                        }
                                    >
                                        Start New Conversation
                                    </button>

                                )}

                            </div>

                        ) : (

                            <>


                                {/* CHAT HEADER */}

                                <div className="chat-header">

                                    <div className="chat-user-avatar">

                                        {
                                            getOtherUser(
                                                selectedConversation
                                            )?.name
                                                ?.charAt(0)
                                                ?.toUpperCase() ||
                                            "U"
                                        }

                                    </div>


                                    <div>

                                        <h2>

                                            {
                                                getOtherUser(
                                                    selectedConversation
                                                )?.name ||
                                                "User"
                                            }

                                        </h2>

                                        <span>

                                            {
                                                getOtherUser(
                                                    selectedConversation
                                                )?.role ||
                                                ""
                                            }

                                        </span>

                                    </div>

                                </div>


                                {/* CHAT MESSAGES */}

                                <div className="chat-messages">


                                    {messagesLoading ? (

                                        <div className="chat-loading">

                                            Loading messages...

                                        </div>

                                    ) : messages.length === 0 ? (

                                        <div className="chat-empty">

                                            <p>
                                                No messages yet.
                                            </p>

                                            <span>
                                                Send the first message.
                                            </span>

                                        </div>

                                    ) : (

                                        messages.map(
                                            item => {

                                                const isMine =
                                                    item.sender?._id ===
                                                        user?._id ||
                                                    item.sender?._id ===
                                                        user?.id


                                                return (

                                                    <div
                                                        key={
                                                            item._id
                                                        }
                                                        className={
                                                            `message-row ${
                                                                isMine
                                                                    ? "mine"
                                                                    : "received"
                                                            }`
                                                        }
                                                    >

                                                        <div className="message-bubble">


                                                            {item.message && (

                                                                <p>

                                                                    {
                                                                        item.message
                                                                    }

                                                                </p>

                                                            )}


                                                            {item.attachment && (

                                                                <a
                                                                    href={
                                                                        item.attachment
                                                                    }
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                >
                                                                    View Attachment
                                                                </a>

                                                            )}


                                                            <small>

                                                                {
                                                                    new Date(
                                                                        item.createdAt
                                                                    ).toLocaleTimeString(
                                                                        [],
                                                                        {
                                                                            hour:
                                                                                "2-digit",

                                                                            minute:
                                                                                "2-digit"
                                                                        }
                                                                    )
                                                                }

                                                            </small>


                                                        </div>

                                                    </div>

                                                )

                                            }
                                        )

                                    )}

                                </div>


                                {/* MESSAGE FORM */}

                                <form
                                    className="message-form"
                                    onSubmit={
                                        sendMessage
                                    }
                                >

                                    <input
                                        type="text"
                                        value={
                                            message
                                        }
                                        onChange={
                                            e =>
                                                setMessage(
                                                    e.target.value
                                                )
                                        }
                                        placeholder="Type your message..."
                                    />


                                    <button
                                        type="submit"
                                        disabled={
                                            !message.trim()
                                        }
                                    >
                                        Send
                                    </button>

                                </form>


                            </>

                        )}

                    </div>

                </div>

            </div>

        </div>

    )

}


export default Messages