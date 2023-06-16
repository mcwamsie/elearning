import {Navigate, Outlet} from "react-router-dom";

const StaffAuth = ({success})=>{
    return (
        <>
            {
                !success ? <Navigate to={'/staff/login'} /> :
                    <Outlet />
            }

        </>
    )
}

export default StaffAuth