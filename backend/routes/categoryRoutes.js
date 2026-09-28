const express = require("express")

const router = express.Router()


const { addCategory, getCategories, getCategory, updateCategory, deleteCategory} = require("../controllers/categoryController")


const { protect,authorizeRoles} = require("../middleware/authMiddleware")

// GET ALL CATEGORIES
// ADMIN + CLIENT + FREELANCE

router.get("/",protect,authorizeRoles(    "Admin",    "Client",    "Freelancer"),getCategories)

// GET CATEGORY BY ID
// ADMIN + CLIENT + FREELANCER

router.get( "/:id", protect, authorizeRoles( "Admin", "Client", "Freelancer" ), getCategory)


// ADD CATEGORY
// ADMIN 

router.post("/", protect, authorizeRoles("Admin"), addCategory)


// UPDATE CATEGORY
// ADMIN ONLY

router.put( "/:id", protect, authorizeRoles("Admin"), updateCategory)

// DELETE CATEGORY
// ADMIN ONLY

router.delete("/:id",protect,authorizeRoles("Admin"),deleteCategory)


module.exports = router