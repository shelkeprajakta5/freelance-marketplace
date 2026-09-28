const Proposal = require("../models/Proposal")
const Project = require("../models/Project")
const Contract = require("../models/Contract")
const Notification = require("../models/Notification")


// ADD PROPOSAL
// FREELANCER ONLY

const addProposal = async (req, res) => {

    try {

        const {
            project,
            coverLetter,
            bidAmount,
            deliveryTime
        } = req.body


        // REQUIRED FIELDS


        if (
            !project ||
            !coverLetter ||
            bidAmount === undefined ||
            !deliveryTime
        ) {

            return res.status(400).json({

                message:
                    "Please provide all required fields"

            })

        }

        // CHECK PROJECT

        const projectExists =
            await Project.findById(project)

        if (!projectExists) {

            return res.status(404).json({

                message:
                    "Project not found"

            })

        }


        // CLOSED PROJECT

        if (
            projectExists.status === "Closed"
        ) {

            return res.status(400).json({

                message:
                    "Cannot submit proposal for a closed project"

            })

        }

        // CLIENT CANNOT APPLY TO OWN PROJECT

        if (
            projectExists.client.toString() ===
            req.user.id
        ) {

            return res.status(403).json({

                message:
                    "You cannot submit a proposal to your own project"

            })

        }


        // CHECK EXISTING PROPOSAL

        const existingProposal =
            await Proposal.findOne({

                project: project,

                freelancer:
                    req.user.id,

                status: {
                    $ne: "Withdrawn"
                }

            })


        if (existingProposal) {

            return res.status(400).json({

                message:
                    "You have already submitted a proposal for this project"

            })

        }

        // BID VALIDATION

        if (Number(bidAmount) < 0) {

            return res.status(400).json({

                message:
                    "Bid amount cannot be negative"

            })

        }


        // DELIVERY TIME

        if (Number(deliveryTime) <= 0) {

            return res.status(400).json({

                message:
                    "Delivery time must be greater than 0"

            })

        }
        // GET ATTACHMENTS

        const attachments =
            req.files
                ? req.files.map(
                    file =>
                        `/uploads/proposals/${file.filename}`
                )
                : []


    
        // CREATE PROPOSAL

        const proposal =
            await Proposal.create({

                project,

                freelancer:
                    req.user.id,

                coverLetter,

                bidAmount,

                deliveryTime,

                attachments

            })


        // CREATE NOTIFICATION FOR CLIENT

        await Notification.create({

            user:
                projectExists.client,

            type:
                "New Proposal",

            message:
                `You received a new proposal for your project "${projectExists.title}".`,

            referenceId:
                proposal._id

        })

        // POPULATE PROPOSAL


        const populatedProposal =
            await Proposal.findById(
                proposal._id
            )

                .populate(
                    "project",
                    "title description budget deadline status client"
                )

                .populate(
                    "freelancer",
                    "name email role"
                )


        // RESPONSE

        res.status(201).json({

            message:
                "Proposal submitted successfully",

            proposal:
                populatedProposal

        })


    } catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "Failed to submit proposal",

            error:
                error.message

        })

    }

}

// GET ALL PROPOSAL

const getProposals = async (req, res) => {

    try {

        let filter = {}


      
        // FREELANCER


        if (
            req.user.role === "Freelancer"
        ) {

            filter.freelancer =
                req.user.id

        }

        // CLIENT

        if (
            req.user.role === "Client"
        ) {

            const projects =
                await Project.find({

                    client:
                        req.user.id

                }).select("_id")


            const projectIds =
                projects.map(
                    project =>
                        project._id
                )


            filter.project = {

                $in: projectIds

            }

        }


        // GET PROPOSALS

        const proposals =
            await Proposal.find(filter)

                .populate(
                    "project",
                    "title description budget deadline status client"
                )

                .populate(
                    "freelancer",
                    "name email role"
                )

                .sort({

                    createdAt: -1

                })


        res.status(200).json({

            count:
                proposals.length,

            proposals

        })


    } catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "Failed to fetch proposals",

            error:
                error.message

        })

    }

}

// GET PROPOSAL BY ID

