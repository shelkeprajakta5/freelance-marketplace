import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../css/Proposal.css"
import API_URL from "../config"

function SubmitProposal() {

    const navigate = useNavigate()
    const { projectId } = useParams()
    const { user } = useAuth()


    const [project, setProject] = useState(null)

    const [coverLetter, setCoverLetter] = useState("")
    const [bidAmount, setBidAmount] = useState("")
    const [deliveryTime, setDeliveryTime] = useState("")

    const [attachments, setAttachments] = useState([])

    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")


    // FETCH PROJECT

    useEffect(() => {

        if (!user) {
            return
        }


        if (user.role !== "Freelancer") {

            navigate("/projects", {
                replace: true
            })

            return

        }


        fetchProject()

    }, [projectId, user])


    const fetchProject = async () => {

        try {

            setLoading(true)
            setError("")


            const token =
                localStorage.getItem("token")


            const response =
                await fetch(

                    `${API_URL}/projects/${projectId}`,

                    {
                        headers: {

                            Authorization:
                                `Bearer ${token}`

                        }
                    }

                )


            const data =
                await response.json()


            if (!response.ok) {

                throw new Error(

                    data.message ||
                    "Failed to load project"

                )

            }


            setProject(data.project)


        } catch (error) {

            setError(error.message)

        } finally {

            setLoading(false)

        }

    }

    // FILE SELECTION

    const handleFileChange = (e) => {

        const selectedFiles =
            Array.from(e.target.files)


        if (selectedFiles.length > 5) {

            setError(
                "You can upload maximum 5 files."
            )

            e.target.value = ""

            return

        }


        setError("")


        setAttachments(selectedFiles)

    }


    // REMOVE FILE

    const removeFile = (index) => {

        setAttachments(
            attachments.filter(
                (_, fileIndex) =>
                    fileIndex !== index
            )
        )

    }

    // SUBMIT PROPOSAL

    const handleSubmit = async (e) => {

        e.preventDefault()


        setError("")
        setSuccess("")


        if (!coverLetter.trim()) {

            setError(
                "Please enter a cover letter."
            )

            return

        }


        if (!bidAmount) {

            setError(
                "Please enter your bid amount."
            )

            return

        }


        if (!deliveryTime) {

            setError(
                "Please enter delivery time."
            )

            return

        }


        setSubmitting(true)


        try {

            const token =
                localStorage.getItem("token")


            // FORM DATA

            const formData =
                new FormData()


            // IMPORTANT:
            // uploadType must be added before files

            formData.append(
                "uploadType",
                "proposal"
            )


            formData.append(
                "project",
                projectId
            )


            formData.append(
                "coverLetter",
                coverLetter
            )


            formData.append(
                "bidAmount",
                Number(bidAmount)
            )


            formData.append(
                "deliveryTime",
                Number(deliveryTime)
            )


            // ATTACHMENTS

            attachments.forEach((file) => {

                formData.append(
                    "attachments",
                    file
                )

            })


        
            // API REQUEST

            const response =
                await fetch(

                    `${API_URL}/proposals/add`,

                    {

                        method: "POST",

                        headers: {

                            Authorization:
                                `Bearer ${token}`

                        },

                        body: formData

                    }

                )


            const data =
                await response.json()


            if (!response.ok) {

                throw new Error(

                    data.message ||
                    "Failed to submit proposal"

                )

            }


            // SUCCESS

            setSuccess(
                "Proposal submitted successfully!"
            )


            setCoverLetter("")
            setBidAmount("")
            setDeliveryTime("")
            setAttachments([])


            // Reset file input

            const fileInput =
                document.getElementById(
                    "proposalAttachments"
                )

            if (fileInput) {

                fileInput.value = ""

            }


            // Stay on current route

        } catch (error) {

            setError(error.message)

        } finally {

            setSubmitting(false)

        }

    }


    // LOADING
    if (loading) {

        return (

            <div className="proposal-page">

                <div className="proposal-loading">

                    Loading project...

                </div>

            </div>

        )

    }



    // PROJECT ERROR

    if (error && !project) {

        return (

            <div className="proposal-page">

                <div className="proposal-error">

                    {error}

                </div>

            </div>

        )

    }


    return (

        <div className="proposal-page">

            <div className="proposal-container">


                {/*  HEADER*/}

                <div className="proposal-header">

                    <div>

                        <p className="proposal-label">
                            PROPOSAL MANAGEMENT
                        </p>

                        <h1>
                            Submit Proposal
                        </h1>

                        <p>
                            Send your proposal for this project.
                        </p>

                    </div>


                    <button

                        type="button"

                        className="proposal-secondary-btn"

                        onClick={() => navigate(-1)}

                    >

                        Back

                    </button>

                </div>


                {/* PROJECT CAR*/}

                {project && (

                    <div className="proposal-project-card">


                        <div className="proposal-project-top">

                            <div>

                                <span>
                                    PROJECT
                                </span>

                                <h2>
                                    {project.title}
                                </h2>

                            </div>


                            <strong>

                                ₹{project.budget}

                            </strong>

                        </div>


                        <p>
                            {project.description}
                        </p>


                        <div className="proposal-project-meta">


                            <div>

                                <span>
                                    Category
                                </span>

                                <strong>

                                    {project.category?.name ||
                                        project.category ||
                                        "N/A"}

                                </strong>

                            </div>


                            <div>

                                <span>
                                    Deadline
                                </span>

                                <strong>

                                    {project.deadline

                                        ? new Date(
                                            project.deadline
                                        ).toLocaleDateString()

                                        : "N/A"

                                    }

                                </strong>

                            </div>


                        </div>

                    </div>

                )}


                {/* FORM*/}

                <form

                    className="proposal-form-card"

                    onSubmit={handleSubmit}

                >


                    <h2>
                        Your Proposal
                    </h2>


                    <p className="proposal-form-description">

                        Tell the client why you are the right
                        freelancer for this project.

                    </p>


                    {/* ERROR */}

                    {error && (

                        <div className="proposal-error">

                            {error}

                        </div>

                    )}


                    {/* SUCCESS */}

                    {success && (

                        <div className="proposal-success">

                            {success}

                        </div>

                    )}


                    {/*  COVER LETTER */}

                    <div className="proposal-form-group">

                        <label>
                            Cover Letter
                        </label>


                        <textarea

                            value={coverLetter}

                            onChange={(e) =>
                                setCoverLetter(
                                    e.target.value
                                )
                            }

                            placeholder="Write your proposal..."

                            rows="7"

                            required

                        />

                    </div>


                    {/*  BID + DELIVERY */}

                    <div className="proposal-form-grid">


                        <div className="proposal-form-group">

                            <label>
                                Bid Amount
                            </label>


                            <input

                                type="number"

                                value={bidAmount}

                                onChange={(e) =>
                                    setBidAmount(
                                        e.target.value
                                    )
                                }

                                placeholder="₹ Enter your bid"

                                min="0"

                                required

                            />

                        </div>


                        <div className="proposal-form-group">

                            <label>
                                Delivery Time
                            </label>


                            <input

                                type="number"

                                value={deliveryTime}

                                onChange={(e) =>
                                    setDeliveryTime(
                                        e.target.value
                                    )
                                }

                                placeholder="Days"

                                min="1"

                                required

                            />

                        </div>


                    </div>


                    {/*  ATTACHMENTS*/}

                    <div className="proposal-form-group">

                        <label>
                            Attachments
                        </label>


                        <input

                            id="proposalAttachments"

                            type="file"

                            multiple

                            onChange={handleFileChange}

                        />


                        <small>

                            Maximum 5 files.
                            Maximum file size is 10 MB per file.

                        </small>


                        {/*  SELECTED FILES*/}

                        {attachments.length > 0 && (

                            <div className="proposal-file-list">

                                {attachments.map(
                                    (file, index) => (

                                        <div
                                            className="proposal-file-item"
                                            key={`${file.name}-${index}`}
                                        >

                                            <span>

                                                {file.name}

                                            </span>


                                            <button

                                                type="button"

                                                onClick={() =>
                                                    removeFile(index)
                                                }

                                            >

                                                Remove

                                            </button>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>


                    {/* ACTION */}

                    <div className="proposal-form-actions">


                        <button

                            type="button"

                            className="proposal-secondary-btn"

                            onClick={() => navigate(-1)}

                            disabled={submitting}

                        >

                            Cancel

                        </button>


                        <button

                            type="submit"

                            className="proposal-primary-btn"

                            disabled={submitting}

                        >

                            {submitting

                                ? "Submitting..."

                                : "Submit Proposal"

                            }

                        </button>


                    </div>


                </form>

            </div>

        </div>

    )

}


export default SubmitProposal