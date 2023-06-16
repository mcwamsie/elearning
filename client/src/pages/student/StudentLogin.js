import {Formik} from "formik";
import {connect, useDispatch} from "react-redux"
import * as yup from "yup";
import StudentLoginBreadcrumb from "../../components/breadcrumbs/StudentLoginBreadcrumb";
import FormikError from "../../components/FormikError";
import AxiosInstance from "../../lib/AxiosInstance";
import AlertNotification from "../../components/AlertNotification";
import {useEffect, useState} from "react";
import {TOKEN_STORAGE_NAME} from "../../lib/constants";
import setAuthorizationToken from "../../lib/setAuthorizationToken";
import {setLoginUser} from "../../redux/actions/authAction";
import Loading from "../../components/Loading";
import {Link, useNavigate} from "react-router-dom";


const login_validation_schema = yup.object().shape({
    regNumber: yup.string().matches(/^[C][1-2]\d{7}[A-Z]$/, `Reg No. must be formatted C{x}{y}{z}, where y is 1-2 and x is 0-9 length 7 and z is A-Z`).required('Reg No. is required'),
    password: yup.string().matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})", "Password must be 8 characters or longer, with at least 1 number, 1 capital letter and 1 small letter.")
        .required("Password is required"),
});

const initial_values = {
    password: '',
    regNumber: ''
}


const StudentLogin = ({setLoginUser, logged_in , role}) => {
    let dispatch = useDispatch()
    let navigate = useNavigate()

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
        if (logged_in &&( role === "STUDENT" ))
            navigate(`/student/personal/home`)
    }, [])

    const handleLogin = async (values)=>{
        setError(null)
        setLoading(true)
    try {
        let res = await AxiosInstance.post('/auth/student/login', values)
        console.log()
        let {token} = res.data
        dispatch(setLoginUser(token))
        sessionStorage.setItem(TOKEN_STORAGE_NAME, token)
        setAuthorizationToken(token);
        navigate(`/student/personal/home`)

    }
    catch (error) {
        if (error.message)
            setError(error.message)


        if (error?.response?.data){
            let {type, message} = error.response.data
            setError(`${type}: ${message}`)
        }

    }
    finally {
        setLoading(false)
    }

}
    return (
        <>
            {loading && <Loading />}
            <StudentLoginBreadcrumb role={"Student"}/>
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="card" style={{maxWidth: 400}}>
                        <div className="card-body">

                            <Formik
                                initialValues={initial_values}
                                validationSchema={login_validation_schema}
                                onSubmit={async (values) => {
                                    //console.log(values)
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
                                            error && <AlertNotification type={'danger'} icon={"exclamation-triangle-fill"} msg={error}/>
                                        }



                                        <div className="form-group mb-4 mt-2">
                                            <label htmlFor="example-email" className="col-md-12 p-0 font-weight-bold">Reg No.</label>
                                            <div className="col-md-12 border-bottom p-0">
                                                <input
                                                    type="text"
                                                    placeholder="C1812XXXXY"
                                                    className="form-control p-0 border-0"
                                                    name="regNumber"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.regNumber}
                                                />
                                            </div>
                                            <FormikError name={'regNumber'} errors={errors} touched={touched} help_text={"Required*"} />
                                        </div>
                                        <div className="form-group mb-4">
                                            <label className="col-md-12 p-0 font-weight-bold">Password</label>
                                            <div className="col-md-12 border-bottom p-0">
                                                <input
                                                    type="password"
                                                    className="form-control p-0 border-0"
                                                    name="password"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.password}
                                                />

                                            </div>
                                            <FormikError name={'password'} errors={errors} touched={touched} help_text={"Required*"} />
                                        </div>

                                        <div className="form-group mb-4">
                                            <button type={"submit"} className="btn w-100 btn-danger text-white">
                                                Login
                                            </button>
                                        </div>
                                        <div className="form-group mb-4">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <Link to={'/'} className="text-danger fw-bold">Back Home</Link>
                                                <Link to={'/staff/login'} className="text-danger fw-bold">Staff Portal</Link>
                                            </div>
                                        </div>


                                    </form>
                                )}
                            </Formik>

                        </div>
                    </div>
                </div>

            </div>
        </>

    )
}
function mapStateToProps(state) {
    return {
        logged_in: state.auth.logged_in,
        role: state.auth.role
    }
}
export default connect(mapStateToProps, {setLoginUser}) (StudentLogin)