import {Formik} from "formik";
import * as yup from "yup";
import FormikError from "../../components/FormikError";
import AlertNotification from "../../components/AlertNotification";
import {useEffect, useState} from "react";
import Loading from "../../components/Loading";
import {useNavigate, useParams} from "react-router-dom";
import AxiosInstance from "../../lib/AxiosInstance";
import MainBreadcrumb from "../../components/breadcrumbs";

function formatDate(date) {
    return new Date(date).toLocaleString()
}

const validation_schema_without_Id = yup.object().shape({
    module: yup.string().required(),
    topic: yup.string().required("Topic is required"),
    startDate: yup.date().min(new Date(), ({min}) => `Start Date needs to be after ${formatDate(min)}!!`)
        .required("Start Date is required."),
    endDate: yup.date().min(
        yup.ref('startDate')
        ,
        ({min}) => `End Date needs to be after ${formatDate(min)}!!`,
    ).required("End Date is required."),
});
const validation_schema_with_Id = yup.object().shape({
    topic: yup.string().required("Topic is required"),
    startDate: yup.date().min(new Date(), ({min}) => `Start Date needs to be after ${formatDate(min)}!!`)
        .required("Start Date is required."),
    endDate: yup.date().min(
        yup.ref('startDate'),
        ({min}) => `Date needs to be after ${formatDate(min)}`,
    ).required("End Date is required."),
});

const initial_values_with_Id = {
    topic: '',
    startDate: new Date().toLocaleString(),
    endDate: new Date().toLocaleString()
}
const initial_values_without_Id = {
    module: '',
    topic: '',
    startDate: new Date().toLocaleString(),
    endDate: new Date().toLocaleString()
}


const StaffCreateLecture = ({}) => {
    let params = useParams();
    let navigate = useNavigate()

    const [error, setError] = useState(null)
    const [modules, setModules] = useState([])
    const [module, setModule] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                let res = await AxiosInstance.get('/staff/modules')
                setModules(res.data)

                if (params.id){
                    let modRes = await AxiosInstance.get(`/modules/${params.id}`)
                    setModule(modRes.data)
                }
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

    const handleLogin = async (values) => {
        setError(null)
        setLoading(true)
        let url;
        if (params.id){
            url = `/modules/${params.id}/lecture`
        }
        else {
            url = `/modules/${values.module}/lecture`
            delete values.module
        }
        try {
            await AxiosInstance.post(url, values)
            params.id ? navigate(`/staff/personal/modules/${params.id}`) : navigate('/staff/personal/lectures')
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
    return (
        <>
            {loading && <Loading/>}
            <MainBreadcrumb text={"New Lecture"} icon={"clock"}/>
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-auto">
                        <div className="card" style={{maxWidth: 600}}>
                        <div className="card-body">

                            <Formik
                                initialValues={params.id ? initial_values_with_Id : initial_values_without_Id}
                                validationSchema={params.id ? validation_schema_with_Id : validation_schema_without_Id}
                                onSubmit={async (values) => {
                                    console.log(values)
                                    await handleLogin(values)
                                }}
                            >
                                {({
                                      values,
                                      errors,
                                      touched,
                                      handleSubmit,
                                      handleChange,
                                      handleBlur
                                  }) => (
                                    <form onSubmit={handleSubmit} className="form-horizontal form-material">
                                        {
                                            error &&
                                            <AlertNotification type={'danger'} icon={"exclamation-triangle-fill"}
                                                               msg={error}/>
                                        }
                                        {!params.id &&
                                            <div className="form-group mb-4 mt-2">
                                            <label htmlFor="example-email"
                                                   className="col-md-12 p-0 font-weight-bold">
                                                Module
                                            </label>
                                            <div className="col-md-12 border-bottom p-0">
                                                <select
                                                    className="form-control p-0 border-0"
                                                    name="module"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.module}
                                                >
                                                    <option value={""}>----</option>
                                                    {
                                                        modules.map(({moduleName, moduleId, moduleCode}) => (
                                                            <option key={moduleId}
                                                                    value={moduleId}>{`${moduleCode}: ${moduleName}`}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                            <FormikError name={'module'} errors={errors} touched={touched}
                                                         help_text={"Required*"}/>
                                        </div>

                                        }

                                        {module && <h6 className="mb-4 fw-bold text-center">{`${module.moduleCode} - ${module.moduleName}`}</h6>}


                                        <div className="form-group mb-4 mt-2">
                                            <label htmlFor="example-email"
                                                   className="col-md-12 p-0 font-weight-bold">Topic</label>
                                            <div className="col-md-12 border-bottom p-0">
                                                <input
                                                    type="text"
                                                    placeholder="Topic Name"
                                                    className="form-control p-0 border-0"
                                                    name="topic"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.topic}
                                                />
                                            </div>
                                            <FormikError name={'topic'} errors={errors} touched={touched}
                                                         help_text={"Required*"}/>
                                        </div>

                                        <div className="form-group mb-4">
                                            <label className="col-md-12 p-0 font-weight-bold">Start Date</label>
                                            <div className="col-md-12 border-bottom p-0">
                                                <input
                                                    type="datetime-local"
                                                    className="form-control p-0 border-0"
                                                    name="startDate"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.startDate}
                                                />

                                            </div>
                                            <FormikError name={'startDate'} errors={errors} touched={touched}
                                                         help_text={"Required*"}/>
                                        </div>
                                        <div className="form-group mb-4">
                                            <label className="col-md-12 p-0 font-weight-bold">End Date</label>
                                            <div className="col-md-12 border-bottom p-0">
                                                <input
                                                    type="datetime-local"
                                                    className="form-control p-0 border-0"
                                                    name="endDate"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.endDate}
                                                />

                                            </div>
                                            <FormikError name={'endDate'} errors={errors} touched={touched}
                                                         help_text={"Required*"}/>
                                        </div>

                                        <div className="form-group mb-4">
                                            <button style={{width: 150}} type={"submit"}
                                                    className="btn btn-danger text-white">
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </Formik>

                        </div>
                    </div>
                    </div>
                </div>

            </div>
        </>

    )
}


export default StaffCreateLecture