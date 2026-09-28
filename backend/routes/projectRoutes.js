const express = require("express")

const router = express.Router()

const multer = require("multer")

const { addProject, getProjects, getProjectById, updateProject, deleteProject, closeProject} = require("../controllers/projectController")

const { protect, authorizeRoles} = require("../middleware/authMiddleware")

// MULTER CONFIGURATION

const upload = multer({ dest: "uploads/"})


// GET ALL PROJECTS

router.get( "/", protect, authorizeRoles( "Admin", "Client", "Freelancer"), getProjects)

// ADD PROJECT
// CLIENT ONLY

router.post("/add",protect, authorizeRoles("Client"),upload.array("attachments", 5), addProject)


// GET PROJECT BY ID

router.get( "/:id", protect, authorizeRoles( "Admin", "Client", "Freelancer"), getProjectById)


// UPDATE PROJECT
// CLIENT ONLY

router.put( "/:id", protect, authorizeRoles("Client"), updateProject)


// DELETE PROJECT
// ADMIN + CLIENT

router.delete( "/:id", protect, authorizeRoles( "Admin", "Client"), deleteProject)


// CLOSE PROJECT
// CLIENT ONLY

router.put( "/:id/close", protect, authorizeRoles("Client"), closeProject)


module.exports = router