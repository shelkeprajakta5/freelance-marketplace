import { useState } from "react"
import axios from "axios"
import "../css/FileUpload.css"
import API_URL from "../config"

function FileUpload() {

    const [file, setFile] = useState(null)

    const [uploadType, setUploadType] =
        useState("project")

    const [uploading, setUploading] =
        useState(false)

    const [uploadedFile, setUploadedFile] =
        useState(null)

    const [error, setError] =
        useState("")


    const handleFileChange = (event) => {

        const selectedFile =
            event.target.files[0]

        setFile(selectedFile)

        setUploadedFile(null)

        setError("")

    }


    const handleUpload = async () => {

        if (!file) {

            setError(
                "Please select a file"
            )

            return

        }


        try {

            setUploading(true)

            setError("")


            const formData =
                new FormData()

            formData.append(
                "file",
                file
            )

            formData.append(
                "uploadType",
                uploadType
            )


            const token =
                localStorage.getItem("token")


            const response =
                await axios.post(

                    `${API_URL}/uploads/single`,

                    formData,

                    {
                        headers: {

                            Authorization:
                                `Bearer ${token}`,

                            "Content-Type":
                                "multipart/form-data"

                        }

                    }

                )


            setUploadedFile(
                response.data.file
            )


        }

        catch (error) {

            console.error(error)

            setError(

                error.response?.data?.message ||

                "File upload failed"

            )

        }

        finally {

            setUploading(false)

        }

    }


    return (

        <div className="file-upload-page">

            <div className="file-upload-card">

                <h1>
                    File Upload
                </h1>

                <p>
                    Upload files for your freelance
                    marketplace
                </p>


                <div className="upload-field">

                    <label>
                        File Type
                    </label>

                    <select
                        value={uploadType}
                        onChange={(event) =>
                            setUploadType(
                                event.target.value
                            )
                        }
                    >

                        <option value="profile">
                            User Profile
                        </option>

                        <option value="project">
                            Project
                        </option>

                        <option value="proposal">
                            Proposal
                        </option>

                        <option value="submission">
                            Work Submission
                        </option>

                    </select>

                </div>


                <div className="upload-field">

                    <label>
                        Select File
                    </label>

                    <input
                        type="file"
                        onChange={handleFileChange}
                    />

                </div>


                {file && (

                    <div className="selected-file">

                        <strong>
                            Selected File
                        </strong>

                        <p>
                            {file.name}
                        </p>

                        <span>
                            {(file.size / 1024 / 1024)
                                .toFixed(2)} MB
                        </span>

                    </div>

                )}


                {error && (

                    <div className="upload-error">

                        {error}

                    </div>

                )}


                <button
                    onClick={handleUpload}
                    disabled={uploading}
                >

                    {uploading
                        ? "Uploading..."
                        : "Upload File"}

                </button>


                {uploadedFile && (

                    <div className="upload-success">

                        <h3>
                            Upload Successful
                        </h3>

                        <p>
                            {uploadedFile.originalName}
                        </p>

                        <a
                            href={
                               `${API_URL.replace("/api", "")}${uploadedFile.url}`
                            }
                            target="_blank"
                            rel="noreferrer"
                        >
                            Preview / Download
                        </a>

                    </div>

                )}

            </div>

        </div>

    )

}


export default FileUpload