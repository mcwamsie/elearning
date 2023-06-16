import {Link} from  'react-router-dom'

const NotFoundBreadcrumb = ()=>{
    return (
        <div className="page-breadcrumb bg-white" style={{height: 61}}>
            <div className="row align-items-center h-100">
                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                    <h4 className="page-title">Not Found</h4>
                </div>
                <div className="col-lg-9 col-sm-8 col-md-8 col-xs-12">
                    <div className="d-md-flex">
                        <ol className="breadcrumb ms-auto">
                            <li>
                                <Link to={"/"} className="fw-normal">Homepage</Link>
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default NotFoundBreadcrumb