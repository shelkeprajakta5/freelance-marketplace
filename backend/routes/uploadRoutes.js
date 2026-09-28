const express = require("express")

const router = express.Router()

const upload = require("../middleware/uploadMiddleware")


const { uploadSingleFile, uploadMultipleFiles, deleteFile} = require("../controllers/uploadController")

// UPLOAD SINGLE FILE

router.post( "/single", upload.single("file"), uploadSingleFile)

// UPLOAD MULTIPLE FILES

router.post("/multiple",upload.array("files", 5), uploadMultipleFiles)


// DELETE FILE

router.delete( "/delete",  deleteFile)


module.exports = router