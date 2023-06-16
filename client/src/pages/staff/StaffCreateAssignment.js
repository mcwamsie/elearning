import {Formik} from "formik";
import * as yup from "yup";
import FormikError from "../../components/FormikError";
import AlertNotification from "../../components/AlertNotification";
import {useEffect, useState} from "react";
import Loading from "../../components/Loading";
import {useNavigate, useParams} from "react-router-dom";
import AxiosInstance from "../../lib/AxiosInstance";
import MainBreadcrumb from "../../components/breadcrumbs";
import notyf from "../../notyf";

function formatDate(date) {
    return new Date(date).toLocaleString()
}

const MAX_FILE_SIZE = 1024000; //100KB

const validFileExtensions = {file: ["zip", "plain", "rtf", "pdf", "jpeg", "png", "jpg", "ogg", "json", "csv"]};

function isValidFileType(fileName, fileType) {
    return fileName && validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1;
}

const validation_schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    startDate: yup.date().min(new Date(), ({min}) => `Start Date needs to be after ${formatDate(min)}!!`)
        .required("Start Date is required."),
    possibleScore: yup.number().required("Possible Score is required"),
    endDate: yup.date().min(
        yup.ref('startDate'),
        ({min}) => `Date needs to be after ${formatDate(min)}`,
    ).required("End Date is required."),
    file: yup.mixed()
        .required("Required")
        .test("is-valid-type", "Not a valid file type",
            value => isValidFileType(value && value.name.toLowerCase(), "file"))
        .test("is-valid-size", "Max allowed size is 100KB",
            value => value && value.size <= MAX_FILE_SIZE)
});

const initial_values = {
    title: '',
    file: null,
    possibleScore: 0,
    startDate: new Date().toLocaleString(),
    endDate: new Date().toLocaleString()
}

const StaffCreateAssignment = ({}) => {
    let params = useParams();
    let navigate = useNavigate()
    // const fileRef = useRef(null);
    const [error, setError] = useState(null)
    const [module, setModule] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                if (params.id) {
                    let modRes = await AxiosInstance.get(`/modules/${params.id}`)
                    setModule(modRes.data)
                }
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

        fetchData()
    }, [])

    const handleSubmit = async (values) => {

        setError(null)
        setLoading(true)


        let url;
        if (params.id) {
            url = `/modules/${params.id}/assignment`
        } else {
            url = `/modules/${values.module}/assignment`
            delete values.module
        }
        try {
            const formData = new FormData();
            formData.append("file", values.file);
            formData.append("startDate", values.startDate);
            formData.append("possibleScore", values.possibleScore);
            formData.append("endDate", values.endDate);
            formData.append("title", values.title);

            let res = await AxiosInstance.post(url, formData)
            let {message} = res.data
            notyf.success(message)
            navigate(`/staff/personal/modules/${params.id}`)
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

    return (
        <>
            {loading && <Loading/>}
            <MainBreadcrumb text={"New Assignment"} icon={"pencil-alt"}/>
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-auto">
                        <div className="card" style={{maxWidth: 800}}>
                            <div className="card-body">

                                <Formik
                                    initialValues={initial_values}
                                    validationSchema={validation_schema}
                                    onSubmit={async (values) => {
                                        await handleSubmit(values)
                                    }}
                                >
                                    {({
                                          values,
                                          errors,
                                          touched,
                                          handleSubmit,
                                          handleChange,
                                          handleBlur,
                                          setFieldValue
                                      }) => (
                                        <form onSubmit={handleSubmit} className="form-horizontal form-material">
                                            {
                                                error &&
                                                <AlertNotification type={'danger'} icon={"exclamation-triangle-fill"}
                                                                   msg={error}/>
                                            }

                                            {module &&
                                            <h6 className="mb-4 fw-bold text-center">{`${module.moduleCode} - ${module.moduleName}`}</h6>}


                                            <div className="form-group mb-4 mt-2">
                                                <label htmlFor="example-email"
                                                       className="col-md-12 p-0 font-weight-bold">Title</label>
                                                <div className="col-md-12 border-bottom p-0">
                                                    <input
                                                        type="text"
                                                        placeholder="Assignment Title"
                                                        className="form-control p-0 border-0"
                                                        name="title"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.title}
                                                    />
                                                </div>
                                                <FormikError name={'title'} errors={errors} touched={touched}
                                                             help_text={"Required*"}/>
                                            </div>
                                            <div className="form-group mb-4 mt-2">
                                                <label htmlFor="example-email"
                                                       className="col-md-12 p-0 font-weight-bold">Possible Score</label>
                                                <div className="col-md-12 border-bottom p-0">
                                                    <input
                                                        type="number"
                                                        placeholder="Possible Score"
                                                        className="form-control p-0 border-0"
                                                        name="possibleScore"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.possibleScore}
                                                    />
                                                </div>
                                                <FormikError name={'possibleScore'} errors={errors} touched={touched}
                                                             help_text={"Required*"}/>
                                            </div>
                                            <div className="form-group mb-4 mt-2">
                                                <label htmlFor="example-email"
                                                       className="col-md-12 p-0 font-weight-bold">File</label>
                                                <div className="col-md-12 border-bottom p-0">
                                                    <input
                                                        type="file"
                                                        placeholder="Question File"
                                                        className="form-control p-0 border-0"
                                                        name="file"
                                                        onChange={(event) => {
                                                            setFieldValue("file", event.currentTarget.files[0]);
                                                        }}
                                                        onBlur={handleBlur}
                                                    />
                                                </div>
                                                <FormikError name={'file'} errors={errors} touched={touched}
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


export default StaffCreateAssignment