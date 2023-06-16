import {Link} from  'react-router-dom'

const StudentLoginBreadcrumb = ({role})=>{
    return (
        <div className="page-breadcrumb bg-white" style={{height: 61}}>
            <div className="row align-items-center h-100">
                <h6 className="page-title d-flex">
                        <i className="fas fa-key"/>
                        <span className="ms-2">{role ==="Student"? "Student" : "Staff"} Login</span>
                </h6>
            </div>
        </div>
    )
}
export default StudentLoginBreadcrumb