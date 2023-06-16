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
    username: yup.string().required("Username is required"),
    password: yup.string().matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})", "Password must be 8 characters or longer, with at least 1 number, 1 capital letter and 1 small letter.")
        .required("Password is required"),
});

const initial_values = {
    password: '',
    username: ''
}


const StaffLogin = ({setLoginUser, logged_in , role}) => {
    let dispatch = useDispatch()
    let navigate = useNavigate()

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
        if (logged_in &&( role === "LECTURER" || role === "TEACHING ASSISTANT" ))
            navigate(`/staff/personal/home`)
    }, [])

    const handleLogin = async (values)=>{
        setError(null)
        setLoading(true)
    try {
        let res = await AxiosInstance.post('/auth/staff/login', values)
        console.log()
        let {token} = res.data
        dispatch(setLoginUser(token))
        sessionStorage.setItem(TOKEN_STORAGE_NAME, token)
        setAuthorizationToken(token);
        navigate(`/staff/personal/home`)

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
            <StudentLoginBreadcrumb role={"Staff"}/>
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
                                            <label htmlFor="example-email" className="col-md-12 p-0 font-weight-bold">Username</label>
                                            <div className="col-md-12 border-bottom p-0">
                                                <input
                                                    type="text"
                                                    placeholder="user-samples"
                                                    className="form-control p-0 border-0"
                                                    name="username"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.username}
                                                />
                                            </div>
                                            <FormikError name={'username'} errors={errors} touched={touched} help_text={"Required*"} />
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
                                                <Link to={'/student/login'} className="text-danger fw-bold">Student Portal</Link>
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
export default connect(mapStateToProps, {setLoginUser}) (StaffLogin)