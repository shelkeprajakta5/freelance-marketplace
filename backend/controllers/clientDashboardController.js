const Project = require("../models/Project")
const Proposal = require("../models/Proposal")
const Contract = require("../models/Contract")

// GET CLIENT DASHBOARD STATISTICS

const getClientDashboard = async (req, res) => {

    try {

        const clientId = req.user.id


        // PROJECT STATISTICS

        const totalProjects =
            await Project.countDocuments({
                client: clientId
            })


        const openProjects =
            await Project.countDocuments({
                client: clientId,
                status: "Open"
            })


        const closedProjects =
            await Project.countDocuments({
                client: clientId,
                status: "Closed"
            })


        // GET CLIENT PROJECT IDs

        const projects =
            await Project.find({
                client: clientId
            }).select("_id")


        const projectIds =
            projects.map(
                project => project._id
            )

        // PROPOSALS RECEIVED


        const proposalsReceived =
            await Proposal.countDocuments({
                project: {
                    $in: projectIds
                }
            })


        // ACTIVE CONTRACTS

        const activeContracts =
            await Contract.countDocuments({
                client: clientId,
                status: {
                    $in: [
                        "Active",
                        "In Progress",
                        "Submitted"
                    ]
                }
            })


        // COMPLETED CONTRACTS

        const completedContracts =
            await Contract.countDocuments({
                client: clientId,
                status: "Completed"
            })


        // RESPONSE

        res.status(200).json({

            totalProjects,

            openProjects,

            closedProjects,

            proposalsReceived,

            activeContracts,

            completedContracts

        })


    } catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "Failed to fetch client dashboard statistics",

            error:
                error.message

        })

    }

}


module.exports = {getClientDashboard}