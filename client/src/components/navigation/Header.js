import {connect} from "react-redux";

const Header = ({auth}) => {
    return (
        <header className="topbar" data-navbarbg="skin5">
            <nav className="navbar top-navbar navbar-expand-md navbar-dark">
                <div className="navbar-header" data-logobg="skin6">
                    <a className="navbar-brand" href={"#"}>
                        <b className="logo-icon">
                            <img src={"/plugins/images/logo-icon.png"} alt="homepage"/>
                        </b>
                        <span className="logo-text">
                            <img src={"/plugins/images/logo-text.png"} alt="homepage"/>
                        </span>
                    </a>
                    <a className="nav-toggler waves-effect waves-light text-dark d-block d-md-none"
                       href="#"><i className="ti-menu ti-close"/></a>
                </div>
                <div className="navbar-collapse collapse" id="navbarSupportedContent" data-navbarbg="skin5">
                    <ul className="navbar-nav ms-auto d-flex align-items-center">
                        <li className=" in">
                            <form role="search" className="app-search d-none d-md-block me-3">
                                <input type="text" placeholder="Search..." className="form-control mt-0"/>
                                <a href="" className="active">
                                    <i className="fa fa-search"/>
                                </a>
                            </form>
                        </li>
                        {
                            auth?.logged_in && <li>
                            <a className="profile-pic" href="#">
                                <img src={"/plugins/images/users/profpic.png"} alt="user-img" width="36"
                                     className="img-circle"/>

                                <span className="text-white font-medium">
                                    {auth.role !=="STUDENT" ? auth?.profile?.username : auth.profile.regNumber}
                                </span>
                            </a>
                        </li>
                        }

                    </ul>
                </div>
            </nav>
        </header>
    )
}

const map_state_to_props = (state) => {
    return {
        auth: state.auth
    }
}
export default connect(map_state_to_props, {})(Header)