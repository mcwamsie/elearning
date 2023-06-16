import MainBreadcrumb from "../../components/breadcrumbs";
import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import AxiosInstance from "../../lib/AxiosInstance";
import AlertNotification from "../../components/AlertNotification";
import Loading from "../../components/Loading";
import {HOST_URL} from "../../lib/constants";

const StaffModule = () => {
    let params = useParams();

    const [module, setModule] = useState([])
    const [assignments, setAssignments] = useState([])
    const [lectures, setLectures] = useState([])
    const [quiz, setQuiz] = useState([])
    const [classes, setClasses] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)

    useEffect(() => {
        async function fetchData() {

            try {
                setLoading(true)
                let res = await AxiosInstance.get(`modules/${params.id}`)
                let lecRes = await AxiosInstance.get(`modules/${params.id}/lecture`)
                let quizRes = await AxiosInstance.get(`staff/modules/${params.id}/quiz`)
                let classRes = await AxiosInstance.get(`modules/${params.id}/classes`)
                let assignmentRes = await AxiosInstance.get(`modules/${params.id}/assignment`)
                setModule(res.data)
                setLectures(lecRes.data)
                setAssignments(assignmentRes.data)

                setClasses(classRes.data)
                setQuiz(quizRes.data)
            } catch (e) {
                if (e.message)
                    setError(e.message)
                if (e.response.data) {
                    let {message, type} = e.response.data
                    setError(`${type}: ${message}`)
                }
            } finally {
                setLoading(false)
            }
        }

        fetchData()

    }, [])
    return (
        <>
            {loading && <Loading/>}
            <MainBreadcrumb text={`${module.moduleCode} ${module.moduleName}`} icon={"book"}/>
            <div className="container-fluid">
                {
                    error && <AlertNotification type={'danger'} icon={"exclamation-triangle-fill"} msg={error}/>
                }
                <div className="row">
                    <div className="col-sm-12">
                        <div className="white-box">
                            <ul className="nav nav-pills nav-justified">
                                <li className="nav-item">
                                    <a className="nav-link active" data-bs-toggle="tab" href="#lectures">Lectures</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" data-bs-toggle="tab" href="#quiz">Quiz</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" data-bs-toggle="tab" href="#assignment">Assignment</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" data-bs-toggle="tab" href="#class">Classes</a>
                                </li>
                            </ul>

                            <div className="tab-content mt-2">
                                <div className="tab-pane active" id="lectures" role="tabpanel"
                                     aria-labelledby="lectures-tab">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <h5 className="box-title mb-0">Lectures</h5>
                                        <Link to={`/staff/personal/modules/${module.moduleId}/new-lecture`}
                                              className="btn btn-dark" style={{width: 150}}>
                                            <i className="far fa-clock"/>
                                            <span className="ms-2">Create Lecture</span>
                                        </Link>


                                    </div>
                                    <div className="table-responsive">
                                        <table className="table text-nowrap table-sm table-striped table-bordered">
                                            <thead>
                                            <tr>
                                                <th className="border-top-0">#</th>
                                                <th className="border-top-0">Topic</th>
                                                <th className="border-top-0">Start Time</th>
                                                <th className="border-top-0">End Time</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                lectures.map(({topic, startDate, endDate}, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{topic.toUpperCase()}</td>
                                                            <td className="text-right">{new Date(startDate).toLocaleString()}</td>
                                                            <td className="text-right">{new Date(endDate).toLocaleString()}</td>

                                                        </tr>
                                                    )

                                                })

                                            }


                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="tab-pane" id="class" role="tabpanel"
                                     aria-labelledby="class-tab">
                                    {
                                        classes.map(({id, programName, programCode, level, students, ...item}, index) => {
                                            return (
                                                <div key={index}>
                                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                                        <h5 className="box-title mb-0">{`${programCode}: ${programName} (${level})`}</h5>
                                                    </div>
                                                    <div className="table-responsive">
                                                        <table className="table text-nowrap table-sm table-striped table-bordered">
                                                            <thead>
                                                            <tr>
                                                                <th className="border-top-0">#</th>
                                                                <th className="border-top-0">Reg Number</th>
                                                                <th className="border-top-0">Full Name</th>
                                                                <th className="border-top-0">Gender</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {
                                                                students.map(({regNumber, first_name, surname, sex}, y)=>{
                                                                    return(
                                                                        <tr key={y}>
                                                                <td>{y + 1}</td>
                                                                <td>{regNumber.toUpperCase()}</td>
                                                                <td>{`${first_name.toUpperCase()} ${surname.toUpperCase()}`}</td>
                                                                <td>{sex.toUpperCase()}</td>

                                                            </tr>
                                                                    )
                                                                })
                                                            }



                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }

                                </div>

                                <div className="tab-pane" id="assignment" role="tabpanel"
                                     aria-labelledby="assignment-tab">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <h5 className="box-title mb-0">Assignments</h5>
                                        <Link to={`/staff/personal/modules/${module.moduleId}/new-assignment`}
                                              className="btn btn-dark" style={{width: 150}}>
                                            <i className="fas fa-pencil-alt"/>
                                            <span className="ms-2">Create Assignment</span>
                                        </Link>


                                    </div>
                                    <div className="table-responsive">
                                        <table className="table text-nowrap table-sm table-striped table-bordered">
                                            <thead>
                                            <tr>
                                                <th className="border-top-0"/>
                                                <th className="border-top-0">#</th>
                                                <th className="border-top-0">Start Time</th>
                                                <th className="border-top-0">End Time</th>
                                                 <th className="border-top-0">Title</th>
                                                 <th className="border-top-0">File</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                assignments.map(({id, title, startDate, endDate, filePath}, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>
                                                                <Link className="btn btn-danger text-white ms-auto"
                                                                   type="button" to={`/staff/personal/assignments/${id}`}
                                                                >
                                                                    <span>View</span>
                                                                </Link>
                                                            </td>
                                                            <td>{index + 1}</td>
                                                            <td className="text-right">{new Date(startDate).toLocaleString()}</td>
                                                            <td className="text-right">{new Date(endDate).toLocaleString()}</td>
                                                            <td>{title.toUpperCase()}</td>
                                                            <td>
                                                                <a href={`${HOST_URL}/uploads/assignments/${filePath}`}
                                                                    download={title}
                                                                    target="_blank"
                                                                   rel="noreferrer"
                                                                >
                                                                    {filePath}
                                                                </a>

                                                            </td>
                                                        </tr>
                                                    )

                                                })

                                            }


                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="tab-pane" id="quiz" role="tabpanel"
                                     aria-labelledby="quiz-tab">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <h5 className="box-title mb-0">Quiz</h5>
                                        <Link to="/staff/personal/quiz/new" className="btn btn-dark" style={{width: 150}}>
                                            <i className="fas fa-puzzle-piece"/>
                                            <span className="ms-2">Create Quiz</span>
                                        </Link>


                                    </div>
                                    <div className="table-responsive">
                                        <table className="table text-nowrap table-sm table-striped table-bordered">
                                            <thead>
                                            <tr>
                                                <th className="border-top-0">#</th>
                                                <th className="border-top-0">Type</th>
                                                <th className="border-top-0">Start Time</th>
                                                <th className="border-top-0">End Time</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                quiz.map(({type, startAt, submitBefore, id}, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>
                                                                <Link className="btn btn-danger text-white ms-auto"
                                                                   type="button" to={`/staff/personal/quiz/${id}`}
                                                                >
                                                                    <span>View</span>
                                                                </Link>
                                                            </td>
                                                            <td>{type.toUpperCase()}</td>
                                                            <td className="text-right">{new Date(startAt).toLocaleString()}</td>
                                                            <td className="text-right">{new Date(submitBefore).toLocaleString()}</td>

                                                        </tr>
                                                    )

                                                })

                                            }


                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StaffModule