const MainBreadcrumb = ({icon, text})=>{
    return(
        <div className="page-breadcrumb bg-white" style={{height: 61}}>
            <div className="row align-items-center h-100">
                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                    <h6 className="page-title text-nowrap">
                        <i className={`fas fa-${icon}`}/>
                        <span className="ms-2">{text}</span>
                    </h6>
                </div>
            </div>
        </div>
    )
}

export default MainBreadcrumb