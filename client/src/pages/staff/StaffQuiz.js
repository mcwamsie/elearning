import MainBreadcrumb from "../../components/breadcrumbs";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import AxiosInstance from "../../lib/AxiosInstance";
import AlertNotification from "../../components/AlertNotification";
import Loading from "../../components/Loading";


const StaffQuiz = () => {

    const [quiz, setQuiz] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                let res = await AxiosInstance.get('/staff/quiz')
                setQuiz(res.data)
                //console.log(res.data)
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
            <MainBreadcrumb text={"Staff Quiz"} icon={"puzzle-piece"}/>
            <div className="container-fluid">
                {
                    error && <AlertNotification type={'danger'} icon={"exclamation-triangle-fill"} msg={error}/>
                }
                <div className="row">
                    <div className="col-12 mb-4">
                        <div className="card h-100">
                            <div
                                className="card-heading p-2 d-flex align-items-center justify-content-between bg-dark text-white">
                                <h6 className="mb-0">Upcoming Quiz</h6>
                                <Link className="btn btn-light" to={"/staff/personal/quiz/new"}>
                                    <i  className="fas fa-plus-circle"/>
                                    <span className="ms-2">New Quiz</span>
                                </Link>
                            </div>
                            <div className="card-body p-2">
                                <div>
                                    <table className="table table-sm">
                                        <tbody>
                                        {
                                            quiz.map(({moduleName, id, moduleCode, type,startAt, submitBefore}, i)=>{
                                                return(
                                                    <tr key={i}>
                                            <td className="p-1" style={{width: 130, verticalAlign: "middle"}}>

                                                <div
                                                    className="text-white p-2  h-100 py-3 d-flex flex-column justify-content-center align-items-center bg-danger"
                                                    style={{maxWidth: 110, minWidth: 110}}><span
                                                    className="fw-bold font-14">{new Date(startAt).toLocaleDateString()}</span><span
                                                    className="fw-light font-12">{new Date(startAt).toLocaleTimeString()}</span>
                                                </div>
                                            </td>
                                            <td className="p-1">
                                                <p className="font-bold mb-0 font-14">{`${moduleCode}: ${moduleName}`}</p>
                                                <p className="mb-0">Submit Time: {`${new Date(submitBefore).toLocaleString()}`}</p>
                                                <hr/>
                                                <Link to={`/staff/personal/quiz/${id}`} className="btn btn-danger text-white ms-auto" type="button" style={{width: 120}}>
                                                    <span>View</span>
                                                    <i className="fas fa-chevron-right ms-2"/>
                                                </Link>
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

export default StaffQuiz