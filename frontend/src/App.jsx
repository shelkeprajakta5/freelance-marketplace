import {  BrowserRouter,  Routes,  Route,  Navigate} from "react-router-dom"


import { AuthProvider} from "./context/AuthContext"


import ProtectedRoute from "./components/ProtectedRoute"


import Login from "./pages/Login"

import Register from "./pages/Register"


import AdminDashboard from "./pages/AdminDashboard"

import ClientDashboard from "./pages/ClientDashboard"

import FreelancerDashboard from "./pages/FreelancerDashboard"


import Profile from "./pages/Profile"

import FreelancerList from "./pages/FreelancerList"

import FreelancerDetails from "./pages/FreelancerDetails"

import MyFreelancerProfile from "./pages/MyFreelancerProfile"

import EditFreelancerProfile from "./pages/EditFreelancerProfile"


import ClientProfile from "./pages/ClientProfile"

import CreateClientProfile from "./pages/CreateClientProfile"

import EditClientProfile  from "./pages/EditClientProfile"

import ClientDetails from "./pages/ClientDetails"


import CategoryList from "./pages/CategoryList"

import AddCategory from "./pages/AddCategory"

import EditCategory from "./pages/EditCategory"


import ProjectList from "./pages/ProjectList"

import AddProject from "./pages/AddProject"

import ProjectDetails from "./pages/ProjectDetails"

import EditProject from "./pages/EditProject"

import MyProjects from "./pages/MyProjects"

import SubmitProposal from "./pages/SubmitProposal"

import MyProposals from "./pages/MyProposals"

import ProposalDetails from "./pages/ProposalDetails"

import ReceivedProposals from "./pages/ReceivedProposals"


import ClientContracts from "./pages/ClientContracts"

import FreelancerContracts from "./pages/FreelancerContracts"

import ContractDetails from "./pages/ContractDetails"


import FileUpload from "./pages/FileUpload"

import Messages  from "./pages/Messages"


import ReviewList from "./pages/ReviewList"

import NotificationList from "./pages/NotificationList"

import AdminUsers from "./pages/AdminUsers"

import AdminUserDetails  from "./pages/AdminUserDetails"

import Analytics from "./pages/Analytics"


