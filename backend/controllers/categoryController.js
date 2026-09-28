const Category = require("../models/Category")

// ADD CATEGORY

const addCategory = async (req, res) => {

    try {

        const {
            name,
            description,
            status
        } = req.body


        if (!name) {

            return res.status(400).json({
                message: "Category name is required"
            })

        }


        const existingCategory =
            await Category.findOne({
                name
            })


        if (existingCategory) {

            return res.status(400).json({
                message: "Category already exists"
            })

        }


        const category =
            await Category.create({
                name,
                description,
                status
            })


        res.status(201).json({
            message: "Category added successfully",
            category
        })


    } catch (error) {

        res.status(500).json({
            message: "Failed to add category",
            error: error.message
        })

    }

}

// GET ALL CATEGORIES

const getCategories = async (req, res) => {

    try {

        const categories =
            await Category.find()
                .sort({
                    createdAt: -1
                })


        res.status(200).json({
            count: categories.length,
            categories
        })


    } catch (error) {

        res.status(500).json({
            message: "Failed to get categories",
            error: error.message
        })

    }

}

// GET CATEGORY BY ID


const getCategory = async (req, res) => {

    try {

        const category =
            await Category.findById(
                req.params.id
            )


        if (!category) {

            return res.status(404).json({
                message: "Category not found"
            })

        }


        res.status(200).json({
            category
        })


    } catch (error) {

        res.status(500).json({
            message: "Failed to get category",
            error: error.message
        })

    }

}


// UPDATE CATEGORY

const updateCategory = async (req, res) => {

    try {

        const {
            name,
            description,
            status
        } = req.body


        const category =
            await Category.findById(
                req.params.id
            )


        if (!category) {

            return res.status(404).json({
                message: "Category not found"
            })

        }


        if (name) {

            const existingCategory =
                await Category.findOne({
                    name,
                    _id: {
                        $ne: req.params.id
                    }
                })


            if (existingCategory) {

                return res.status(400).json({
                    message: "Category name already exists"
                })

            }

            category.name = name

        }


        if (description !== undefined) {

            category.description =
                description

        }


        if (status) {

            category.status =
                status

        }


        await category.save()


        res.status(200).json({
            message: "Category updated successfully",
            category
        })


    } catch (error) {

        res.status(500).json({
            message: "Failed to update category",
            error: error.message
        })

    }

}

// DELETE CATEGORY
const deleteCategory = async (req, res) => {

    try {

        const category =
            await Category.findById(
                req.params.id
            )


        if (!category) {

            return res.status(404).json({
                message: "Category not found"
            })

        }


        await Category.findByIdAndDelete(
            req.params.id
        )


        res.status(200).json({
            message: "Category deleted successfully"
        })


    } catch (error) {

        res.status(500).json({
            message: "Failed to delete category",
            error: error.message
        })

    }

}


module.exports = {addCategory,getCategories,getCategory, updateCategory, deleteCategory}