const getProposalById = async (req, res) => {

    try {

        const proposal =
            await Proposal.findById(
                req.params.id
            )

                .populate(
                    "project",
                    "title description budget deadline status client"
                )

                .populate(
                    "freelancer",
                    "name email role"
                )


        if (!proposal) {

            return res.status(404).json({

                message:
                    "Proposal not found"

            })

        }


        // FREELANCER ACCESS

        if (
            req.user.role === "Freelancer" &&
            proposal.freelancer._id.toString() !==
            req.user.id
        ) {

            return res.status(403).json({

                message:
                    "You are not allowed to view this proposal"

            })

        }


    
        // CLIENT ACCESS


        if (
            req.user.role === "Client" &&
            proposal.project.client.toString() !==
            req.user.id
        ) {

            return res.status(403).json({

                message:
                    "You are not allowed to view this proposal"

            })

        }


        res.status(200).json({

            proposal

        })


    } catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "Failed to fetch proposal",

            error:
                error.message

        })

    }

}


// UPDATE PROPOSAL
// FREELANCER ONLY

const updateProposal = async (req, res) => {

    try {

        const proposal =
            await Proposal.findById(
                req.params.id
            )


        if (!proposal) {

            return res.status(404).json({

                message:
                    "Proposal not found"

            })

        }


        if (
            proposal.freelancer.toString() !==
            req.user.id
        ) {

            return res.status(403).json({

                message:
                    "You can only update your own proposal"

            })

        }


        if (
            proposal.status !== "Pending"
        ) {

            return res.status(400).json({

                message:
                    "Only pending proposals can be updated"

            })

        }


        const {
            coverLetter,
            bidAmount,
            deliveryTime
        } = req.body


        if (
            coverLetter !== undefined
        ) {

            proposal.coverLetter =
                coverLetter

        }


        if (
            bidAmount !== undefined
        ) {

            if (
                Number(bidAmount) < 0
            ) {

                return res.status(400).json({

                    message:
                        "Bid amount cannot be negative"

                })

            }

            proposal.bidAmount =
                bidAmount

        }


        if (
            deliveryTime !== undefined
        ) {

            if (
                Number(deliveryTime) <= 0
            ) {

                return res.status(400).json({

                    message:
                        "Delivery time must be greater than 0"

                })

            }

            proposal.deliveryTime =
                deliveryTime

        }

        // NEW ATTACHMENTS


        if (
            req.files &&
            req.files.length > 0
        ) {

            const newAttachments =
                req.files.map(
                    file =>
                        `/uploads/proposals/${file.filename}`
                )


            proposal.attachments =
                [
                    ...proposal.attachments,
                    ...newAttachments
                ]

        }


        await proposal.save()


  
        // POPULATE

        const updatedProposal =
            await Proposal.findById(
                proposal._id
            )

                .populate(
                    "project",
                    "title description budget deadline status client"
                )

                .populate(
                    "freelancer",
                    "name email role"
                )


        res.status(200).json({

            message:
                "Proposal updated successfully",

            proposal:
                updatedProposal

        })


    } catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "Failed to update proposal",

            error:
                error.message

        })

    }

}


// WITHDRAW PROPOSAL

const deleteProposal = async (req, res) => {

    try {

        const proposal =
            await Proposal.findById(
                req.params.id
            )


        if (!proposal) {

            return res.status(404).json({

                message:
                    "Proposal not found"

            })

        }


        if (
            proposal.freelancer.toString() !==
            req.user.id
        ) {

            return res.status(403).json({

                message:
                    "You can only withdraw your own proposal"

            })

        }


        if (
            proposal.status !== "Pending"
        ) {

            return res.status(400).json({

                message:
                    "Only pending proposals can be withdrawn"

            })

        }


        proposal.status =
            "Withdrawn"


        await proposal.save()


        res.status(200).json({

            message:
                "Proposal withdrawn successfully",

            proposal

        })


    } catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "Failed to withdraw proposal",

            error:
                error.message

        })

    }

}

