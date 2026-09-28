const Contract = require("../models/Contract")
const Proposal = require("../models/Proposal")
const Project = require("../models/Project")
const Notification = require("../models/Notification")


// CREATE CONTRACT
// CLIENT + ADMIN

const createContract = async (req, res) => {

    try {

        const {
            project,
            proposal,
            client,
            freelancer,
            agreedAmount,
            deliveryTime
        } = req.body


        if (
            !project ||
            !proposal ||
            !client ||
            !freelancer ||
            agreedAmount === undefined ||
            !deliveryTime
        ) {

            return res.status(400).json({

                message:
                    "All fields are required"

            })

        }


        const existingProposal =
            await Proposal.findById(proposal)


        if (!existingProposal) {

            return res.status(404).json({

                message:
                    "Proposal not found"

            })

        }


        if (
            existingProposal.status !==
            "Accepted"
        ) {

            return res.status(400).json({

                message:
                    "Contract can only be created for an accepted proposal"

            })

        }


        const existingProject =
            await Project.findById(project)


        if (!existingProject) {

            return res.status(404).json({

                message:
                    "Project not found"

            })

        }


        const existingContract =
            await Contract.findOne({

                proposal:
                    proposal

            })


        if (existingContract) {

            return res.status(400).json({

                message:
                    "Contract already exists for this proposal",

                contract:
                    existingContract

            })

        }


        const contract =
            await Contract.create({

                project:
                    project,

                proposal:
                    proposal,

                client:
                    client,

                freelancer:
                    freelancer,

                agreedAmount:
                    agreedAmount,

                deliveryTime:
                    deliveryTime,

                status:
                    "Active"

            })


        existingProject.status =
            "In Progress"

        await existingProject.save()

        // NOTIFY FREELANCER
   

        await Notification.create({

            user:
                freelancer,

            type:
                "Proposal Accepted",

            message:
                "Your proposal has been accepted and a new contract has been created.",

            referenceId:
                contract._id

        })


        const populatedContract =
            await Contract.findById(
                contract._id
            )

                .populate(
                    "project",
                    "title description budget deadline status client"
                )

                .populate(
                    "proposal",
                    "coverLetter bidAmount deliveryTime status"
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
                "Contract created successfully",

            contract:
                populatedContract

        })


    } catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "Error creating contract",

            error:
                error.message

        })

    }

}

// GET ALL CONTRACTS
// ADMIN

const getAllContracts = async (req, res) => {

    try {

        const contracts =
            await Contract.find()

                .populate(
                    "project",
                    "title description budget deadline status"
                )

                .populate(
                    "proposal",
                    "coverLetter bidAmount deliveryTime status"
                )

                .populate(
                    "client",
                    "name email"
                )

                .populate(
                    "freelancer",
                    "name email"
                )

                .sort({

                    createdAt:
                        -1

                })


        res.status(200).json({

            count:
                contracts.length,

            contracts

        })


    } catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "Error fetching contracts",

            error:
                error.message

        })

    }

}


// GET CLIENT CONTRACTS

const getClientContracts = async (req, res) => {

    try {

        const contracts =
            await Contract.find({

                client:
                    req.params.clientId

            })

                .populate(
                    "project",
                    "title description budget deadline status"
                )

                .populate(
                    "proposal",
                    "coverLetter bidAmount deliveryTime status"
                )

                .populate(
                    "freelancer",
                    "name email"
                )

                .populate(
                    "client",
                    "name email"
                )

                .sort({

                    createdAt:
                        -1

                })


        res.status(200).json({

            count:
                contracts.length,

            contracts

        })


    } catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "Error fetching client contracts",

            error:
                error.message

        })

    }

}

// GET FREELANCER CONTRACTS

const getFreelancerContracts = async (req, res) => {

    try {

        const contracts =
            await Contract.find({

                freelancer:
                    req.params.freelancerId

            })

                .populate(
                    "project",
                    "title description budget deadline status"
                )

                .populate(
                    "proposal",
                    "coverLetter bidAmount deliveryTime status"
                )

                .populate(
                    "client",
                    "name email"
                )

                .populate(
                    "freelancer",
                    "name email"
                )

                .sort({

                    createdAt:
                        -1

                })


        res.status(200).json({

            count:
                contracts.length,

            contracts

        })


    } catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "Error fetching freelancer contracts",

            error:
                error.message

        })

    }

}

