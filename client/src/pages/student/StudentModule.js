import MainBreadcrumb from "../../components/breadcrumbs";
import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import AxiosInstance from "../../lib/AxiosInstance";
import AlertNotification from "../../components/AlertNotification";
import Loading from "../../components/Loading";

const StudentModule = () => {
    let params = useParams();

    const [module, setModule] = useState([])
    const [lectures, setLectures] = useState([])
    const [classes, setClasses] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)

    useEffect(() => {
        async function fetchData() {

            try {
                setLoading(true)
                let res = await AxiosInstance.get(`/modules/${params.id}`)
                let lecRes = await AxiosInstance.get(`modules/${params.id}/lecture`)
                let classRes = await AxiosInstance.get(`modules/${params.id}/classes`)
                setModule(res.data)
                setLectures(lecRes.data)
                setClasses(classRes.data)
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
                                    <a className="nav-link" data-bs-toggle="tab" href="#class">Module Mates</a>
                                </li>
                            </ul>

                            <div className="tab-content mt-2">
                                <div className="tab-pane active" id="lectures" role="tabpanel"
                                     aria-labelledby="lectures-tab">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <h5 className="box-title mb-0">Lectures</h5>
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
                                                            <td class="text-right">{new Date(startDate).toLocaleString()}</td>
                                                            <td class="text-right">{new Date(endDate).toLocaleString()}</td>

                                                        </tr>
                                                    )

                                                })

                                            }


                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="tab-pane" id="class" role="tabpanel"
                                     aria-labelledby="lectures-tab">
                                    {
                                        classes.map(({programName, programCode, level, students, ...item}) => {
                                            return (
                                                <>
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
                                                                students.map(({regNumber, first_name, surname, sex}, index)=>{
                                                                    return(
                                                                        <tr key={index}>
                                                                <td>{index + 1}</td>
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
                                                </>
                                            )
                                        })
                                    }

                                </div>
                                <div className="tab-pane" id="quiz" role="tabpanel"
                                     aria-labelledby="lectures-tab">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <h5 className="box-title mb-0">Quiz</h5>
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

export default StudentModule