const Project = require("../models/Project")
const Category = require("../models/Category")

// ADD PROJECT

const addProject = async (req, res) => {

    try {

        const {
            title,
            description,
            category,
            requiredSkills,
            budget,
            deadline,
            attachments
        } = req.body

        if (
            !title ||
            !description ||
            !category ||
            budget === undefined ||
            !deadline
        ) {
            return res.status(400).json({
                message: "Please provide all required fields"
            })
        }

        const categoryExists =
            await Category.findById(category)

        if (!categoryExists) {
            return res.status(404).json({
                message: "Category not found"
            })
        }

        if (new Date(deadline) <= new Date()) {
            return res.status(400).json({
                message: "Deadline must be a future date"
            })
        }

        const project = await Project.create({

            title,

            description,

            client: req.user.id,

            category,

            requiredSkills:
                Array.isArray(requiredSkills)
                    ? requiredSkills
                    : requiredSkills
                        ? requiredSkills
                            .split(",")
                            .map(skill => skill.trim())
                        : [],

            budget,

            deadline,

            attachments: attachments || []

        })

        const populatedProject =
            await Project.findById(project._id)

                .populate(
                    "client",
                    "name email role"
                )

                .populate(
                    "category",
                    "name"
                )

        res.status(201).json({

            message: "Project created successfully",

            project: populatedProject

        })

    } catch (error) {

        console.log(error)

        res.status(500).json({

            message: "Failed to create project",

            error: error.message

        })

    }

}

// GET ALL PROJECTS
// SEARCH + FILTER

const getProjects = async (req, res) => {

    try {

        const {
            search,
            category,
            skills,
            minimumBudget,
            maximumBudget,
            status
        } = req.query

        const filter = {}


        // SEARCh

        if (search && search.trim()) {

            filter.$or = [

                {
                    title: {
                        $regex: search.trim(),
                        $options: "i"
                    }
                },

                {
                    description: {
                        $regex: search.trim(),
                        $options: "i"
                    }
                },

                {
                    requiredSkills: {
                        $regex: search.trim(),
                        $options: "i"
                    }
                }

            ]

        }


        // CATEGORY

        if (category) {

            filter.category = category

        }

        // SKILLS

        if (skills && skills.trim()) {

            const skillArray =
                skills
                    .split(",")
                    .map(skill => skill.trim())
                    .filter(skill => skill !== "")

            if (skillArray.length > 0) {

                filter.requiredSkills = {

                    $in: skillArray.map(
                        skill =>
                            new RegExp(
                                skill,
                                "i"
                            )
                    )

                }

            }

        }

        // MINIMUM BUDGET

        if (minimumBudget !== undefined) {

            const minBudget =
                Number(minimumBudget)

            if (isNaN(minBudget)) {

                return res.status(400).json({

                    message:
                        "Minimum budget must be a number"

                })

            }

            filter.budget = {

                ...filter.budget,

                $gte: minBudget

            }

        }


        // MAXIMUM BUDGET

        if (maximumBudget !== undefined) {

            const maxBudget =
                Number(maximumBudget)

            if (isNaN(maxBudget)) {

                return res.status(400).json({

                    message:
                        "Maximum budget must be a number"

                })

            }

            filter.budget = {

                ...filter.budget,

                $lte: maxBudget

            }

        }


        // BUDGET VALIDATION

        if (
            minimumBudget !== undefined &&
            maximumBudget !== undefined
        ) {

            if (
                Number(minimumBudget) >
                Number(maximumBudget)
            ) {

                return res.status(400).json({

                    message:
                        "Minimum budget cannot be greater than maximum budget"

                })

            }

        }


        // STATU

        if (status) {

            const allowedStatuses = [

                "Open",
                "In Progress",
                "Completed",
                "Closed"

            ]

            if (
                !allowedStatuses.includes(status)
            ) {

                return res.status(400).json({

                    message:
                        "Invalid project status"

                })

            }

            filter.status = status

        }


        // GET FILTERED PROJECTS

        const projects =
            await Project.find(filter)

                .populate(
                    "client",
                    "name email role"
                )

                .populate(
                    "category",
                    "name"
                )

                .sort({
                    createdAt: -1
                })


        res.status(200).json({

            count: projects.length,

            projects

        })

    } catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "Failed to fetch projects",

            error:
                error.message

        })

    }

}


// GET PROJECT BY ID