function App() {

    return (

        <BrowserRouter>

            <AuthProvider>

                <Routes>


                    {/*PUBLIC  */}

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/login"
                                replace
                            />
                        }
                    />


                    <Route
                        path="/login"
                        element={
                            <Login />
                        }
                    />


                    <Route
                        path="/register"
                        element={
                            <Register />
                        }
                    />


                    {/*  ADMIN DASHBOARD*/}

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "Admin"
                                ]}
                            />
                        }
                    >

                        <Route
                            path="/admin-dashboard"
                            element={
                                <AdminDashboard />
                            }
                        />

                    </Route>


                    {/*   CLIENT DASHBOAR*/}

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "Client"
                                ]}
                            />
                        }
                    >

                        <Route
                            path="/client-dashboard"
                            element={
                                <ClientDashboard />
                            }
                        />

                    </Route>


                    {/* FREELANCER DASHBOARD */}

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "Freelancer"
                                ]}
                            />
                        }
                    >

                        <Route
                            path="/freelancer-dashboard"
                            element={
                                <FreelancerDashboard />
                            }
                        />

                    </Route>


                    {/* COMMON PROFILE*/}

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "Admin",
                                    "Client",
                                    "Freelancer"
                                ]}
                            />
                        }
                    >

                        <Route
                            path="/profile"
                            element={
                                <Profile />
                            }
                        />

                    </Route>


                    {/* FREELANCER*/}

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "Admin",
                                    "Client"
                                ]}
                            />
                        }
                    >

                        <Route
                            path="/freelancers"
                            element={
                                <FreelancerList />
                            }
                        />

                    </Route>


                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "Admin",
                                    "Client"
                                ]}
                            />
                        }
                    >

                        <Route
                            path="/freelancers/:id"
                            element={
                                <FreelancerDetails />
                            }
                        />

                    </Route>


                    {/* MY FREELANCER PROFILE */}

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "Freelancer"
                                ]}
                            />
                        }
                    >

                        <Route
                            path="/freelancer/profile"
                            element={
                                <MyFreelancerProfile />
                            }
                        />


                        <Route
                            path="/freelancer/profile/edit"
                            element={
                                <EditFreelancerProfile />
                            }
                        />

                    </Route>


                    {/* CLIENT PROFILE*/}

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "Client"
                                ]}
                            />
                        }
                    >

                        <Route
                            path="/client/profile"
                            element={
                                <ClientProfile />
                            }
                        />


                        <Route
                            path="/client/profile/create"
                            element={
                                <CreateClientProfile />
                            }
                        />


                        <Route
                            path="/client/profile/edit"
                            element={
                                <EditClientProfile />
                            }
                        />

                    </Route>


                    {/*  CLIENT DETAILS*/}

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "Admin",
                                    "Client",
                                    "Freelancer"
                                ]}
                            />
                        }
                    >

                        <Route
                            path="/clients/:id"
                            element={
                                <ClientDetails />
                            }
                        />

                    </Route>


                    {/* CATEGORIES */}

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "Admin"
                                ]}
                            />
                        }
                    >

                        <Route
                            path="/categories"
                            element={
                                <CategoryList />
                            }
                        />


                        <Route
                            path="/categories/add"
                            element={
                                <AddCategory />
                            }
                        />


                        <Route
                            path="/categories/edit/:id"
                            element={
                                <EditCategory />
                            }
                        />

                    </Route>


                    {/* PROJECT*/}

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "Admin",
                                    "Client",
                                    "Freelancer"
                                ]}
                            />
                        }
                    >

                        <Route
                            path="/projects"
                            element={
                                <ProjectList />
                            }
                        />


                        <Route
                            path="/projects/:id"
                            element={
                                <ProjectDetails />
                            }
                        />

                    </Route>


                    {/* ADD PROJECT*/}

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "Client"
                                ]}
                            />
                        }
                    >

                        <Route
                            path="/projects/add"
                            element={
                                <AddProject />
                            }
                        />


                        <Route
                            path="/projects/edit/:id"
                            element={
                                <EditProject />
                            }
                        />


                        <Route
                            path="/my-projects"
                            element={
                                <MyProjects />
                            }
                        />

                    </Route>


                    {/*  PROPOSALS*/}

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "Freelancer"
                                ]}
                            />
                        }
                    >

                        <Route
                            path="/proposals/add/:projectId"
                            element={
                                <SubmitProposal />
                            }
                        />


                        <Route
                            path="/my-proposals"
                            element={
                                <MyProposals />
                            }
                        />

                    </Route>


                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "Client",
                                    "Freelancer"
                                ]}
                            />
                        }
                    >

                        <Route
                            path="/proposals/:id"
                            element={
                                <ProposalDetails />
                            }
                        />

                    </Route>


                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "Client"
                                ]}
                            />
                        }
                    >

                        <Route
                            path="/received-proposals"
                            element={
                                <ReceivedProposals />
                            }
                        />

                    </Route>

                    {/*  CONTRACTS */}

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "Client"
                                ]}
                            />
                        }
                    >

                        <Route
                            path="/client/contracts"
                            element={
                                <ClientContracts />
                            }
                        />

                    </Route>


                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "Freelancer"
                                ]}
                            />
                        }
                    >

                        <Route
                            path="/freelancer/contracts"
                            element={
                                <FreelancerContracts />
                            }
                        />

                    </Route>


                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "Client",
                                    "Freelancer"
                                ]}
                            />
                        }
                    >

                        <Route
                            path="/contracts/:id"
                            element={
                                <ContractDetails />
                            }
                        />

                    </Route>


                    {/*  FILE UPLOAD*/}

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "Admin",
                                    "Client",
                                    "Freelancer"
                                ]}
                            />
                        }
                    >

                        <Route
                            path="/file-upload"
                            element={
                                <FileUpload />
                            }
                        />

                    </Route>


                    {/*  MESSAGES*/}

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "Client",
                                    "Freelancer"
                                ]}
                            />
                        }
                    >

                        <Route
                            path="/messages"
                            element={
                                <Messages />
                            }
                        />

                    </Route>


                    {/*  REVIEWS*/}

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "Client",
                                    "Freelancer"
                                ]}
                            />
                        }
                    >

                        <Route
                            path="/reviews"
                            element={
                                <ReviewList />
                            }
                        />


                        <Route
                            path="/reviews/user/:userId"
                            element={
                                <ReviewList />
                            }
                        />

                    </Route>


                    {/* NOTIFICATIONS */}

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "Admin",
                                    "Client",
                                    "Freelancer"
                                ]}
                            />
                        }
                    >

                        <Route
                            path="/notifications"
                            element={
                                <NotificationList />
                            }
                        />

                    </Route>


                    {/* ADMIN MANAGEMENT*/}

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "Admin"
                                ]}
                            />
                        }
                    >

                        <Route
                            path="/admin/users"
                            element={
                                <AdminUsers />
                            }
                        />


                        <Route
                            path="/admin/users/:id"
                            element={
                                <AdminUserDetails />
                            }
                        />

                    </Route>


                    {/*  ANALYTICS */}

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "Admin"
                                ]}
                            />
                        }
                    >

                        <Route
                            path="/admin/analytics"
                            element={
                                <Analytics />
                            }
                        />

                    </Route>


                    {/* INVALID ROUTE */}

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/login"
                                replace
                            />
                        }
                    />


                </Routes>

            </AuthProvider>

        </BrowserRouter>

    )

}


export default App