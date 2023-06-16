import Loading from "../../components/Loading";
import MainBreadcrumb from "../../components/breadcrumbs";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import AxiosInstance from "../../lib/AxiosInstance";
import AlertNotification from "../../components/AlertNotification";
import {HOST_URL} from "../../lib/constants";
import {connect} from "react-redux";

const StudentLectures = ({profile}) => {
    let navigate = useNavigate()

    const [error, setError] = useState(null)
    const [lectures, setLectures] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                let res = await AxiosInstance.get('/student/lectures')
                setLectures(res.data)

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
            <MainBreadcrumb text={"Lectures"} icon={"clock"}/>
            <div className="container-fluid">
                {
                    error && <AlertNotification type={'danger'} icon={"exclamation-triangle-fill"} msg={error}/>
                }
                <div className="row">
                    <div className="col-12 mb-4">
                        <div className="card h-100">
                            <div
                                className="card-heading p-2 d-flex align-items-center justify-content-between bg-dark text-white">
                                <h6 className="mb-0">Upcoming Lectures</h6>
                            </div>
                            <div className="card-body p-2">
                                <div>
                                    <table className="table table-sm">
                                        <tbody>
                                        {
                                            lectures.map(({topic, moduleCode, moduleName, startDate, lectureCode}) => (
                                                <tr>
                                                    <td className="p-1" style={{width: 130, verticalAlign: "middle"}}>
                                                        <div
                                                            className="text-white p-2  h-100 py-3 d-flex flex-column justify-content-center align-items-center bg-danger"
                                                            style={{maxWidth: 120, minWidth: 120}}>
                                                            <span className="fw-bold font-14">{new Date(startDate).toLocaleDateString()} </span>
                                                            <span className="fw-light font-12">{new Date(startDate).toLocaleTimeString()}</span></div>
                                                    </td>
                                                    <td className="p-1">
                                                        <p className="font-bold mb-0 font-14">{`${moduleCode.toUpperCase()}: ${moduleName.toUpperCase()}`}</p>
                                                        <p className="mb-0">{topic}</p>
                                                        <hr/>
                                                        <a href={`${HOST_URL}/room/student-link?roomId=${lectureCode}&studentId=${profile.id}`} style={{width: 120}}
                                                                className="btn btn-danger text-white ms-auto"
                                                                type="button">

                                                            <span>Join</span>
                                                            <i className="fas fa-chevron-right ms-2"/>
                                                        </a>
                                                    </td>

                                                </tr>

                                            ))
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
export default connect(map_state_to_props, {})(StudentLectures)