// GET CONTRACT BY ID

const getContractById = async (req, res) => {

    try {

        const contract =
            await Contract.findById(
                req.params.id
            )

                .populate(
                    "project",
                    "title description budget deadline status"
                )

                .populate(
                    "proposal",
                    "coverLetter bidAmount deliveryTime status"
                )

                .populate(
                    "client",
                    "name email"
                )

                .populate(
                    "freelancer",
                    "name email"
                )


        if (!contract) {

            return res.status(404).json({

                message:
                    "Contract not found"

            })

        }


        res.status(200).json({

            contract

        })


    } catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "Error fetching contract",

            error:
                error.message

        })

    }

}

// START WORK
// FREELANCER

const startWork = async (req, res) => {

    try {

        const contract =
            await Contract.findById(
                req.params.id
            )


        if (!contract) {

            return res.status(404).json({

                message:
                    "Contract not found"

            })

        }


        if (
            contract.status !==
            "Active"
        ) {

            return res.status(400).json({

                message:
                    "Work can only be started on an active contract"

            })

        }


        contract.status =
            "In Progress"


        if (!contract.startDate) {

            contract.startDate =
                new Date()

        }


        await contract.save()


        await Project.findByIdAndUpdate(

            contract.project,

            {

                status:
                    "In Progress"

            }

        )


        // NOTIFY CLIENT

        await Notification.create({

            user:
                contract.client,

            type:
                "General",

            message:
                "The freelancer has started working on your project.",

            referenceId:
                contract._id

        })


        const updatedContract =
            await Contract.findById(
                contract._id
            )

                .populate(
                    "project",
                    "title description budget deadline status"
                )

                .populate(
                    "client",
                    "name email"
                )

                .populate(
                    "freelancer",
                    "name email"
                )


        res.status(200).json({

            message:
                "Work started successfully",

            contract:
                updatedContract

        })


    } catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "Error starting work",

            error:
                error.message

        })

    }

}

// SUBMIT WORK
// FREELANCER

const submitWork = async (req, res) => {

    try {

        const {
            submittedWork
        } = req.body


        if (
            !submittedWork ||
            !submittedWork.trim()
        ) {

            return res.status(400).json({

                message:
                    "Submitted work is required"

            })

        }


        const contract =
            await Contract.findById(
                req.params.id
            )


        if (!contract) {

            return res.status(404).json({

                message:
                    "Contract not found"

            })

        }


        if (
            contract.status !==
            "In Progress" &&
            contract.status !==
            "Revision"
        ) {

            return res.status(400).json({

                message:
                    "Work can only be submitted when contract is in progress or revision is requested"

            })

        }


        contract.submittedWork =
            submittedWork.trim()

        contract.status =
            "Submitted"


        await contract.save()

        // NOTIFY CLIENT

        await Notification.create({

            user:
                contract.client,

            type:
                "Work Submitted",

            message:
                "The freelancer has submitted work for your project. Please review it.",

            referenceId:
                contract._id

        })


        const updatedContract =
            await Contract.findById(
                contract._id
            )

                .populate(
                    "project",
                    "title description budget deadline status"
                )

                .populate(
                    "client",
                    "name email"
                )

                .populate(
                    "freelancer",
                    "name email"
                )


        res.status(200).json({

            message:
                "Work submitted successfully",

            contract:
                updatedContract

        })


    } catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "Error submitting work",

            error:
                error.message

        })

    }

}

// UPDATE CONTRACT STATUS
// CLIENT + FREELANCER

