import MainBreadcrumb from "../../../components/breadcrumbs";

import {useEffect, useState} from "react";
import Loading from "../../../components/Loading";
import {Link} from "react-router-dom";
import AxiosInstance from "../../../lib/AxiosInstance";
import AlertNotification from "../../../components/AlertNotification";


const StaffConfigAllStudents = () => {
    const [students, setStudents] = useState([])
   const [loading, setLoading] = useState(null)
    const [error, setError] = useState(null)
    useEffect(() => {
        async function fetchData() {

            try {
                setLoading(true)
                let res = await AxiosInstance.get(`/student`)
                //console.log(res.data)
                setStudents(res.data)
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
            <MainBreadcrumb text={"Configuration: All Students"} icon={"book"}/>

            <div className="container-fluid">
                {
                    error && <AlertNotification type={'danger'} icon={"exclamation-triangle-fill"} msg={error}/>
                }
                <div className="card h-100">
                    <div className="card-heading d-flex align-items-center p-2 justify-content-between bg-dark text-white">
                        <h6 className="mb-0">All Students</h6>
                        <Link className="btn btn-light" to="/staff/personal/config/students/new">
                            <i className="fas fa-plus-circle"/>
                            <span className="ms-2">New Student</span>
                        </Link>
                    </div>
                    <div className="card-body p-2">
                        <div className="table-responsive">
                            <table className="table table-sm table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th style={{width: 40}}/>
                                        <th>Reg No.</th>
                                        <th>Full Name</th>
                                        <th>Sex</th>
                                        <th>Program</th>
                                        <th>Level</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    students.map(({id, first_name, level, surname, sex, programCode, regNumber}, index)=>(
                                        <tr key={index}>
                                            <td>
                                                <Link className="btn btn-danger text-white ms-auto" type="button"
                                                   to={`/staff/personal/config/students/${id}`}>
                                                    <span>View</span>
                                                </Link>
                                            </td>
                                            <td>{regNumber}</td>
                                            <td>
                                                {
                                                   first_name.toUpperCase()+" "+
                                                   surname.toUpperCase()
                                                }
                                            </td>
                                            <td>
                                                {sex}
                                            </td>
                                            <td>
                                                {programCode}
                                            </td>
                                            <td className="text-right">
                                                {level}
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
        </>
    )
}

export default StaffConfigAllStudents