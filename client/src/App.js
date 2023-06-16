import * as React from "react";
import {Navigate, useRoutes} from "react-router-dom";
import Header from "./components/navigation/Header";
import Sidebar from "./components/navigation/Sidebar"
import 'notyf/notyf.min.css'

import NotFound from "./pages/NotFound";
import Homepage from "./pages/Homepage";
import StudentLogin from "./pages/student/StudentLogin";
import StudentHome from "./pages/student/StudentHome";
import StudentModules from "./pages/student/StudentModules";
import {connect} from "react-redux";
import StudentAuth from "./pages/student/StudentAuth";
import StaffAuth from "./pages/staff/StaffAuth";
import StaffLogin from "./pages/staff/StaffLogin";
import StaffModules from "./pages/staff/StaffModules";
import StaffModule from "./pages/staff/StaffModule";
import StaffCreateLecture from "./pages/staff/StaffCreateLecture";
import StaffLectures from "./pages/staff/StaffLectures";
import StudentModule from "./pages/student/StudentModule";
import StudentLectures from "./pages/student/StudentLectures";
import StaffHome from "./pages/staff/StaffHome";
import StaffLecture from "./pages/staff/StaffLecture";
import StudentLecture from "./pages/student/StudentLecture";
import StaffQuiz from "./pages/staff/StaffQuiz";
import StaffNewQuiz from "./pages/staff/StaffNewQuiz";
import StaffCreateQuiz from "./pages/staff/StaffCreateQuiz";
import StaffCreateAssignment from "./pages/staff/StaffCreateAssignment";
import StaffQuizView from "./pages/staff/StaffQuizView";
import StudentQuizes from "./pages/student/StudentQuizes";
import StudentQuizEntry from "./pages/student/StudentQuizEntry";
import StudentNotFound from "./pages/student/StudentNotFound";
import StaffNotFound from "./pages/staff/StaffNotFound";
import StudentSubmittedQuiz from "./pages/student/StudentSubmittedQuiz";
import StaffSubmittedQuiz from "./pages/staff/StaffSubmittedQuiz";
import StaffConfig from "./pages/staff/staffConfig";
import StaffConfigAllStudents from "./pages/staff/Config/StaffConfigAllStudents";
import StaffConfigNewStudents from "./pages/staff/Config/StaffConfigNewStudent";
import StaffConfigEditStudent from "./pages/staff/Config/StaffConfigEditStudent";
import StudentAssignments from "./pages/student/studentAssignments";
import StudentAssignmentSubmission from "./pages/student/StudentAssignmentSubmission";
import StaffAssignmentView from "./pages/staff/StaffAssignmentView";

const App = ({logged_in, role}) => {
    let routes = [
        {
            path: "/",
            element: <Homepage/>
        },
        {
            path: "student",
            children: [
                {
                    path: "login",
                    element: <StudentLogin/>
                },
                {
                    path: "personal",
                    element: <StudentAuth success={logged_in && role === "STUDENT"}/>,
                    children: [
                        {
                            path: "home",
                            element: <StudentHome/>
                        },
                        {
                            path: "lectures",
                            children: [
                                {
                                    index: true,
                                    element: <StudentLectures/>
                                },
                                {
                                    path: ":id",
                                    element: <StudentLecture/>
                                }
                            ]
                        },
                        {
                            path: "assignments",
                            children: [
                                {
                                    index: true,
                                    element: <StudentAssignments/>
                                },
                                {
                                    path: ":id",
                                    element: <StudentAssignmentSubmission/>
                                }
                            ]
                        },
                        {
                            path: "modules",
                            children: [
                                {
                                    index: true,
                                    element: <StudentModules/>
                                },
                                {
                                    path: ":id",
                                    element: <StudentModule/>
                                }
                            ]

                        },
                        {
                            path: "quiz",
                            children: [
                                {
                                    index: true,
                                    element: <StudentQuizes/>
                                },
                                {
                                    path: "new/:id",
                                    element: <StudentQuizEntry/>
                                },
                                {
                                    path: "submitted/:id",
                                    element: <StudentSubmittedQuiz/>
                                }
                            ]
                        },
                        {
                            path: "*",
                            element: <StudentNotFound/>
                        }
                    ]
                },

                {
                    index: true,
                    element: <Navigate to={'/student/login'}/>
                }
            ]
        },
        {
            path: "staff",
            children: [
                {
                    path: "personal",
                    element: <StaffAuth success={logged_in && (role === "LECTURER" || role === "TEACHING ASSISTANT")}/>,
                    children: [
                        {
                            path: "home",
                            element: <StaffHome/>
                        },
                        {
                            path: "lectures",
                            children: [
                                {
                                    index: true,
                                    element: <StaffLectures/>
                                },
                                {
                                    path: ":id",
                                    element: <StaffLecture/>
                                },
                                {
                                    path: "new",
                                    element: <StaffCreateLecture/>
                                }
                            ]
                        },
                        {
                            path: "assignments",
                            children: [
                                {
                                    index: true,
                                    element: <StaffLectures/>
                                },
                                {
                                    path: ":id",
                                    element: <StaffAssignmentView/>
                                }
                            ]
                        },
                        {
                            path: "modules",
                            children: [
                                {
                                    index: true,
                                    element: <StaffModules/>
                                },
                                {
                                    path: ":id",
                                    children: [
                                        {
                                            index: true,
                                            element: <StaffModule/>
                                        },
                                        {
                                            path: "new-lecture",
                                            element: <StaffCreateLecture/>
                                        },
                                        {
                                            path: "new-assignment",
                                            element: <StaffCreateAssignment/>
                                        }
                                    ]

                                }
                            ]

                        },
                        {
                            path: "quiz",
                            children: [
                                {
                                    index: true,
                                    element: <StaffQuiz/>
                                },
                                {
                                    path: "new",
                                    element: <StaffCreateQuiz/>
                                },
                                {
                                    path: ":id",
                                    element: <StaffQuizView/>
                                },
                                {
                                    path: "submitted/:id",
                                    element: <StaffSubmittedQuiz/>
                                }
                            ]
                        },
                        {
                            path: "config",
                            children: [
                                {
                                    index: true,
                                    element: <StaffConfig/>

                                },
                                {
                                    path: "students",
                                    children: [
                                        {
                                            index: true,
                                            element: <StaffConfigAllStudents/>
                                        },
                                        {
                                            path: "new",
                                            element: <StaffConfigNewStudents/>
                                        },
                                        {
                                            path: ":id",
                                            element: <StaffConfigEditStudent/>
                                        },
                                    ]
                                }
                            ]

                        },
                        {
                            path: "*",
                            element: <StaffNotFound/>
                        }
                    ]
                },
                {
                    path: "login",
                    element: <StaffLogin/>
                }
            ]
        },
        {
            path: "*",
            element: <NotFound/>
        }
    ]

    return useRoutes(routes)
}

const AppWrapper = ({logged_in, role}) => {
    //console.log(logged_in)
    return (
        <>
            <Header/>
            <Sidebar/>
            <div className="page-wrapper">
                <App logged_in={logged_in} role={role}/>
            </div>
        </>
    )
}

const map_state_to_props = (state) => {
    return {
        logged_in: state.auth.logged_in,
        role: state.auth.role
    }
}

export default connect(map_state_to_props, {})(AppWrapper);