// ACCEPT PROPOSAL
const acceptProposal = async (req, res) => {

    try {

        const proposal =
            await Proposal.findById(
                req.params.id
            )
                .populate("project")


        if (!proposal) {

            return res.status(404).json({

                message:
                    "Proposal not found"

            })

        }



        // CLIENT OWNERSHIP
    

        if (
            proposal.project.client.toString() !==
            req.user.id
        ) {

            return res.status(403).json({

                message:
                    "Only the project owner can accept this proposal"

            })

        }

   // STATUS
    

        if (
            proposal.status !== "Pending"
        ) {

            return res.status(400).json({

                message:
                    "Only pending proposals can be accepted"

            })

        }

  // PROJECT STATUS
    
        if (
            proposal.project.status === "Closed"
        ) {

            return res.status(400).json({

                message:
                    "Cannot accept proposal for a closed project"

            })

        }


        // CHECK EXISTING CONTRACT

        const existingContract =
            await Contract.findOne({

                proposal:
                    proposal._id

            })


        if (existingContract) {

            return res.status(400).json({

                message:
                    "Contract already exists for this proposal",

                contract:
                    existingContract

            })

        }


  
        // ACCEPT SELECTED PROPOSA

        proposal.status =
            "Accepted"


        await proposal.save()


        // REJECT OTHER PROPOSALS


        const otherPendingProposals =
            await Proposal.find({

                project:
                    proposal.project._id,

                _id: {
                    $ne:
                        proposal._id
                },

                status:
                    "Pending"

            })


        await Proposal.updateMany(

            {

                project:
                    proposal.project._id,

                _id: {
                    $ne:
                        proposal._id
                },

                status:
                    "Pending"

            },

            {

                $set: {

                    status:
                        "Rejected"

                }

            }

        )


 
        // NOTIFICATION TO ACCEPTED FREELANCER

        await Notification.create({

            user:
                proposal.freelancer,

            type:
                "Proposal Accepted",

            message:
                `Your proposal for "${proposal.project.title}" has been accepted by the client.`,

            referenceId:
                proposal._id

        })


        // NOTIFICATIONS TO REJECTED FREELANCERS
        for (
            const rejectedProposal
            of otherPendingProposals
        ) {

            await Notification.create({

                user:
                    rejectedProposal.freelancer,

                type:
                    "Proposal Rejected",

                message:
                    `Your proposal for "${proposal.project.title}" was not selected.`,

                referenceId:
                    rejectedProposal._id

            })

        }


        // UPDATE PROJECT
        

        proposal.project.status =
            "In Progress"


        await proposal.project.save()


        // CREATE CONTRACT

        const contract =
            await Contract.create({

                project:
                    proposal.project._id,

                proposal:
                    proposal._id,

                client:
                    proposal.project.client,

                freelancer:
                    proposal.freelancer,

                agreedAmount:
                    proposal.bidAmount,

                deliveryTime:
                    proposal.deliveryTime,

                status:
                    "Active"

            })


        // POPULATE CONTRACT

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


  
        // RESPONSE

        res.status(200).json({

            message:
                "Proposal accepted and contract created successfully",

            proposal,

            contract:
                populatedContract

        })


    } catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "Failed to accept proposal and create contract",

            error:
                error.message

        })

    }

}


// REJECT PROPOSAL

const rejectProposal = async (req, res) => {

    try {

        const proposal =
            await Proposal.findById(
                req.params.id
            )
                .populate("project")


        if (!proposal) {

            return res.status(404).json({

                message:
                    "Proposal not found"

            })

        }


        
        // CLIENT OWNERSHIP
    
        if (
            proposal.project.client.toString() !==
            req.user.id
        ) {

            return res.status(403).json({

                message:
                    "Only the project owner can reject this proposal"

            })

        }


    
        // STATUS

        if (
            proposal.status !== "Pending"
        ) {

            return res.status(400).json({

                message:
                    "Only pending proposals can be rejected"

            })

        }

        // UPDATE STATUS

        proposal.status =
            "Rejected"


        await proposal.save()


        // NOTIFY FREELANCER

        await Notification.create({

            user:
                proposal.freelancer,

            type:
                "Proposal Rejected",

            message:
                `Your proposal for "${proposal.project.title}" was rejected by the client.`,

            referenceId:
                proposal._id

        })

        // POPULATE


        const rejectedProposal =
            await Proposal.findById(
                proposal._id
            )

                .populate(
                    "project",
                    "title description budget deadline status client"
                )

                .populate(
                    "freelancer",
                    "name email role"
                )


      
        // RESPONSE

        res.status(200).json({

            message:
                "Proposal rejected successfully",

            proposal:
                rejectedProposal

        })


    } catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "Failed to reject proposal",

            error:
                error.message

        })

    }

}



module.exports = {addProposal, getProposals,getProposalById, updateProposal, deleteProposal, acceptProposal, rejectProposal}