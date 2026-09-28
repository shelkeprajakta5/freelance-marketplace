const fs = require("fs")
const path = require("path")

// UPLOAD SINGLE FILE

const uploadSingleFile = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                message: "Please select a file"

            })

        }


        const file = req.file


        const fileUrl =
            `/uploads/${file.destination
                .replace("uploads/", "")
                .replace(/\\/g, "/")}/${file.filename}`


        res.status(201).json({

            message: "File uploaded successfully",

            file: {

                originalName:
                    file.originalname,

                filename:
                    file.filename,

                mimetype:
                    file.mimetype,

                size:
                    file.size,

                path:
                    file.path,

                url:
                    fileUrl

            }

        })

    }

    catch (error) {

        console.log(error)

        res.status(500).json({

            message: "File upload failed",

            error: error.message

        })

    }

}
// UPLOAD MULTIPLE FILES

const uploadMultipleFiles = async (req, res) => {

    try {

        if (
            !req.files ||
            req.files.length === 0
        ) {

            return res.status(400).json({

                message: "Please select files"

            })

        }


        const files = req.files.map((file) => {

            const fileUrl =
                `/uploads/${file.destination
                    .replace("uploads/", "")
                    .replace(/\\/g, "/")}/${file.filename}`


            return {

                originalName:
                    file.originalname,

                filename:
                    file.filename,

                mimetype:
                    file.mimetype,

                size:
                    file.size,

                path:
                    file.path,

                url:
                    fileUrl

            }

        })


        res.status(201).json({

            message:
                "Files uploaded successfully",

            files

        })

    }

    catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "File upload failed",

            error: error.message

        })

    }

}
// DELETE FILE

const deleteFile = async (req, res) => {

    try {

        const { filename } = req.body


        if (!filename) {

            return res.status(400).json({

                message:
                    "Filename is required"

            })

        }


        const filePath =
            path.join(
                __dirname,
                "..",
                filename
            )


        if (!fs.existsSync(filePath)) {

            return res.status(404).json({

                message:
                    "File not found"

            })

        }


        fs.unlinkSync(filePath)


        res.status(200).json({

            message:
                "File deleted successfully"

        })

    }

    catch (error) {

        console.log(error)

        res.status(500).json({

            message:
                "File deletion failed",

            error:
                error.message

        })

    }

}


module.exports = { uploadSingleFile,  uploadMultipleFiles,  deleteFile}