const getProjectById = async (req, res) => {

    try {

        const project =
            await Project.findById(req.params.id)

                .populate(
                    "client",
                    "name email role"
                )

                .populate(
                    "category",
                    "name"
                )

        if (!project) {

            return res.status(404).json({

                message:
                    "Project not found"

            })

        }

        res.status(200).json({

            project

        })

    } catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "Failed to fetch project",

            error:
                error.message

        })

    }

}

// UPDATE PROJECT

const updateProject = async (req, res) => {

    try {

        const project =
            await Project.findById(req.params.id)

        if (!project) {

            return res.status(404).json({

                message:
                    "Project not found"

            })

        }


        // ONLY PROJECT OWNER

        if (
            project.client.toString() !==
            req.user.id
        ) {

            return res.status(403).json({

                message:
                    "You can only update your own project"

            })

        }


        // CLOSED PROJECT CANNOT BE UPDATED

        if (project.status === "Closed") {

            return res.status(400).json({

                message:
                    "Closed project cannot be updated"

            })

        }


        const {
            title,
            description,
            category,
            requiredSkills,
            budget,
            deadline,
            attachments,
            status
        } = req.body


        // CATEGORY

        if (category) {

            const categoryExists =
                await Category.findById(category)

            if (!categoryExists) {

                return res.status(404).json({

                    message:
                        "Category not found"

                })

            }

            project.category = category

        }


        // DEADLINE

        if (deadline) {

            if (
                new Date(deadline) <= new Date()
            ) {

                return res.status(400).json({

                    message:
                        "Deadline must be a future date"

                })

            }

            project.deadline = deadline

        }


        // TITLE

        if (title !== undefined) {

            project.title = title

        }


        // DESCRIPTION

        if (description !== undefined) {

            project.description = description

        }


        // REQUIRED SKILLS

        if (requiredSkills !== undefined) {

            project.requiredSkills =
                Array.isArray(requiredSkills)
                    ? requiredSkills
                    : requiredSkills
                        .split(",")
                        .map(skill => skill.trim())

        }


        // BUDGET

        if (budget !== undefined) {

            project.budget = budget

        }


        // ATTACHMENTS

        if (attachments !== undefined) {

            project.attachments = attachments

        }


        // STATUS

        if (status !== undefined) {

            const allowedStatuses = [

                "Open",
                "In Progress",
                "Completed",
                "Closed"

            ]

            if (
                !allowedStatuses.includes(status)
            ) {

                return res.status(400).json({

                    message:
                        "Invalid project status"

                })

            }

            project.status = status

        }


        await project.save()


        const updatedProject =
            await Project.findById(project._id)

                .populate(
                    "client",
                    "name email role"
                )

                .populate(
                    "category",
                    "name"
                )


        res.status(200).json({

            message:
                "Project updated successfully",

            project:
                updatedProject

        })

    } catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "Failed to update project",

            error:
                error.message

        })

    }

}

// DELETE PROJECT

const deleteProject = async (req, res) => {

    try {

        const project =
            await Project.findById(req.params.id)

        if (!project) {

            return res.status(404).json({

                message:
                    "Project not found"

            })

        }


        // ADMIN CAN DELETE
        // CLIENT CAN DELETE OWN PROJECT

        if (
            req.user.role !== "Admin" &&
            project.client.toString() !==
            req.user.id
        ) {

            return res.status(403).json({

                message:
                    "You are not allowed to delete this project"

            })

        }


        await Project.findByIdAndDelete(
            req.params.id
        )


        res.status(200).json({

            message:
                "Project deleted successfully"

        })

    } catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "Failed to delete project",

            error:
                error.message

        })

    }

}



// CLOSE PROJECT

const closeProject = async (req, res) => {

    try {

        const project =
            await Project.findById(req.params.id)

        if (!project) {

            return res.status(404).json({

                message:
                    "Project not found"

            })

        }


        // ONLY CLIENT OWNER

        if (
            project.client.toString() !==
            req.user.id
        ) {

            return res.status(403).json({

                message:
                    "You can only close your own project"

            })

        }


        if (project.status === "Closed") {

            return res.status(400).json({

                message:
                    "Project is already closed"

            })

        }


        project.status = "Closed"

        await project.save()


        const closedProject =
            await Project.findById(project._id)

                .populate(
                    "client",
                    "name email role"
                )

                .populate(
                    "category",
                    "name"
                )


        res.status(200).json({

            message:
                "Project closed successfully",

            project:
                closedProject

        })

    } catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "Failed to close project",

            error:
                error.message

        })

    }

}



// EXPORT

module.exports = {addProject, getProjects, getProjectById, updateProject, deleteProject,  closeProject}