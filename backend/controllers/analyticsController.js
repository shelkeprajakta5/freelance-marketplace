const User = require("../models/User")
const Project = require("../models/Project")
const Proposal = require("../models/Proposal")
const Contract = require("../models/Contract")
const Category = require("../models/Category")


// GET ANALYTICS
// ADMIN ONLY


const getAnalytics = async (req, res) => {

    try {

        // PROJECTS BY CATEGORY

        const projectsByCategory =
            await Project.aggregate([

                {
                    $group: {

                        _id: "$category",

                        count: {
                            $sum: 1
                        }

                    }

                },

                {
                    $lookup: {

                        from: "categories",

                        localField: "_id",

                        foreignField: "_id",

                        as: "category"

                    }

                },

                {
                    $unwind: {

                        path: "$category",

                        preserveNullAndEmptyArrays: true

                    }

                },

                {
                    $project: {

                        _id: 0,

                        name: {
                            $ifNull: [
                                "$category.name",
                                "Unknown"
                            ]
                        },

                        count: 1

                    }

                },

                {
                    $sort: {
                        count: -1
                    }
                }

            ])


        // PROJECTS BY STATUS

        const projectsByStatus =
            await Project.aggregate([

                {
                    $group: {

                        _id: "$status",

                        count: {
                            $sum: 1
                        }

                    }

                },

                {
                    $project: {

                        _id: 0,

                        name: "$_id",

                        count: 1

                    }

                },

                {
                    $sort: {
                        count: -1
                    }

                }

            ])


        // USERS BY ROLE

        const usersByRole =
            await User.aggregate([

                {
                    $group: {

                        _id: "$role",

                        count: {
                            $sum: 1
                        }

                    }

                },

                {
                    $project: {

                        _id: 0,

                        name: "$_id",

                        count: 1

                    }

                },

                {
                    $sort: {
                        count: -1
                    }

                }

            ])


        // PROPOSALS BY STATUS

        const proposalsByStatus =
            await Proposal.aggregate([

                {
                    $group: {

                        _id: "$status",

                        count: {
                            $sum: 1
                        }

                    }

                },

                {
                    $project: {

                        _id: 0,

                        name: "$_id",

                        count: 1

                    }

                },

                {
                    $sort: {
                        count: -1
                    }

                }

            ])

        // CONTRACTS BY STATUS

        const contractsByStatus =
            await Contract.aggregate([

                {
                    $group: {

                        _id: "$status",

                        count: {
                            $sum: 1
                        }

                    }

                },

                {
                    $project: {

                        _id: 0,

                        name: "$_id",

                        count: 1

                    }

                },

                {
                    $sort: {
                        count: -1
                    }

                }

            ])


        // MONTHLY PROJECTS

        const monthlyProjects =
            await Project.aggregate([

                {
                    $match: {

                        createdAt: {
                            $exists: true
                        }

                    }

                },

                {
                    $group: {

                        _id: {

                            year: {
                                $year: "$createdAt"
                            },

                            month: {
                                $month: "$createdAt"
                            }

                        },

                        count: {
                            $sum: 1
                        }

                    }

                },

                {
                    $sort: {

                        "_id.year": 1,

                        "_id.month": 1

                    }

                },

                {
                    $project: {

                        _id: 0,

                        month: {

                            $concat: [

                                {
                                    $toString: "$_id.year"
                                },

                                "-",

                                {
                                    $cond: [

                                        {
                                            $lt: [
                                                "$_id.month",
                                                10
                                            ]
                                        },

                                        {
                                            $concat: [
                                                "0",
                                                {
                                                    $toString:
                                                        "$_id.month"
                                                }
                                            ]
                                        },

                                        {
                                            $toString:
                                                "$_id.month"
                                        }

                                    ]

                                }

                            ]

                        },

                        count: 1

                    }

                }

            ])


        // MONTHLY USERS

        const monthlyUsers =
            await User.aggregate([

                {
                    $match: {

                        createdAt: {
                            $exists: true
                        }

                    }

                },

                {
                    $group: {

                        _id: {

                            year: {
                                $year: "$createdAt"
                            },

                            month: {
                                $month: "$createdAt"
                            }

                        },

                        count: {
                            $sum: 1
                        }

                    }

                },

                {
                    $sort: {

                        "_id.year": 1,

                        "_id.month": 1

                    }

                },

                {
                    $project: {

                        _id: 0,

                        month: {

                            $concat: [

                                {
                                    $toString: "$_id.year"
                                },

                                "-",

                                {
                                    $cond: [

                                        {
                                            $lt: [
                                                "$_id.month",
                                                10
                                            ]
                                        },

                                        {
                                            $concat: [
                                                "0",
                                                {
                                                    $toString:
                                                        "$_id.month"
                                                }
                                            ]
                                        },

                                        {
                                            $toString:
                                                "$_id.month"
                                        }

                                    ]

                                }

                            ]

                        },

                        count: 1

                    }

                }

            ])

        // TOTAL COUNTS

        const totalUsers =
            await User.countDocuments()


        const totalProjects =
            await Project.countDocuments()


        const totalProposals =
            await Proposal.countDocuments()


        const totalContracts =
            await Contract.countDocuments()


        const totalCategories =
            await Category.countDocuments()


        // RESPONSE

        res.status(200).json({

            message:
                "Analytics fetched successfully",

            totals: {

                users:
                    totalUsers,

                projects:
                    totalProjects,

                proposals:
                    totalProposals,

                contracts:
                    totalContracts,

                categories:
                    totalCategories

            },

            analytics: {

                projectsByCategory,

                projectsByStatus,

                usersByRole,

                proposalsByStatus,

                contractsByStatus,

                monthlyProjects,

                monthlyUsers

            }

        })

    } catch (error) {

        console.log(
            "Analytics Error:",
            error
        )

        res.status(500).json({

            message:
                "Failed to fetch analytics",

            error:
                error.message

        })

    }

}


module.exports = {getAnalytics}