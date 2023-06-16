import MainBreadcrumb from "../../components/breadcrumbs";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import AxiosInstance from "../../lib/AxiosInstance";
import AlertNotification from "../../components/AlertNotification";
import Loading from "../../components/Loading";
import {getRandomColor} from "../../lib/constants";

const StudentModules = () => {

    const [modules, setModules] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                let res = await AxiosInstance.get('/student/modules')
                setModules(res.data)
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
            <MainBreadcrumb text={"Student Modules"} icon={"book"}/>
            <div className="container-fluid">
                {
                    error && <AlertNotification type={'danger'} icon={"exclamation-triangle-fill"} msg={error}/>
                }
                <div className="row justify-content-center">
                    {
                        modules.map(({moduleName, moduleCode, moduleId}, index) => {
                            return (
                                <Link key={index} to={`/student/personal/modules/${moduleId}`} className="col-md-auto col-sm-6">
                                    <div style={{
                                        height: 150,
                                        minWidth: 240,
                                        padding: 15,
                                        position: "relative",
                                        backgroundColor: "#" + getRandomColor()
                                    }}
                                         className="white-box text-white analytics-info">
                                        <h2 className="box-title">{moduleCode}</h2>
                                        <i style={{
                                            position: "absolute",
                                            opacity: .8,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            right: 25
                                        }} className="fas fa-users fa-4x"/>
                                        <span style={{
                                            fontSize: 11,
                                            position: "absolute",
                                            bottom: 15
                                        }}>{moduleName.toUpperCase()}</span>
                                    </div>
                                </Link>
                            )
                        })
                    }

                </div>
            </div>
        </>
    )
}

export default StudentModules