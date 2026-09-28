const multer = require("multer")
const path = require("path")
const fs = require("fs")

// CREATE UPLOAD DIRECTORIES

const uploadDirectories = [
    "uploads/profiles",
    "uploads/projects",
    "uploads/proposals",
    "uploads/submissions"
]


uploadDirectories.forEach((directory) => {

    if (!fs.existsSync(directory)) {

        fs.mkdirSync(directory, {
            recursive: true
        })

    }

})

// STORAGE
const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        let folder = "uploads/projects"


        if (req.body.uploadType === "profile") {

            folder = "uploads/profiles"

        }

        else if (req.body.uploadType === "proposal") {

            folder = "uploads/proposals"

        }

        else if (req.body.uploadType === "submission") {

            folder = "uploads/submissions"

        }


        cb(null, folder)

    },


    filename: (req, file, cb) => {

        const extension =
            path.extname(file.originalname)

        const fileName =
            `${Date.now()}-${Math.round(Math.random() * 1E9)}${extension}`

        cb(null, fileName)

    }

})


// FILE 

const fileFilter = (req, file, cb) => {

    const allowedTypes = [

        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",

        "application/pdf",

        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

        "application/zip",
        "application/x-rar-compressed",

        "text/plain"

    ]


    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true)

    }

    else {

        cb(
            new Error(
                "This file type is not allowed"
            ),
            false
        )

    }

}


// MULTER

const upload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 10 * 1024 * 1024

    }

})


module.exports = upload