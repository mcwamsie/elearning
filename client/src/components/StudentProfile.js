import {connect} from "react-redux";

const StudentProfile = ({profile}) => {
    return (
        <div className="row g-0">
            <div className="col-lg-4 col-xlg-3 col-md-12">
                <div className="white-box mb-0 h-100">
                    <div className="user-bg">
                        <img style={{width: "100%", height: "100%", objectFit: "cover"}} alt="user"
                             src={"/plugins/images/large/img1.jpg"}/>
                        <div className="overlay-box bg-danger">
                            <div className="user-content">
                                <a href="#">
                                    <img src={"/plugins/images/users/profpic.png"} className="thumb-lg img-circle"
                                         alt="img"/>
                                </a>
                                <h4 className="text-white fw-bold mt-2">{profile.regNumber}</h4>
                                <h5 className="text-white mt-2">{`${profile.surname.toUpperCase()} ${profile.first_name.toUpperCase()}`}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-8 colxlg-9 col-md-12">
                <div className="white-box mb-0 h-100">
                    <table className="table table-sm ">
                        <tbody>
                        <tr>
                            <td className="fw-bold font-12">School</td>
                            <td className="text-uppercase font-12">
                                {profile.program.facultyName.toUpperCase()}
                            </td>
                        </tr>
                        <tr>
                            <td className="fw-bold font-12">Program</td>
                            <td className="text-uppercase font-12">
                                {profile.program.programName.toUpperCase()}
                            </td>
                        </tr>
                        <tr>
                            <td className="fw-bold font-12">Level</td>
                            <td className="font-12">{profile.level}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

const map_state_to_props = (state) => {
    return {
        profile: state.auth.profile
    }
}
export default connect(map_state_to_props, {})(StudentProfile)