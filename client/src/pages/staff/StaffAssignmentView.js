import MainBreadcrumb from "../../components/breadcrumbs";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import AxiosInstance from "../../lib/AxiosInstance";
import AlertNotification from "../../components/AlertNotification";
import Loading from "../../components/Loading";
import {HOST_URL} from "../../lib/constants";
import notyf from "../../notyf";

const StaffAssignmentView = () => {
    let params = useParams();

    const [assignment, setAssignment] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)
    const [submitted, setSubmitted] = useState([])

    const handleSubmit = async (e)=>{
        e.preventDefault()
        let id = e.target[0].value
        let score = e.target[1].value
       if (!score)
           return notyf.error("Enter Score To Continue")

        try {
            let res = await AxiosInstance.get(`/staff/assignments/score/${id}/${score}`)
            let {message} = res.data
            notyf.success(message)
            await fetchData()
        }
       catch (e) {
           if (e.response.data) {
                    let {message, type} = e.response.data
                    setError(`${type}: ${message}`)
                     return notyf.error(`${type}: ${message}`)
                }
                if (e.message) {
                    setError(e.message)
                   return notyf.error(e.message)
                }
       }

    }
async function fetchData() {

            try {
                setLoading(true)
                setError(null)
                let res = await AxiosInstance.get(`/staff/assignments/${params.id}`)
                setAssignment(res.data)

                let submittedRes = await AxiosInstance.get(`/staff/assignments/submitted/${params.id}`)
                //console.log(submittedRes.data)
                setSubmitted(submittedRes.data)
                //console.log(res.data)
            } catch (e) {

                if (e.response.data) {
                    let {message, type} = e.response.data
                    setError(`${type}: ${message}`)
                     return notyf.error(`${type}: ${message}`)
                }
                if (e.message) {
                    setError(e.message)
                   return notyf.error(e.message)
                }
            } finally {
                setLoading(false)
            }
        }
    useEffect( () => {


         fetchData()

    }, [])
    return (
        <>
            {loading && <Loading/>}
            <MainBreadcrumb text={`Assignment`} icon={"pencil-alt"}/>
            <div className="container-fluid">
                {
                    error && <AlertNotification type={'danger'} icon={"exclamation-triangle-fill"} msg={error}/>
                }
                <div className="row">
                    <div className="col-sm-12">
                        <div className="white-box">
                            <div className="table-responsive">
                                <table className="table table-sm table-bordered">
                                    <tbody>
                                    <tr>
                                        <td className="p-1" style={{width: 130, verticalAlign: "middle"}}>

                                            <div
                                                className="text-white p-2  h-100 py-3 d-flex flex-column justify-content-center align-items-center bg-danger"
                                                style={{maxWidth: 110, minWidth: 110}}><span
                                                className="fw-bold font-14">{new Date(assignment.startDate).toLocaleDateString()}</span><span
                                                className="fw-light font-12">{new Date(assignment.startDate).toLocaleTimeString()}</span>
                                            </div>
                                        </td>
                                        <td className="p-1">
                                            <p className="font-bold mb-0 font-14">{`${assignment.title}`}</p>
                                            <p className="mb-0 font-14">{`${assignment.moduleCode}: ${assignment.moduleName}`}</p>
                                            <p className="mb-0">SUBMISSION
                                                DEADLINE: {`${new Date(assignment.endDate).toLocaleString()}`}</p>

<p className="mb-0">POSSIBLE SCORE: {assignment.possibleScore}</p>


                                        </td>
                                    </tr>

                                    </tbody>
                                </table>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-sm table-bordered table-striped">
                                    <thead>
                                    <tr>
                                        <th/>
                                        <th>Reg Number</th>
                                        <th>Name</th>
                                        <th>Program</th>
                                        <th>Score</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        submitted.map(({
                                                           id,
                                                           regNumber,
                                                           first_name,
                                                           surname,
                                                           programCode,
                                                           level,
                                                           score,
                                                           filePath,
                                            sId
                                                       }, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <a href={filePath ? `${HOST_URL}/uploads/assignments/student-submissions/${filePath}` : '#'}
                                                           download={assignment.title}
                                                           target="_blank"
                                                           rel="noreferrer"
                                                           className={filePath ? "btn text-nowrap btn-danger text-white" : "btn text-nowrap disabled btn-danger text-white"}
                                                        >
                                                            <i className="fas fa-download me-2"/>
                                                            <span>SUBMITTED FILE</span>

                                                        </a>
                                                    </td>
                                                    <td>{regNumber}</td>
                                                    <td>{surname.toUpperCase()} {first_name.toUpperCase()}</td>
                                                    <td>{programCode} : {level} </td>
                                                    <td>
                                                        <form onSubmit={handleSubmit} className="d-flex justify-content-end">
                                                            <input defaultValue={sId} type={"hidden"}/>
                                                            <input disabled={!filePath} style={{minWidth: 120}} type="text" placeholder="Score"
                                                                   className="form-control p-0 border-0" name="topic"
                                                                   defaultValue={score}/>
                                                            <button disabled={!filePath} className="btn btn-danger text-white ms-2">
                                                                UPDATE
                                                            </button>
                                                        </form>


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
        </>
    )
}

export default StaffAssignmentView