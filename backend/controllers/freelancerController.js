const Freelancer = require("../models/Freelancer")
const User = require("../models/User")



   // CREATE FREELANCER PROFILE
   // Freelancer only


const createFreelancerProfile = async (req, res) => {

    try {

        const userId = req.user.id

        const user = await User.findById(userId)

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            })

        }

        if (user.role !== "Freelancer") {

            return res.status(403).json({
                message: "Only freelancers can create freelancer profile"
            })

        }

        const existingProfile = await Freelancer.findOne({
            user: userId
        })

        if (existingProfile) {

            return res.status(400).json({
                message: "Freelancer profile already exists"
            })

        }

        const {
            skills,
            experience,
            bio,
            hourlyRate,
            portfolio,
            education,
            availability
        } = req.body

        const freelancer = await Freelancer.create({

            user: userId,

            skills: Array.isArray(skills)
                ? skills
                : skills
                    ? skills.split(",").map(skill => skill.trim())
                    : [],

            experience: experience || "",

            bio: bio || "",

            hourlyRate: hourlyRate || 0,

            portfolio: portfolio || "",

            education: education || "",

            availability: availability || "Available"

        })

        res.status(201).json({

            message: "Freelancer profile created successfully",

            freelancer

        })

    } catch (error) {

        res.status(500).json({

            message: "Error creating freelancer profile",

            error: error.message

        })

    }

}



 //   GET MY FREELANCER PROFILE
   // Freelancer only


const getMyFreelancerProfile = async (req, res) => {

    try {

        const freelancer = await Freelancer
            .findOne({
                user: req.user.id
            })
            .populate(
                "user",
                "name email role"
            )

        if (!freelancer) {

            return res.status(404).json({

                message: "Freelancer profile not found"

            })

        }

        res.status(200).json({

            freelancer

        })

    } catch (error) {

        res.status(500).json({

            message: "Error fetching freelancer profile",

            error: error.message

        })

    }

}

  //  UPDATE MY FREELANCER PROFILE
  //  Freelancer only


const updateFreelancerProfile = async (req, res) => {

    try {

        const userId = req.user.id

        const freelancer = await Freelancer.findOne({
            user: userId
        })

        if (!freelancer) {

            return res.status(404).json({

                message: "Freelancer profile not found"

            })

        }

        const {
            skills,
            experience,
            bio,
            hourlyRate,
            portfolio,
            education,
            availability
        } = req.body


        if (skills !== undefined) {

            freelancer.skills = Array.isArray(skills)
                ? skills
                : skills
                    ? skills.split(",").map(skill => skill.trim())
                    : []

        }

        if (experience !== undefined) {

            freelancer.experience = experience

        }

        if (bio !== undefined) {

            freelancer.bio = bio

        }

        if (hourlyRate !== undefined) {

            freelancer.hourlyRate = hourlyRate

        }

        if (portfolio !== undefined) {

            freelancer.portfolio = portfolio

        }

        if (education !== undefined) {

            freelancer.education = education

        }

        if (availability !== undefined) {

            freelancer.availability = availability

        }


        await freelancer.save()


        res.status(200).json({

            message: "Freelancer profile updated successfully",

            freelancer

        })

    } catch (error) {

        res.status(500).json({

            message: "Error updating freelancer profile",

            error: error.message

        })

    }

}



    //GET ALL FREELANCERS

    //Admin / Client / Freelancer


const getAllFreelancers = async (req, res) => {

    try {

        const freelancers = await Freelancer
            .find()
            .populate(
                "user",
                "name email role"
            )
            .sort({
                createdAt: -1
            })

        res.status(200).json({

            count: freelancers.length,

            freelancers

        })

    } catch (error) {

        res.status(500).json({

            message: "Error fetching freelancers",

            error: error.message

        })

    }

}



 //   GET FREELANCER BY ID

  //  Admin / Client / Freelancer


const getFreelancerById = async (req, res) => {

    try {

        const freelancer = await Freelancer
            .findById(req.params.id)
            .populate(
                "user",
                "name email role"
            )

        if (!freelancer) {

            return res.status(404).json({

                message: "Freelancer not found"

            })

        }

        res.status(200).json({

            freelancer

        })

    } catch (error) {

        res.status(500).json({

            message: "Error fetching freelancer",

            error: error.message

        })

    }

}


module.exports = { createFreelancerProfile, getMyFreelancerProfile, updateFreelancerProfile, getAllFreelancers, getFreelancerById}