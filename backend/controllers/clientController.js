const Client = require("../models/Client")
const User = require("../models/User")

// CREATE CLIENT PROFILE

const createClientProfile = async (req, res) => {

    try {

        const existingClient = await Client.findOne({
            user: req.user.id
        })

        if (existingClient) {

            return res.status(400).json({
                message: "Client profile already exists"
            })

        }


        const {
            companyName,
            about,
            contactInformation
        } = req.body


        if (
            !companyName ||
            !about ||
            !contactInformation
        ) {

            return res.status(400).json({
                message: "All fields are required"
            })

        }


        const client = await Client.create({

            user: req.user.id,

            companyName,

            about,

            contactInformation

        })


        res.status(201).json({

            message: "Client profile created successfully",

            client

        })


    } catch (error) {

        res.status(500).json({
            message: error.message
        })

    }

}

// GET MY CLIENT PROFILE

const getMyClientProfile = async (req, res) => {

    try {

        const client = await Client.findOne({
            user: req.user.id
        }).populate(
            "user",
            "name email role"
        )


        if (!client) {

            return res.status(404).json({
                message: "Client profile not found"
            })

        }


        res.status(200).json({

            client

        })


    } catch (error) {

        res.status(500).json({
            message: error.message
        })

    }

}

// UPDATE CLIENT PROFILE

const updateClientProfile = async (req, res) => {

    try {

        const client = await Client.findOne({
            user: req.user.id
        })


        if (!client) {

            return res.status(404).json({
                message: "Client profile not found"
            })

        }


        const {
            companyName,
            about,
            contactInformation
        } = req.body


        client.companyName =
            companyName ?? client.companyName

        client.about =
            about ?? client.about

        client.contactInformation =
            contactInformation ??
            client.contactInformation


        await client.save()


        const updatedClient =
            await Client.findById(client._id)
                .populate(
                    "user",
                    "name email role"
                )


        res.status(200).json({

            message: "Client profile updated successfully",

            client: updatedClient

        })


    } catch (error) {

        res.status(500).json({
            message: error.message
        })

    }

}

// GET ALL CLIENTS


const getAllClients = async (req, res) => {

    try {

        const clients =
            await Client.find()
                .populate(
                    "user",
                    "name email role"
                )
                .sort({
                    createdAt: -1
                })


        res.status(200).json({

            count: clients.length,

            clients

        })


    } catch (error) {

        res.status(500).json({
            message: error.message
        })

    }

}

// GET CLIENT BY ID

const getClientById = async (req, res) => {

    try {

        const client =
            await Client.findById(
                req.params.id
            ).populate(
                "user",
                "name email role"
            )


        if (!client) {

            return res.status(404).json({
                message: "Client not found"
            })

        }


        res.status(200).json({

            client

        })


    } catch (error) {

        res.status(500).json({
            message: error.message
        })

    }

}



module.exports = {createClientProfile,getMyClientProfile,updateClientProfile,getAllClients,getClientById}