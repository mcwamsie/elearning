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


const MAX_FILE_SIZE = 1024000; //100KB

const validFileExtensions = {file: ["zip", "plain", "rtf", "pdf", "jpeg", "png", "jpg", "ogg", "json", "csv"]};

function isValidFileType(fileName, fileType) {
    return fileName && validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1;
}

const validation_schema = yup.object().shape({
    file: yup
        .mixed()
        .required("File is required")
        .test("is-valid-type", "Not a valid file type",
            value => isValidFileType(value && value.name.toLowerCase(), "file"))
        .test("is-valid-size", "Max allowed size is 1MB",
            value => value && value.size <= MAX_FILE_SIZE)
});



const initial_values= {
    file: null,
}


const StudentAssignmentSubmission = ({}) => {
    let params = useParams();
    let navigate = useNavigate()
    // const fileRef = useRef(null);
    const [error, setError] = useState(null)
    const [assignment, setAssignment] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                let assignmentRes = await AxiosInstance.get(`/student/assignments/${params.id}`)
                setAssignment(assignmentRes.data)

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

    const handleSubmit = async (values) => {

        setError(null)
        setLoading(true)


        let url = `/student/assignments/${params.id}`

        try {
            const formData = new FormData();
            formData.append("file", values.file);
            let res = await AxiosInstance.post(url, formData)
            let {message} = res.data
            notyf.success(message)
            navigate('/student/personal/assignments')
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
            <MainBreadcrumb text={"Submit Assignment"} icon={"pencil-alt"}/>
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-auto">
                        <div className="card" style={{maxWidth: 800}}>
                            <div className="card-body">

                                <Formik
                                    initialValues={initial_values}
                                    validationSchema={ validation_schema}
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

                                            <h6 className="mb-4 fw-bold text-uppercase text-center">{`${assignment.title} - ${assignment.moduleName} (${assignment.moduleCode})`}</h6>


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
                                                <button disabled={loading || new Date(assignment.endDate) < new Date()} style={{width: 150}} type={"submit"}
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


export default StudentAssignmentSubmission