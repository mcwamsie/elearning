import MainBreadcrumb from "../../components/breadcrumbs";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import AxiosInstance from "../../lib/AxiosInstance";
import AlertNotification from "../../components/AlertNotification";
import Loading from "../../components/Loading";
import {useFieldArray, useForm} from "react-hook-form";
import {Notyf} from "notyf";
import 'notyf/notyf.min.css'


const notyf = new Notyf({dismissible: true, duration: 20000, position: {x: 'center', y: 'top'}});

const StudentQuizEntry = () => {
    let params = useParams();
    let navigate = useNavigate()

    const [quiz, setQuiz] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)


    const {register, control, handleSubmit, watch, formState: {errors}} = useForm();
    const onSubmit = async data => {
        let {questions} = quiz
        //console.log(data)

       //console.log(questions)
        let values = Object.values(data)
        let newData = []
        for (let i = 0; i < values[0].length; i++){
            newData.push({
                id: questions[i].id,
                values: values[0][i]
            })

        }
        setError(null)
        setLoading(true)
        try {
            await AxiosInstance.post(`/student/quiz/submit/${quiz.id}`, newData)
            notyf.success('Quiz added successfully');
            navigate(`/student/personal/quiz/submitted/${quiz.id}`)
        } catch (e) {
            if (e.message) {
                setError(e.message)
                notyf.error(e.message);
            }
            if (e.response.data) {

                let {message, type} = e.response.data
                setError(`${type}: ${message}`)
                notyf.error(`${type}: ${message}`);
            }
        } finally {
            setLoading(false)
        }
       // console.log(newData)
    };
    //console.log(errors)
    const questionFieldArray = useFieldArray({name: 'questions', control});
    useEffect(() => {
        async function fetchData() {

            try {
                setLoading(true)
                setError(null)
                let res = await AxiosInstance.get(`/student/quiz/${params.id}`)
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
            <MainBreadcrumb text={`Student Quiz`} icon={"puzzle-piece"}/>
            <div className="container-fluid">
                {
                    error && <AlertNotification type={'danger'} icon={"exclamation-triangle-fill"} msg={error}/>
                }
                <div className="row">
                    <div className="col-sm-12">
                        <div className="white-box">
                            <div className="table-responsive">
                                <table className="table table-sm table-bordered">
                                    <tbody>
                                    <tr>
                                        <td className="p-1" style={{width: 130, verticalAlign: "middle"}}>

                                            <div
                                                className="text-white p-2  h-100 py-3 d-flex flex-column justify-content-center align-items-center bg-danger"
                                                style={{maxWidth: 110, minWidth: 110}}><span
                                                className="fw-bold font-14">{new Date(quiz.startAt).toLocaleDateString()}</span><span
                                                className="fw-light font-12">{new Date(quiz.startAt).toLocaleTimeString()}</span>
                                            </div>
                                        </td>
                                        <td className="p-1">
                                            <p className="font-bold mb-0 font-14">{`${quiz.moduleCode}: ${quiz.moduleName}`}</p>
                                            <p className="mb-0">SUBMISSION
                                                DEADLINE: {`${new Date(quiz.submitBefore).toLocaleString()}`}</p>
                                            <p className="mb-0">TYPE: {`${quiz.type?.toUpperCase()}`}</p>


                                        </td>
                                    </tr>

                                    </tbody>
                                </table>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className={"form"}>
                                <table className="table table-sm table-striped table-bordered">
                                    <thead>
                                    <tr>
                                        <th style={{width: 50}}>

                                        </th>
                                        <th>
                                            Question
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        quiz?.questions?.map(({
                                                                  questionText,
                                                                  possibleScore,
                                                                  answers,
                                                                  numberOfAnswers
                                                              }, index) => {
                                            return (
                                                <>
                                                    <tr key={`t${index}`}>
                                                        <td>{index + 1}</td>
                                                        <td className="fw-bold">{questionText}
                                                            <br/>
                                                            {errors.questions?.[index]?.type === "required" &&
                                                        <span className="d-inline-block invalid-feedback">{`Answer(s) For Question ${index+1} is required`}</span>

                                                    }

                                                        </td>


                                                    </tr>
                                                    {
                                                        quiz?.type === "MULTIPLE CHOICE" ?
                                                            <tr key={`st${index}`}>
                                                                <td/>
                                                                <td colSpan={2}>
                                                                    <span className="fw-bold">Answers:</span>
                                                                    {
                                                                        numberOfAnswers > 1 ?
                                                                            <fieldset className="form-group">
                                                                                {
                                                                                    answers.map(({
                                                                                                     answerText,
                                                                                                     id
                                                                                                 }, j) => {
                                                                                        return (
                                                                                            <div className={`form-check`}>
                                                                                                <label htmlFor="burger">
                                                                                                    <input
                                                                                                        {...register(`questions[${index}]`, {required: true})}
                                                                                                        type="checkbox"
                                                                                                        name={`questions[${index}]`}
                                                                                                        value={id}
                                                                                                        className="form-check-input"
                                                                                                        id={`question?.[${index}]`}
                                                                                                    />{' '}
                                                                                                    {answerText}
                                                                                                </label>
                                                                                            </div>
                                                                                        )
                                                                                    })
                                                                                }


                                                                            </fieldset>
                                                                            :
                                                                            <fieldset className="form-group">
                                                                                {
                                                                                    answers.map(({
                                                                                                     answerText,
                                                                                                     id
                                                                                                 }, j) => {
                                                                                        return (
                                                                                            <div className="form-check">
                                                                                                <label htmlFor="burger">
                                                                                                    <input
                                                                                                        {...register(`questions[${index}]`, {required: true})}
                                                                                                        type="radio"
                                                                                                        name={`questions[${index}]`}
                                                                                                        value={id}
                                                                                                        className="form-check-input"
                                                                                                        id="burger"
                                                                                                    />{' '}
                                                                                                    {answerText}
                                                                                                </label>
                                                                                            </div>
                                                                                        )
                                                                                    })
                                                                                }


                                                                            </fieldset>
                                                                    }
                                                                </td>
                                                            </tr> :
                                                            <tr key={`st5${index}`}>
                                                                <td/>
                                                                <td colSpan={2}>
                                                                    <span className="fw-bolder text-uppercase:">POSSIBLE ANSWERS: {numberOfAnswers}</span>
                                                                </td>
                                                            </tr>
                                                    }



                                                </>
                                            )
                                        })
                                    }

                                    </tbody>
                                </table>

                                <button type="submit" className="btn btn-dark mt-4">
                                    Submit
                                </button>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StudentQuizEntry