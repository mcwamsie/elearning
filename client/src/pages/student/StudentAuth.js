import {Navigate, Outlet} from "react-router-dom";

const StudentAuth = ({success})=>{
    return (
        <>
            {
                !success ? <Navigate to={'/student/login'} /> :
                    <Outlet />
            }

        </>
    )
}

export default StudentAuth