import {connect} from "react-redux";
import StudentSidebar from "./StudentSidebar";
import StaffSidebar from "./StaffSidebar";

const Sidebar = ({auth}) => {
    //console.log(auth)
    return (
        <aside className="left-sidebar" data-sidebarbg="skin6">
            <div className="scroll-sidebar">
                {auth?.logged_in &&
                <nav className="sidebar-nav">
                    {
                        auth?.role === "STUDENT" ?
                            <StudentSidebar/> :
                            <StaffSidebar/>
                    }

                </nav>

                }

            </div>
        </aside>
    )
}
const map_state_to_props = (state) => {
    return {
        auth: state.auth
    }
}
export default connect(map_state_to_props, {})(Sidebar)