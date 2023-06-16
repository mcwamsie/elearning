import {Link, NavLink} from "react-router-dom";
import {setLogout} from "../../redux/actions/authAction";
import {connect, useDispatch} from "react-redux";

const StaffSidebar = ({setLogout}) => {
    let dispatch = useDispatch()
    const handleLogout = ()=>{
        dispatch(setLogout())
    }
    return (
        <ul id="sidebarnav">
            <li className="sidebar-item pt-2">
                <NavLink className="sidebar-link waves-effect waves-dark sidebar-link"
                   to={"/staff/personal/home"}
                   aria-expanded="false">
                    <i className="fas fa-home" aria-hidden="true"/>
                    <span className="hide-menu">Home</span>
                </NavLink>
            </li>
            <li className="sidebar-item pt-2">
                <NavLink className="sidebar-link waves-effect waves-dark sidebar-link"
                   to={"/staff/personal/modules"}
                   aria-expanded="false">
                    <i className="fas fa-book" aria-hidden="true"/>
                    <span className="hide-menu">Modules</span>
                </NavLink>
            </li>
            <li className="sidebar-item pt-2">
                <NavLink className="sidebar-link waves-effect waves-dark sidebar-link"
                   to={"/staff/personal/lectures"}
                   aria-expanded="false">
                    <i className="far fa-clock" aria-hidden="true"/>
                    <span className="hide-menu">Lectures</span>
                </NavLink>
            </li>
            <li className="sidebar-item pt-2">
                <NavLink className="sidebar-link waves-effect waves-dark sidebar-link"
                         to={"/staff/personal/quiz"}
                         aria-expanded="false">
                    <i className="fas fa-puzzle-piece" aria-hidden="true"/>
                    <span className="hide-menu">Quiz</span>
                </NavLink>
            </li>
            <li className="sidebar-item pt-2">
                <NavLink className="sidebar-link waves-effect waves-dark sidebar-link"
                   to={"/staff/personal/config"}
                   aria-expanded="false">
                    <i className="fas fa-cog" aria-hidden="true"/>
                    <span className="hide-menu">Config</span>
                </NavLink>
            </li>

            <li className="text-center p-20">
                <a onClick={handleLogout} className="btn w-100 btn-danger text-white" target="_blank">
                    <i className="fa fa-key" aria-hidden="true"/>
                    <span className="hide-menu">
                    Logout
                    </span>
                </a>
            </li>

        </ul>
    )
}
const map_state_to_props = (state) => {
    return {
        profile: state.auth.profile
    }
}
export default connect(map_state_to_props,  {setLogout}) (StaffSidebar)