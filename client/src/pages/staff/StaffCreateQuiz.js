import MainBreadcrumb from "../../components/breadcrumbs";
import {useEffect, useState} from "react";

import AlertNotification from "../../components/AlertNotification";
import Loading from "../../components/Loading";
import {useForm, useFieldArray} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import {reach, object, string, array, number, boolean} from "yup";
import * as yup from "yup";
import {Field, getIn} from "formik";
import AxiosInstance from "../../lib/AxiosInstance";
import {useNavigate} from "react-router-dom";
import {Notyf} from "notyf";
import 'notyf/notyf.min.css'


const notyf = new Notyf({dismissible: true, duration: 20000, position: {x: 'center', y: 'top'}});

const StaffCreateQuiz = () => {
    let navigate = useNavigate()

    const [quiz, setQuiz] = useState([])
    const [mcq, setMCQ] = useState(false)
    const [modules, setModules] = useState([])
    const [error, setErrors] = useState(null)
    const [loading, setLoading] = useState(null)

    function formatDate(date) {
        return new Date(date).toLocaleString()
    }

    const answerValidationSchema = object().shape({
        answerText: string().required('Answer Text is required'),
        correct: boolean().required('Correct is required')
    })

    const questionValidationSchema = object().shape({
        questionText: string().required('Question Text is required'),
        numberOfAnswers: number("Number Of Answers must be a number")
            .min(1, "Number Of Answers must be a number less or equal to 1")
            .required('Number of answers is required'),
        possibleScore: number("Possible Score must be a number")
            .min(1, "Possible Score must be a number less or equal to 1")
            .required('Possible Score is required'),
        answers: mcq ? array().of(answerValidationSchema).min(2, "A minimum of 2 answers is required for each question"): array().of(answerValidationSchema)
    })

    const validationSchema = object().shape({
        module: string().required("Module is required"),
        type: string().required("Type is required"),
        startAt: yup.date().min(new Date(), ({min}) => `Start Date needs to be after ${formatDate(min)}!!`)
            .required("Start Date is required."),
        submitBefore: yup.date().min(
            yup.ref('startAt')
            ,
            ({min}) => `Submission Deadline needs to be after ${formatDate(min)}!!`,
        ).required("Submission Deadline is required."),
        questions: array().of(questionValidationSchema).min(1, "A minimum of 1 question is required")
    });

    const formOptions = {resolver: yupResolver(validationSchema)};

    const {register, control, setError, handleSubmit, reset, formState, watch} = useForm(formOptions);
    const {errors,} = formState;
    const type = watch('type')
    const questionFieldArray = useFieldArray({name: 'questions', control});


    useEffect(() => {
        //console.log(type)
        async function fetchData(){
            try {
                setLoading(true)
                let res = await AxiosInstance.get(`/staff/modules`)
                setModules(res.data)
                //console.log(res.data)
            } catch (e) {
                //console.log(e)
                if (e.message)
                    setErrors(e.message)
                if (e.response.data) {
                    let {message, type} = e.response.data
                    setErrors(`${type}: ${message}`)
                }
            } finally {
                setLoading(false)
            }
        }
        if (type === "MULTIPLE CHOICE")
            setMCQ(true)
        else setMCQ(false)
        fetchData()
    }, [type]);

    async function onSubmit(data) {
        setErrors(null)
        setLoading(true)
        try {
            await AxiosInstance.post('/staff/quiz', data)
            notyf.success('Quiz added successfully');
            navigate('/staff/personal/quiz')
        } catch (e) {
            if (e.message) {
                setErrors(e.message)
                notyf.error(e.message);
            }
            if (e.response.data) {

                let {message, type} = e.response.data
                setErrors(`${type}: ${message}`)
                notyf.error(`${type}: ${message}`);
            }
        } finally {
            setLoading(false)
        }
    }

    //console.log(errors)

    return (
        <>
            {loading && <Loading/>}
            <MainBreadcrumb text={"Staff New Quiz"} icon={"puzzle-piece"}/>
            <div className="container-fluid">

                    <div className="row">
                        <div className="col-12">
                            <div className="card mx-auto" style={{maxWidth: 800, width: "100%"}}>
                                <div className="card-body">
                                    {
                    error && <AlertNotification type={'danger'} icon={"exclamation-triangle-fill"} msg={error}/>
                }
                                    <form onSubmit={handleSubmit(onSubmit)} className="form-horizontal form-material">
                                        <div className="row mb-4">
                                            <div className="col-md-6">
                                                <div className="form-group mb-4 mt-2">
                                                    <label htmlFor="module"
                                                           className="col-md-12 p-0 font-weight-bold">
                                                        Module
                                                    </label>
                                                    <div
                                                        className={`col-md-12 border-bottom p-0 ${errors.module ? 'is-invalid' : ''}`}>
                                                        <select
                                                            className={`form-control p-0 border-0`}
                                                            name="module"
                                                            {...register('module')}
                                                        >
                                                            <option value={""}>----</option>
                                                            {
                                                                modules.map((
                                                                    {
                                                                        moduleName,
                                                                        moduleId,
                                                                        moduleCode
                                                                    }) => (
                                                                    <option key={moduleId}
                                                                            value={moduleId}>{`${moduleCode}: ${moduleName}`}</option>

                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                    <div className="invalid-feedback">{errors.module?.message}</div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-4 mt-2">
                                                    <label htmlFor="startAt"
                                                           className="col-md-12 p-0 font-weight-bold">
                                                        Type
                                                    </label>
                                                    <div
                                                        className={`col-md-12 border-bottom p-0 ${errors.type ? 'is-invalid' : ''}`}>
                                                        <select
                                                            className={`form-control p-0 border-0`}
                                                            name="type"
                                                            {...register('type')}
                                                        >
                                                            <option value={""}>----</option>
                                                            <option value={"MULTIPLE CHOICE"}>MULTIPLE
                                                                CHOICE
                                                            </option>
                                                            <option value={"STRUCTURED"}>STRUCTURED</option>
                                                        </select>
                                                    </div>
                                                    <div className="invalid-feedback">{errors.type?.message}</div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-4 mt-2">
                                                    <label htmlFor="startAt"
                                                           className="col-md-12 p-0 font-weight-bold">
                                                        Starts At
                                                    </label>
                                                    <div
                                                        className={`col-md-12 border-bottom p-0 ${errors.startAt ? 'is-invalid' : ''}`}>
                                                        <input
                                                            className={`form-control p-0 border-0`}
                                                            name="startAt"
                                                            {...register('startAt')}
                                                            type="datetime-local"
                                                        />
                                                    </div>
                                                    <div className="invalid-feedback">{errors.startAt?.message}</div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-4 mt-2">
                                                    <label htmlFor="startAt"
                                                           className="col-md-12 p-0 font-weight-bold">
                                                        Submission Deadline
                                                    </label>
                                                    <div
                                                        className={`col-md-12 border-bottom p-0 ${errors.submitBefore ? 'is-invalid' : ''}`}>
                                                        <input
                                                            className={`form-control p-0 border-0`}
                                                            name="submitBefore"
                                                            {...register('submitBefore')}
                                                            type="datetime-local"
                                                        />
                                                    </div>
                                                    <div
                                                        className="invalid-feedback">{errors.submitBefore?.message}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <h5 className="fw-bold mb-0 text-center">Questions</h5>
                                         { errors.questions &&
                                                                <div className="invalid-feedback mb-4 mb-3 d-block text-center">{errors?.questions?.message}</div>
                                                            }
                                        {questionFieldArray.fields.map((question, index) => {
                                            return (
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
                                                                className={`col-md-12 border-bottom p-0 ${errors.questions?.[index]?.questionText ? 'is-invalid' : ''}`}>
                                                                <input
                                                                    className={'form-control  p-0 border-0'}
                                                                    name={`questions[${index}].questionText`}
                                                                    {...register(`questions[${index}].questionText`)}
                                                                />
                                                            </div>
                                                            <div
                                                                className="invalid-feedback">{errors.questions?.[index]?.questionText?.message}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group mb-4 mt-2">
                                                            <label htmlFor="module"
                                                                   className="col-md-12 p-0 font-weight-bold">
                                                                Number Of Answers
                                                            </label>
                                                            <div
                                                                className={`col-md-12 border-bottom p-0 ${errors.questions?.[index]?.numberOfAnswers ? 'is-invalid' : ''}`}>

                                                                <input
                                                                    type={"number"}
                                                                    min={1}
                                                                    defaultValue={1}
                                                                    className={'form-control  p-0 border-0'}
                                                                    style={{textAlign: "right"}}
                                                                    {...register(`questions[${index}].numberOfAnswers`)}
                                                                    name={`questions[${index}].numberOfAnswers`}
                                                                />
                                                            </div>
                                                            <div
                                                                className="invalid-feedback">{errors.questions?.[index]?.numberOfAnswers?.message}</div>

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
                                                                className={`col-md-12 border-bottom p-0 ${errors.questions?.[index]?.possibleScore ? 'is-invalid' : ''}`}>

                                                                <input
                                                                    type={"number"}
                                                                    min={1}
                                                                    className={'form-control  p-0 border-0'}
                                                                    style={{textAlign: "right"}}
                                                                    {...register(`questions[${index}].possibleScore`)}
                                                                    name={`questions[${index}].possibleScore`}
                                                                />
                                                            </div>
                                                            <div
                                                                className="invalid-feedback">{errors.questions?.[index]?.possibleScore?.message}</div>

                                                        </div>
                                                    </div>
                                                    {
                                                        mcq && <>

                                                        <h6 className="fw-bold mb-0 text-center text-info">Answers</h6>
                                                            { errors.questions?.[index]?.answers &&
                                                                <div className="invalid-feedback mb-3 d-block text-center">{errors?.questions?.[index]?.answers.message}</div>
                                                            }

                                                    {
                                                        question.answers.map((answer, i) => {
                                                            console.log(errors)
                                                            return (
                                                                <div className="col-md-6" key={i}>
                                                                    <div
                                                                        className="form-group mb-4 mt-2">
                                                                        <label htmlFor="module"
                                                                               className="col-md-12 p-0 fw-bold text-info">
                                                                            Answer {i + 1}:
                                                                        </label>
                                                                        <div className={"row"}>
                                                                          <div className="col">
                                                                              <div
                                                                            className={`col-12 border-bottom p-0 ${errors?.questions?.[index]?.answers?.[i]?.answerText ? 'is-invalid' : ''}`}>
                                                                            <input
                                                                                className={'form-control  p-0 border-0'}
                                                                                name={`questions[${index}].answers[${i}].answerText`}
                                                                                {...register(`questions[${index}].answers[${i}].answerText`)}
                                                                            />

                                                                        </div>
                                                                        <div className="invalid-feedback">{errors.questions?.[index]?.answers?.[i]?.answerText.message}</div>

                                                                          </div>
                                                                            <div className="col-auto">
                                                                                 <label>
                                                                                <input
                                                                                    {...register(`questions[${index}].answers[${i}].correct`)}
                                                                                    name={`questions[${index}].answers[${i}].correct`}
                                                                                    type="checkbox"
                                                                                />
                                                                                Correct
                                                                            </label>
                                                                            </div>
                                                                        </div>
                                                                        </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                        </>
                                                    }

                                                    <div className="col-12 d-flex">
                                                        {
                                                            mcq && <button
                                                            type="button"
                                                            className="btn btn-success text-white ms-auto"
                                                            onClick={() => {

                                                                let oldValue = question
                                                                oldValue.answers.push({answerText: "", correct: false})
                                                                questionFieldArray.update(index, oldValue)
                                                            }}
                                                        >
                                                            <i className="fas fa-times"/>
                                                            <span style={{marginLeft: 3}}>Add Answer</span>
                                                        </button>
                                                        }

                                                         <button
                                                            type="button"
                                                            className={`btn btn-danger text-white ${mcq ? 'ms-2' : 'ms-auto'}`}
                                                            onClick={() => {
                                                                questionFieldArray.remove(index)
                                                            }}
                                                        >
                                                            <i className="fas fa-times"/>
                                                            <span style={{marginLeft: 3}}>Remove Question</span>
                                                        </button>
                                                    </div>

                                                </div>
                                            )
                                        })}
                                        <button

                                            type="button"
                                            className="btn btn-success text-white ms-auto"
                                            onClick={() => questionFieldArray.append({
                                                questionText: "",
                                                numberOfAnswers: 1,
                                                possibleScore: 1,
                                                answers: []
                                            })}
                                        >
                                            <i className="fas fa-plus"/>
                                            <span style={{marginLeft: 3}}>New Question</span>
                                        </button>
                                        <div className="form-group mb-4 mt-3">
                                            <button type={"submit"}
                                                    className="btn w-100 btn-success text-white">
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

        </>
    )
}


export default StaffCreateQuiz
