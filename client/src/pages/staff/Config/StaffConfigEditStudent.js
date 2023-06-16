import MainBreadcrumb from "../../../components/breadcrumbs";

import {useEffect, useState} from "react";
import Loading from "../../../components/Loading";
import {Link, useParams} from "react-router-dom";
import AxiosInstance from "../../../lib/AxiosInstance";
import AlertNotification from "../../../components/AlertNotification";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";

import {useNavigate} from "react-router-dom";
import {Notyf} from "notyf";
import 'notyf/notyf.min.css'
import {array, object, string} from "yup";
import * as yup from "yup";
import {generatePassword} from "../../../lib/constants";

const notyf = new Notyf({dismissible: true, duration: 20000, position: {x: 'center', y: 'top'}});


const LEVELS = [
    "1.1",
    "1.2",
    "2.1",
    "2.2",
    "3.1",
    "3.2",
    "4.1",
    "4.2",
    "5.1",
    "5.2",
]
const TITLES = [
    'MRS', 'MR', 'MISS', 'MS', 'DR', 'HON', 'ENG'
]

const StaffConfigEditStudent = () => {
    let params = useParams();

    let navigate = useNavigate()
    const [loading, setLoading] = useState(null)
    const [programs, setPrograms] = useState([])
    const [error, setError] = useState(null)
    const [levels, setLevels] = useState(LEVELS)
    const [titles, setTitles] = useState(TITLES)


    const [student, setStudent] = useState({})
    /*
    * {
        regNumber:"", first_name:"", surname:"",
        national_id:"", email_address:"", phone_numbers:"",
        contact_address:"", title:"", sex:"", programId:"", level:""
    }*/


    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                let res = await AxiosInstance.get(`/programs`)
                let studentRes = await AxiosInstance.get(`/student/profile/${params.id}`)
                setPrograms(res.data)
                setStudent(studentRes.data)
            }
            catch (e) {
                if (e.message)
                    setError(e.message)
                if (e.response.data) {
                    let {message, type} = e.response.data
                    setError(`${type}: ${message}`)
                }
            }
            finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const validationSchema = object().shape({
        regNumber: yup.string().matches(/^[C][1-2]\d{7}[A-Z]$/, `Reg No. must be formatted C{x}{y}{z}, where y is 1-2 and x is 0-9 length 7 and z is A-Z`).required('Reg No. is required'),
        programId: yup.number('Program is required').required('Program is required'),
        level: yup.string().matches(/^[1-5][.][1-2]$/, `Level must be formatted {x}.{y}, where y is 1-5 and x is 1-2`).required('Level is required'),
        first_name: yup.string().required("First Name is required"),
        surname: yup.string().required("Surname is required"),
        national_id: yup.string().required("National Id Number is required"),
        email_address: yup.string().email().required("Email Address is required"),
        phone_numbers: yup.string().required("Phone Number is required"),
        contact_address: yup.string()
            .required("Home Address is required"),
        sex: yup.mixed().oneOf(['MALE', 'FEMALE'])
            .required("Sex is required"),
        title: yup.mixed().oneOf(['MRS', 'MR', 'MISS', 'MS', 'DR', 'HON', 'ENG'])
            .required("Title is required"),
    });
    const formOptions = {
        resolver: yupResolver(validationSchema),
        defaultValues : student
    };

    const {register, control, handleSubmit, reset, formState, watch} = useForm(formOptions);
    const {errors,} = formState;

    async function onSubmit(data) {
        setError(null)
        setLoading(true)
        try {
            await AxiosInstance.patch(`/student/profile/${params.id}`, data)
            notyf.success('Student saved successfully');
            navigate('/staff/personal/config/students')
        }
        catch (e) {
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
    }

    return (
        <>
            {loading && <Loading/>}
            <MainBreadcrumb text={`Configuration: ${student.first_name} ${student.surname}`} icon={"user"}/>

            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card mx-auto" style={{maxWidth: 800, width: "100%"}}>
                            <div className="card-body">
                                {
                                    error &&
                                    <AlertNotification type={'danger'} icon={"exclamation-triangle-fill"} msg={error}/>
                                }
                                <form onSubmit={handleSubmit(onSubmit)} className="form-horizontal form-material">
                                    <div className="row mb-4">
                                        <div className="col-md-6">
                                            <div className="form-group mb-4 mt-2">
                                                <label htmlFor="regNumber"
                                                       className="col-md-12 p-0 font-weight-bold">
                                                    Reg Number
                                                </label>
                                                <div
                                                    className={`col-md-12 border-bottom p-0 ${errors.regNumber ? 'is-invalid' : ''}`}>

                                                    <input
                                                        className={`form-control p-0 border-0`}
                                                        name="regNumber"
                                                        {...register('regNumber')}
                                                        type="text"
                                                        defaultValue={student.regNumber}
                                                    />
                                                </div>

                                                <div className="invalid-feedback">{errors.regNumber?.message}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group mb-4 mt-2">
                                                <label htmlFor="national_id"
                                                       className="col-md-12 p-0 font-weight-bold">
                                                    National Id
                                                </label>
                                                <div
                                                    className={`col-md-12 border-bottom p-0 ${errors.national_id ? 'is-invalid' : ''}`}>
                                                    <input
                                                        className={`form-control p-0 border-0`}
                                                        name="national_id"
                                                        {...register('national_id')}
                                                        type="text"
                                                        defaultValue={student.national_id}
                                                    />
                                                </div>

                                                <div className="invalid-feedback">{errors.national_id?.message}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group mb-4 mt-2">
                                                <label htmlFor="level"
                                                       className="col-md-12 p-0 font-weight-bold">
                                                    Title
                                                </label>

                                                <div
                                                    className={`col-md-12 border-bottom p-0 ${errors.title ? 'is-invalid' : ''}`}>
                                                    <select
                                                        className={`form-control p-0 border-0`}
                                                        name="title"
                                                        {...register('title')}
                                                        defaultValue={student.title}
                                                    >
                                                        <option value={""}>----</option>
                                                        {
                                                            titles.map((item, index) => {
                                                                return (
                                                                    <option selected={student.title === item} key={index} value={item}>
                                                                        {item}
                                                                    </option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                                <div className="invalid-feedback">{errors.title?.message}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group mb-4 mt-2">
                                                <label htmlFor="regNumber"
                                                       className="col-md-12 p-0 font-weight-bold">
                                                    First Name
                                                </label>
                                                <div
                                                    className={`col-md-12 border-bottom p-0 ${errors.first_name ? 'is-invalid' : ''}`}>
                                                    <input
                                                        className={`form-control p-0 border-0`}
                                                        name="first_name"
                                                        {...register('first_name')}
                                                        type="text"
                                                        defaultValue={student.first_name}
                                                    />
                                                </div>

                                                <div className="invalid-feedback">{errors.first_name?.message}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group mb-4 mt-2">
                                                <label htmlFor="regNumber"
                                                       className="col-md-12 p-0 font-weight-bold">
                                                    Surname
                                                </label>
                                                <div
                                                    className={`col-md-12 border-bottom p-0 ${errors.surname ? 'is-invalid' : ''}`}>
                                                    <input
                                                        className={`form-control p-0 border-0`}
                                                        name="surname"
                                                        {...register('surname')}
                                                        type="text"
                                                        defaultValue={student.surname}
                                                    />
                                                </div>

                                                <div className="invalid-feedback">{errors.surname?.message}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group mb-4 mt-2">
                                                <label htmlFor="level"
                                                       className="col-md-12 p-0 font-weight-bold">
                                                    Sex
                                                </label>

                                                <div
                                                    className={`col-md-12 border-bottom p-0 ${errors.sex ? 'is-invalid' : ''}`}>
                                                    <select
                                                        className={`form-control p-0 border-0`}
                                                        name="sex"
                                                        {...register('sex')}
                                                        defaultValue={student.sex}
                                                    >
                                                        <option value={""}>----</option>
                                                        <option selected={student.sex === "MALE"} value={"MALE"}>MALE</option>
                                                        <option selected={student.sex === "FEMALE"} value={"FEMALE"}>FEMALE</option>

                                                    </select>
                                                </div>
                                                <div className="invalid-feedback">{errors.sex?.message}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group mb-4 mt-2">
                                                <label htmlFor="email_address"
                                                       className="col-md-12 p-0 font-weight-bold">
                                                    Email Address
                                                </label>

                                                <div
                                                    className={`col-md-12 border-bottom p-0 ${errors.email_address ? 'is-invalid' : ''}`}>
                                                    <input
                                                        className={`form-control p-0 border-0`}
                                                        name="email_address"
                                                        {...register('email_address')}
                                                        type={'email'}
                                                        defaultValue={student.email_address}
                                                    />
                                                </div>
                                                <div className="invalid-feedback">{errors.email_address?.message}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group mb-4 mt-2">
                                                <label htmlFor="phone_numbers"
                                                       className="col-md-12 p-0 font-weight-bold">
                                                    Phone Number
                                                </label>

                                                <div
                                                    className={`col-md-12 border-bottom p-0 ${errors.phone_numbers ? 'is-invalid' : ''}`}>
                                                    <input
                                                        className={`form-control p-0 border-0`}
                                                        name="phone_numbers"
                                                        {...register('phone_numbers')}
                                                        type={'text'}
                                                        defaultValue={student.phone_numbers}
                                                    />
                                                </div>
                                                <div className="invalid-feedback">{errors.phone_numbers?.message}</div>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-group mb-4 mt-2">
                                                <label htmlFor="contact_address"
                                                       className="col-md-12 p-0 font-weight-bold">
                                                    Contact Address
                                                </label>

                                                <div
                                                    className={`col-md-12 border-bottom p-0 ${errors.contact_address ? 'is-invalid' : ''}`}>
                                                    <textarea
                                                        className={`form-control p-0 border-0`}
                                                        name="contact_address"
                                                        {...register('contact_address')}
                                                        defaultValue={student.contact_address}
                                                    />
                                                </div>
                                                <div
                                                    className="invalid-feedback">{errors.contact_address?.message}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group mb-4 mt-2">
                                                <label htmlFor="program"
                                                       className="col-md-12 p-0 font-weight-bold">
                                                    Program
                                                </label>

                                                <div
                                                    className={`col-md-12 border-bottom p-0 ${errors.programId ? 'is-invalid' : ''}`}>
                                                    <select
                                                        className={`form-control p-0 border-0`}
                                                        name="programId"
                                                        {...register('programId')}
                                                        defaultValue={student.programId}
                                                    >
                                                        <option value={""}>----</option>
                                                        {
                                                            programs.map(({programCode, id, programName}, index) => {
                                                                return (
                                                                    <option selected={student.programId === id} key={index} value={id}>
                                                                        {programName} ({programCode})
                                                                    </option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                                <div className="invalid-feedback">{errors.programId?.message}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group mb-4 mt-2">
                                                <label htmlFor="level"
                                                       className="col-md-12 p-0 font-weight-bold">
                                                    Level
                                                </label>

                                                <div
                                                    className={`col-md-12 border-bottom p-0 ${errors.level ? 'is-invalid' : ''}`}>
                                                    <select
                                                        className={`form-control p-0 border-0`}
                                                        name="level"
                                                        {...register('level')}
                                                        defaultValue={student.level}
                                                    >
                                                        <option value={""}>----</option>
                                                        {
                                                            levels.map((item, index) => {
                                                                return (
                                                                    <option selected={student.level === item} key={index} value={item}>
                                                                        {item}
                                                                    </option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                                <div className="invalid-feedback">{errors.level?.message}</div>
                                            </div>
                                        </div>
                                    </div>

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

export default StaffConfigEditStudent