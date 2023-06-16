import MainBreadcrumb from "../../components/breadcrumbs";
import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import AxiosInstance from "../../lib/AxiosInstance";
import AlertNotification from "../../components/AlertNotification";
import Loading from "../../components/Loading";

const StaffQuizView = () => {
    let params = useParams();

    const [quiz, setQuiz] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)
    const [submitted, setSubmitted] = useState([])

    useEffect(() => {
        async function fetchData() {

            try {
                setLoading(true)
                setError(null)
                let res = await AxiosInstance.get(`/staff/quiz/${params.id}`)
                setQuiz(res.data)

                let submittedRes = await AxiosInstance.get(`/staff/quiz/submitted/${params.id}`)
                //console.log(submittedRes.data)
                setSubmitted(submittedRes.data)
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
            <MainBreadcrumb text={`Staff Quiz`} icon={"puzzle-piece"}/>
            <div className="container-fluid">
                {
                    error && <AlertNotification type={'danger'} icon={"exclamation-triangle-fill"} msg={error}/>
                }
                <div className="row">
                    <div className="col-sm-12">
                        <div className="white-box">
                            <ul className="nav nav-pills nav-justified">
                                <li className="nav-item">
                                    <a className="nav-link active" data-bs-toggle="tab" href="#questions">
                                        Quiz
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" data-bs-toggle="tab" href="#submitted">Submitted</a>
                                </li>
                            </ul>

                            <div className="tab-content mt-2">
                                <div className="tab-pane active" id="questions" role="tabpanel"
                                     aria-labelledby="lectures-tab">
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
                                    <table className="table table-sm table-striped table-bordered">
                                        <thead>
                                        <tr>
                                            <th style={{width: 50}}>

                                            </th>
                                            <th>
                                                Question
                                            </th>
                                            <th style={{width: 50}}>
                                                Score
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
                                                            <td className="fw-bold">{questionText}</td>
                                                            <td className="text-center">[{possibleScore}]</td>
                                                        </tr>
                                                        {
                                                            quiz?.type === "MULTIPLE CHOICE" ?
                                                                <tr key={`st${index}`}>
                                                                    <td/>
                                                                    <td colSpan={2}>
                                                                        <span
                                                                            className="fw-bolder text-uppercase:">Answers</span>
                                                                        <ol>
                                                                            {
                                                                                answers.map(({
                                                                                                 answerText,
                                                                                                 correct
                                                                                             }, i) => {
                                                                                    return (
                                                                                        <li key={i}>{`${answerText} ${correct ? "(CORRECT)" : ''}`}</li>
                                                                                    )
                                                                                })
                                                                            }

                                                                        </ol>
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

                                </div>

                                <div className="tab-pane" id="submitted" role="tabpanel"
                                     aria-labelledby="lectures-tab">
                                    <div className="table-responsive">
                                        <table className="table table-sm table-bordered table-striped">
                                            <thead>
                                            <tr>
                                                <th/>
                                                <th>Reg Number</th>
                                                <th>Name</th>
                                                <th>Program</th>
                                                <th>Score</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                submitted.map(({id, regNumber, first_name, surname, programCode, level, score}, index) => {
                                                    return (
                                                        <tr>
                                                            <td>
                                                                <Link className="btn btn-danger text-white ms-auto"
                                                                   type="button" to={`/staff/personal/quiz/submitted/${id}`}
                                                                >
                                                                    <span>View</span>
                                                                </Link>
                                                            </td>
                                                            <td>{regNumber}</td>
                                                            <td>{surname} {first_name}</td>
                                                            <td>{programCode}:{level} </td>
                                                            <td>{score}</td>
                                                        </tr>
                                                    )

                                                })
                                            }


                                            </tbody>
                                        </table>
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

export default StaffQuizView