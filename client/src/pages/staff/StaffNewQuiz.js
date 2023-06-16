import MainBreadcrumb from "../../components/breadcrumbs";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import * as yup from "yup"
import AxiosInstance from "../../lib/AxiosInstance";
import AlertNotification from "../../components/AlertNotification";
import Loading from "../../components/Loading";
import FormikError from "../../components/FormikError";
import {FieldArray, Field, Form, Formik, getIn} from "formik";
import {reach, object, string, array, number} from "yup";

function formatDate(date) {
    return new Date(date).toLocaleString()
}


const questionValidationSchema = object().shape({
    questionText: string().required('Question Text is required'),
    numberOfAnswers: number().required('Number of answers is required'),
    possibleScore: number().required('Possible Score is required')
})


const validationSchema = object().shape({
    module: string().required("Module is required"),
    type: string().required("Type is required"),
    startAt: yup.date().min(new Date(), ({min}) => `Start Date needs to be after ${formatDate(min)}!!`)
        .required("Start Date is required."),
    submitBefore: yup.date().min(
        yup.ref('startAt')
        ,
        ({min}) => `Submit Deadline needs to be after ${formatDate(min)}!!`,
    ).required("End Date is required."),
    questions: array().of(questionValidationSchema)
});
let initial_values = {
    module: '',
    type: '',
    startAt: "",
    submitBefore: "",
    questions: [
        {
            questionText: "",
            numberOfAnswers: "",
            possibleScore: ""
        }
    ],

};


