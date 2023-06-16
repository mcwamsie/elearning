import Loading from "../../components/Loading";
import MainBreadcrumb from "../../components/breadcrumbs";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import AxiosInstance from "../../lib/AxiosInstance";
import AlertNotification from "../../components/AlertNotification";
import {HOST_URL} from "../../lib/constants";
import {connect} from "react-redux";

const StudentAssignments = ({}) => {

    const [error, setError] = useState(null)
    const [assignments, setAssignments] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                let res = await AxiosInstance.get('/student/assignments')
                setAssignments(res.data)

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
            <MainBreadcrumb text={"Assignments"} icon={"clock"}/>
            <div className="container-fluid">
                {
                    error && <AlertNotification type={'danger'} icon={"exclamation-triangle-fill"} msg={error}/>
                }
                <div className="row">
                    <div className="col-12 mb-4">
                        <div className="card h-100">
                            <div
                                className="card-heading p-2 d-flex align-items-center justify-content-between bg-dark text-white">
                                <h6 className="mb-0">Assignments</h6>
                            </div>
                            <div className="card-body p-2">
                                <div>
                                    <table className="table table-sm">
                                        <tbody>

                                        {
                                            assignments.map(
                                                ({
                                                     moduleName,
                                                     id,
                                                     moduleCode,
                                                     possibleScore,
                                                     filePath,
                                                     title,
                                                     startDate,
                                                     endDate,
                                                     submission
                                                 }, i
                                                ) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td className="p-1"
                                                                style={{width: 130, verticalAlign: "middle"}}>

                                                                <div
                                                                    className="text-white p-2  h-100 py-3 d-flex flex-column justify-content-center align-items-center bg-danger"
                                                                    style={{maxWidth: 110, minWidth: 110}}><span
                                                                    className="fw-bold font-14">{new Date(endDate).toLocaleDateString()}</span><span
                                                                    className="fw-light font-12">{new Date(endDate).toLocaleTimeString()}</span>
                                                                </div>
                                                            </td>
                                                            <td className="p-2 pb-3">
                                                                <p className="font-bold mb-0 font-14">{title}</p>
                                                                <p className="mb-0">MODULE: {`${moduleCode}: ${moduleName}`}</p>
                                                                <p className="mb-0 fw-bold">POSSIBLE SCORE: {possibleScore}</p>
                                                                {submission &&
                                                                <p className="mb-0 fw-bold ">YOUR SCORE:
                                                                    {submission.score ?
                                                                        <>
                                                                            {
                                                                                submission.score / possibleScore < .5 ?
                                                                                    <span
                                                                                        className="text-danger ms-2">{submission.score}</span> :
                                                                                    <span
                                                                                        className="text-success ms-2">{submission.score}</span>
                                                                            }
                                                                        </>
                                                                        :
                                                                        <span
                                                                            className="text-secondary ms-1 font-weight-bolder">---</span>
                                                                    }
                                                                </p>}

                                                                <hr/>

                                                                <a href={`${HOST_URL}/uploads/assignments/${filePath}`}
                                                                   download={title}
                                                                   target="_blank"
                                                                   rel="noreferrer"
                                                                   className="btn btn-danger text-white me-4"
                                                                >
                                                                    <i className="fas fa-download me-2"/>
                                                                    <span>QUESTION FILE</span>

                                                                </a>
                                                                {!submission ?
                                                                    <Link to={`/student/personal/assignments/${id}`}
                                                                          className="btn btn-danger text-white ms-auto"
                                                                          type="button" style={{width: 120}}>

                                                                        <span>SUBMIT</span>
                                                                    </Link>
                                                                    :
                                                                    <a href={`${HOST_URL}/uploads/assignments/student-submissions/${submission.submittedFilepath}`}
                                                                       download={title}
                                                                       target="_blank"
                                                                       rel="noreferrer"
                                                                       className="btn btn-danger text-white me-4"
                                                                    >
                                                                        <i className="fas fa-download me-2"/>
                                                                        <span>SUBMITTED FILE</span>

                                                                    </a>
                                                                }

                                                            </td>
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

        </>

    )
}
const map_state_to_props = (state) => {
    return {
        profile: state.auth.profile
    }
}
export default connect(map_state_to_props, {})(StudentAssignments)