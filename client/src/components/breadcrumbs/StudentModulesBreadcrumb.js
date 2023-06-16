import {Link} from "react-router-dom";

const StudentModulesBreadcrumb = ()=>{
    return (
        <div className="page-breadcrumb bg-white" style={{height: 61}}>
            <div className="row align-items-center h-100">
                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                    <h4 className="page-title d-flex">
                        <i className="fas fa-book"/>
                        <span className="ms-2">Student Modules</span>
                    </h4>
                </div>
            </div>
        </div>
    )
}

export default StudentModulesBreadcrumb