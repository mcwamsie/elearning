import HomeBreadcrumb from "../components/breadcrumbs/HomeBreadcrumb";
import {Link} from "react-router-dom";

const Homepage = ()=>{
    return (
        <>
            <HomeBreadcrumb />
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <Link to={"/student/login"} className="col-md-auto col-sm-6">
                        <div style={{height: 150, minWidth:280, position: "relative"}} className="white-box bg-danger text-white analytics-info">
                            <h2 className="box-title">Student Portal</h2>
                            <i style={{position: "absolute", opacity:.8, top: "50%", transform: "translateY(-50%)", right: 25}} className="fas fa-users fa-4x" />
                        </div>
                    </Link>
                    <Link to={"/staff/login"} className="col-md-auto col-sm-6">
                        <div style={{height: 150, minWidth:280, position: "relative"}} className="white-box bg-dark text-white analytics-info">
                            <h2 className="box-title">Staff Portal</h2>
                            <i style={{position: "absolute", opacity:.8, top: "50%", transform: "translateY(-50%)", right: 25}} className="fas fa-users fa-4x" />
                        </div>
                    </Link>

                </div>
            </div>
        </>

    )
}

export default Homepage