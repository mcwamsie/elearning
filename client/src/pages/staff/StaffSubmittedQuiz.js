import MainBreadcrumb from "../../components/breadcrumbs";
import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import AxiosInstance from "../../lib/AxiosInstance";
import AlertNotification from "../../components/AlertNotification";
import Loading from "../../components/Loading";

const StaffSubmittedQuiz = () => {
    let params = useParams();

    const [quiz, setQuiz] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)


    useEffect(() => {
        async function fetchData() {

            try {
                setLoading(true)
                setError(null)
                let res = await AxiosInstance.get(`/staff/quiz/submitted-answers/${params.id}`)
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
            <MainBreadcrumb text={`Staff Submitted Quiz`} icon={"puzzle-piece"}/>
            <div className="container-fluid">
                {
                    error && <AlertNotification type={'danger'} icon={"exclamation-triangle-fill"} msg={error}/>
                }
                <div className="row">
                    <div className="col-sm-12">
                        <div className="white-box">


                            <div className="tab-pane active" id="questions" role="tabpanel"
                                     aria-labelledby="lectures-tab">
                                    <div className="table-responsive">
                                        <table className="table table-sm table-bordered">
                                            <tbody>
                                            <tr>
                                                <td className="p-1" style={{width: 130, verticalAlign: "middle"}}>

                                                    <div
                                                        className="text-white p-2  h-100 py-3 d-flex flex-column justify-content-center align-items-center bg-danger"
                                                        style={{maxWidth: 110, minWidth: 110}}>
                                                        <span className="fw-bold font-14">{quiz.actualScore}/{quiz.totalScore}</span>
                                                        <span className="fw-light font-10">SCORE</span>
                                                    </div>
                                                </td>
                                                <td className="p-1">
                                                    <p className="font-bold mb-0 font-14">{`${quiz.first_name && quiz.first_name.toUpperCase()}: ${quiz.surname && quiz.surname.toUpperCase()}`}</p>
                                                    <p className="mb-0">START TIME
                                                        : {`${new Date(quiz.startAt).toLocaleString()}`}</p>
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
                                                                      numberOfAnswers,
                                                                       submittedAnswers
                                                                  }, index) => {
                                                return (
                                                    <>
                                                        <tr key={`t${index}`}>
                                                            <td>{index + 1}</td>
                                                            <td className="fw-bold">{questionText}</td>
                                                            <td className="text-center">[{possibleScore}]</td>
                                                        </tr>
                                                        <tr key={`s${index}`}>
                                                            <td></td>
                                                            <td>
                                                                <span className="fw-bold">Answers:</span>
                                                                <ul style={{listStyle: "none"}}>
                                                                    {submittedAnswers.map(({answerText, actual_score, possible_score}, k)=>{
                                                                        return (
                                                                            <li key={`k-${k}`}>
                                                                                <span>
                                                                                    {answerText}
                                                                                </span>

                                                                                <span className="ms-2">
                                                                                    {
                                                                                    actual_score === possible_score ?
                                                                                        <i className="fas fa-check text-success fw-bold" />:
                                                                                        <i className="fas fa-times text-danger fw-bold" />
                                                                            }

                                                                                </span>
                                                                                <span className="ms-2">
                                                                                    [{actual_score}]
                                                                                </span>


                                                                            </li>
                                                                        )

                                                                    })}
                                                                </ul>
                                                            </td>

                                                            <td></td>

                                                        </tr>



                                                    </>
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
        </>
    )
}

export default StaffSubmittedQuiz