const StaffNewQuiz = () => {

    const [quiz, setQuiz] = useState([])
    const [modules, setModules] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                // let res = await AxiosInstance.get('/staff/modules')
                //setQuiz(res.data)
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
        console.log(values)
    }

    return (
        <>
            {loading && <Loading/>}
            <MainBreadcrumb text={"Staff New Quiz"} icon={"puzzle-piece"}/>
            <div className="container-fluid">
                {
                    error && <AlertNotification type={'danger'} icon={"exclamation-triangle-fill"} msg={error}/>
                }
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="card mx-auto" style={{maxWidth: 600, width: "100%"}}>
                                <div className="card-body">
                                    <Formik
                                        initialValues={initial_values}
                                        validationSchema={validationSchema}
                                        onSubmit={async (values) => {
                                            //console.log(values)
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
                                          }) => {
                                            return (
                                                <Form onSubmit={handleSubmit} className="form-horizontal form-material">
                                                    {
                                                        error &&
                                                        <AlertNotification type={'danger'}
                                                                           icon={"exclamation-triangle-fill"}
                                                                           msg={error}/>
                                                    }

                                                    <div className="row mb-4">
                                                        <div className="col-md-6">
                                                            <div className="form-group mb-4 mt-2">
                                                                <label htmlFor="module"
                                                                       className="col-md-12 p-0 font-weight-bold">
                                                                    Module
                                                                </label>
                                                                <div className="col-md-12 border-bottom p-0">
                                                                    <Field
                                                                        className="form-control p-0 border-0"
                                                                        name="module"
                                                                        as="select"
                                                                    >
                                                                        <option value={""}>----</option>
                                                                        {
                                                                            modules.map(({
                                                                                             moduleName,
                                                                                             moduleId,
                                                                                             moduleCode
                                                                                         }) => (
                                                                                <option key={moduleId}
                                                                                        value={moduleId}>{`${moduleCode}: ${moduleName}`}</option>
                                                                            ))
                                                                        }
                                                                    </Field>
                                                                </div>
                                                                <FormikError name={'module'} errors={errors}
                                                                             touched={touched}
                                                                             help_text={"Required*"}/>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group mb-4 mt-2">
                                                                <label htmlFor="startAt"
                                                                       className="col-md-12 p-0 font-weight-bold">
                                                                    Type
                                                                </label>
                                                                <div className="col-md-12 border-bottom p-0">
                                                                    <Field
                                                                        className="form-control p-0 border-0"
                                                                        name="type"
                                                                        as="select"
                                                                    >
                                                                        <option value={""}>----</option>
                                                                        <option value={"MULTIPLE CHOICE"}>MULTIPLE
                                                                            CHOICE
                                                                        </option>
                                                                        <option value={"STRUCTURED"}>STRUCTURED</option>
                                                                        <option value={"ESSAY"}>ESSAY</option>

                                                                    </Field>
                                                                </div>
                                                                <FormikError name={'type'} errors={errors}
                                                                             touched={touched}
                                                                             help_text={"Required*"}/>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group mb-4 mt-2">
                                                                <label htmlFor="startAt"
                                                                       className="col-md-12 p-0 font-weight-bold">
                                                                    Starts At
                                                                </label>
                                                                <div className="col-md-12 border-bottom p-0">
                                                                    <Field
                                                                        className="form-control p-0 border-0"
                                                                        name="startAt"
                                                                        type="datetime-local"
                                                                    />
                                                                </div>
                                                                <FormikError name={'startAt'} errors={errors}
                                                                             touched={touched}
                                                                             help_text={"Required*"}/>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group mb-4 mt-2">
                                                                <label htmlFor="startAt"
                                                                       className="col-md-12 p-0 font-weight-bold">
                                                                    Submission Deadline
                                                                </label>
                                                                <div className="col-md-12 border-bottom p-0">
                                                                    <Field
                                                                        className="form-control p-0 border-0"
                                                                        name="submitBefore"
                                                                        type="datetime-local"
                                                                    />
                                                                </div>
                                                                <FormikError name={'submitBefore'} errors={errors}
                                                                             touched={touched}
                                                                             help_text={"Required*"}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h5 className="mb-4 fw-bold mb-4 text-center">Questions</h5>
                                                    <div className="row mb-4">
                                                        <FieldArray
                                                            name="questions"
                                                            render={arrayHelpers => {
                                                                console.log(errors)
                                                                return (
                                                                    <div>
                                                                        {values.questions.map((question, index) => (
                                                                            <div className="row" key={index}>
                                                                                <div className="col-12">
                                                                                    <h5 className="mb-4 fw-bold mb-4">Questions {index + 1}.</h5>
                                                                                </div>
                                                                                <div className="col-12">
                                                                                    <div
                                                                                        className="form-group mb-4 mt-2">
                                                                                        <label htmlFor="module"
                                                                                               className="col-md-12 p-0 font-weight-bold">
                                                                                            Question Text
                                                                                        </label>
                                                                                        <div
                                                                                            className="col-md-12 border-bottom p-0">
                                                                                            <Field
                                                                                                className={'form-control  p-0 border-0'}
                                                                                                name={`questions[${index}].questionText`}/>
                                                                                        </div>
                                                                                        {
                                                                                            errors?.questions?.length > index && touched?.questions?.length &&
                                                                                                <small className={
                                                                                            getIn(errors, `errors.questions.[${index}].questionText`)

                                                                                            && getIn(touched, `touched.questions.[${index}].questionText`) ?
                                                                                                "form-text text-danger"
                                                                                                : "form-text text-muted opacity-0"
                                                                                        }
                                                                                        >
                                                                                            {
                                                                                                errors?.questions?.[index].questionText && touched?.questions?.[index].questionText ?
                                                                                                    errors.questions[index].questionText :
                                                                                                    "Required*"
                                                                                            }
                                                                                        </small>

                                                                                        }

                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <div
                                                                                        className="form-group mb-4 mt-2">
                                                                                        <label htmlFor="module"
                                                                                               className="col-md-12 p-0 font-weight-bold">
                                                                                            Number Of Answers
                                                                                        </label>
                                                                                        <div
                                                                                            className="col-md-12 border-bottom p-0">

                                                                                            <Field
                                                                                                type={"number"}
                                                                                                className={'form-control  p-0 border-0'}
                                                                                                style={{textAlign: "right"}}
                                                                                                name={`questions[${index}].numberOfAnswers`}/>
                                                                                        </div>
                                                                                        {
                                                                                            errors?.questions?.length > index && touched?.questions?.length &&
                                                                                        <small className={
                                                                                            errors?.questions?.[index].numberOfAnswers && touched?.questions?.[index].numberOfAnswers ?
                                                                                                "form-text text-danger"
                                                                                                : "form-text text-muted opacity-0"
                                                                                        }
                                                                                        >
                                                                                            {
                                                                                                errors?.questions?.[index].numberOfAnswers && touched?.questions?.[index].numberOfAnswers ?
                                                                                                    errors.questions[index].numberOfAnswers :
                                                                                                    "Required*"
                                                                                            }
                                                                                        </small>}

                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <div
                                                                                        className="form-group mb-4 mt-2">
                                                                                        <label htmlFor="module"
                                                                                               className="col-md-12 p-0 font-weight-bold">
                                                                                            Possible Score
                                                                                        </label>
                                                                                        <div
                                                                                            className="col-md-12 border-bottom p-0">

                                                                                            <Field
                                                                                                type={"number"}
                                                                                                className={'form-control  p-0 border-0'}
                                                                                                style={{textAlign: "right"}}
                                                                                                name={`questions[${index}].possibleScore`}/>
                                                                                        </div>
                                                                                        {
                                                                                            errors?.questions?.length > index && touched?.questions?.length &&
                                                                                            <small className={
                                                                                                errors?.questions?.[index].possibleScore && touched?.questions?.[index].possibleScore ?
                                                                                                    "form-text text-danger"
                                                                                                    : "form-text text-muted opacity-0"
                                                                                            }
                                                                                            >
                                                                                                {
                                                                                                    errors?.questions?.[index].possibleScore && touched?.questions?.[index].possibleScore ?
                                                                                                        errors.questions[index].possibleScore :
                                                                                                        "Required*"
                                                                                                }
                                                                                            </small>
                                                                                        }

                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-12 d-flex">
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-dark text-white ms-auto"
                                                                                        onClick={() => arrayHelpers.remove(index)}
                                                                                    >
                                                                                        <i className="fas fa-times"/>
                                                                                        <span style={{marginLeft: 3}}>Remove Question</span>
                                                                                    </button>
                                                                                </div>

                                                                            </div>
                                                                        ))}
                                                                        <button

                                                                            type="button"
                                                                            className="btn btn-danger text-white ms-auto"
                                                                            onClick={() => arrayHelpers.push({
                                                                                questionText: "",
                                                                                numberOfAnswers: "",
                                                                                possibleScore: ""
                                                                            })}
                                                                        >
                                                                            <i className="fas fa-plus"/>
                                                                                        <span style={{marginLeft: 3}}>New Question</span>
                                                                        </button>
                                                                    </div>
                                                                )
                                                            }}
                                                        />
                                                    </div>


                                                    <div className="form-group mb-4">
                                                        <button type={"submit"}
                                                                className="btn w-100 btn-danger text-white">
                                                            Login
                                                        </button>
                                                    </div>
                                                </Form>
                                            )
                                        }}
                                            </Formik>
                                            </div>
                                            </div>
                                            </div>
                                            </div>
                                            </div>
                                            </div>
                                            </>
                                            )
                                        }


export default StaffNewQuiz