const updateContractStatus = async (req, res) => {

    try {

        const {
            status,
            submittedWork
        } = req.body


        const allowedStatuses = [

            "Active",

            "In Progress",

            "Submitted",

            "Revision",

            "Completed",

            "Cancelled"

        ]


        if (
            !allowedStatuses.includes(status)
        ) {

            return res.status(400).json({

                message:
                    "Invalid contract status"

            })

        }


        const contract =
            await Contract.findById(
                req.params.id
            )


        if (!contract) {

            return res.status(404).json({

                message:
                    "Contract not found"

            })

        }


        const previousStatus =
            contract.status

        // SUBMITTED WORK
        if (
            status === "Submitted"
        ) {

            if (
                !submittedWork ||
                !submittedWork.trim()
            ) {

                return res.status(400).json({

                    message:
                        "Submitted work is required"

                })

            }


            contract.submittedWork =
                submittedWork.trim()

        }

        // STATUS

        contract.status =
            status


        // START DATE

        if (
            status === "In Progress" &&
            !contract.startDate
        ) {

            contract.startDate =
                new Date()

        }

        // COMPLETED DATE

        if (
            status === "Completed"
        ) {

            contract.completedDate =
                new Date()

        } else if (
            status !== "Completed"
        ) {

            contract.completedDate =
                null

        }


        await contract.save()


        // PROJECT STATUS

        if (
            status === "Completed"
        ) {

            await Project.findByIdAndUpdate(

                contract.project,

                {

                    status:
                        "Completed"

                }

            )

        } else if (

            status === "Active" ||
            status === "In Progress" ||
            status === "Submitted" ||
            status === "Revision"

        ) {

            await Project.findByIdAndUpdate(

                contract.project,

                {

                    status:
                        "In Progress"

                }

            )

        }

        // AUTOMATIC NOTIFICATIONS

        // START WORK

        if (
            status === "In Progress" &&
            previousStatus === "Active"
        ) {

            await Notification.create({

                user:
                    contract.client,

                type:
                    "General",

                message:
                    "The freelancer has started working on your project.",

                referenceId:
                    contract._id

            })

        }


        // WORK SUBMITTED

        if (
            status === "Submitted"
        ) {

            await Notification.create({

                user:
                    contract.client,

                type:
                    "Work Submitted",

                message:
                    "The freelancer has submitted work for your project. Please review it.",

                referenceId:
                    contract._id

            })

        }


        // REVISION REQUESTED


        if (
            status === "Revision"
        ) {

            await Notification.create({

                user:
                    contract.freelancer,

                type:
                    "Revision Requested",

                message:
                    "The client has requested a revision for your submitted work.",

                referenceId:
                    contract._id

            })

        }


        // CONTRACT COMPLETED

        if (
            status === "Completed"
        ) {

            await Notification.create({

                user:
                    contract.freelancer,

                type:
                    "Contract Completed",

                message:
                    "The client has marked your contract as completed.",

                referenceId:
                    contract._id

            })

        }

        // CONTRACT CANCELLED

        if (
            status === "Cancelled"
        ) {

            const notifyUser =
                req.user.id ===
                contract.client.toString()
                    ? contract.freelancer
                    : contract.client


            await Notification.create({

                user:
                    notifyUser,

                type:
                    "General",

                message:
                    "Your contract has been cancelled.",

                referenceId:
                    contract._id

            })

        }


        const updatedContract =
            await Contract.findById(
                contract._id
            )

                .populate(
                    "project",
                    "title description budget deadline status"
                )

                .populate(
                    "client",
                    "name email"
                )

                .populate(
                    "freelancer",
                    "name email"
                )


        res.status(200).json({

            message:
                "Contract status updated successfully",

            contract:
                updatedContract

        })


    } catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "Error updating contract status",

            error:
                error.message

        })

    }

}


// CANCEL CONTRACT


const cancelContract = async (req, res) => {

    try {

        const contract =
            await Contract.findById(
                req.params.id
            )


        if (!contract) {

            return res.status(404).json({

                message:
                    "Contract not found"

            })

        }


        contract.status =
            "Cancelled"

        await contract.save()


        // NOTIFY OTHER USER


        const notifyUser =
            req.user.id ===
            contract.client.toString()
                ? contract.freelancer
                : contract.client


        await Notification.create({

            user:
                notifyUser,

            type:
                "General",

            message:
                "Your contract has been cancelled.",

            referenceId:
                contract._id

        })


        res.status(200).json({

            message:
                "Contract cancelled successfully",

            contract

        })


    } catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "Error cancelling contract",

            error:
                error.message

        })

    }

}


// EXPORT

module.exports = {createContract,getAllContracts,getContractById,getClientContracts,getFreelancerContracts,startWork,submitWork,updateContractStatus,cancelContract}