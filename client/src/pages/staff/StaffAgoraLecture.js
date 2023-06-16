import MainBreadcrumb from "../../components/breadcrumbs";
import {Helmet} from "react-helmet";
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css'
import {useEffect, useRef, useState} from "react";
import AxiosInstance from "../../lib/AxiosInstance";
import AlertNotification from "../../components/AlertNotification";
import Loading from "../../components/Loading";
import {getRandomColor, HOST_URL} from "../../lib/constants";
import io from "socket.io-client";
import Peer from "simple-peer";
import {useParams} from "react-router-dom";
import {connect} from "react-redux";


const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};
const notyf = new Notyf({dismissible: true, duration: 20000, position: {x: 'center', y: 'top'}});
const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <div className="col-sm-6 mb-3">
            <video className="flex-grow-1 h-100 w-100 img-fluid" autoPlay ref={ref}/>
        </div>
    );
}


const StaffLecture = ({profile}) => {
    let params = useParams();
    const userVideo = useRef();
    const partnerVideo = useRef();
    const peerRef = useRef();
    const studentsRef = useRef();
    const socketRef = useRef();
    const otherUser = useRef();
    const [peers, setPeers] = useState([]);
    const peersRef = useRef([]);
    const userStream = useRef();
    const senders = useRef([]);
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)


      useEffect(() => {
        socketRef.current = io.connect(HOST_URL);
        navigator.mediaDevices.getUserMedia({video: videoConstraints, audio: true}).then(stream => {
            userVideo.current.srcObject = stream;
            socketRef.current.emit("join room", params.id);
            socketRef.current.on("all users", users => {
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peers.push(peer);
                })
                setPeers(peers);
            })

            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                setPeers(users => [...users, peer]);

            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
        })
    }, []);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });
        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", {userToSignal, callerID, signal})
        })
        return peer;
    }
    console.log(peers)

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", {signal, callerID})
        })

        peer.signal(incomingSignal);

        return peer;
    }


    function shareScreen() {
        console.log("Screen Sharing")
        navigator.mediaDevices.getDisplayMedia({ cursor: true }).then(stream => {
            const screenTrack = stream.getTracks()[0];
            senders.current.find(sender => sender.track.kind === 'video').replaceTrack(screenTrack);
            screenTrack.onended = function() {
                senders.current.find(sender => sender.track.kind === "video").replaceTrack(userStream.current.getTracks()[1]);
            }
        })
    }

    return (
        <>
            <Helmet>
                <title>IOC: Lecture Name</title>
                <link href={"/css/video-chat.css"} rel="stylesheet"/>
            </Helmet>
            {loading && <Loading/>}
            <MainBreadcrumb text={"Lecture Name"} icon={"book"}/>
            <div id="video-main">

                <div className="container-fluid position-relative">
                    <div className="row">
                        <div className="col-sm-6 mb-3">
                            <video className="img-fluid w-100 h-100" muted ref={userVideo} autoPlay playsInline/>
                        </div>
                        {peers.map((peer, index) => {
                            return (
                                <Video key={index} peer={peer}/>
                            );
                        })}
                    </div>
                    <div id="video-footer" className="d-flex justify-content-between align-items-center">
                        <div>
                            <h5 className="fw-bold d-none d-sm-inline mb-0">13:13:23</h5>
                        </div>

                        <div id="btns" className="d-flex align-items-center">
                            <button className="btn footer-btn me-2">
                                <i className="fas fa-microphone"/>
                            </button>
                            <button  className="btn footer-btn me-2 cancelled">
                                <i className="fas fa-video-slash"/>
                            </button>
                            <button onClick={shareScreen} className="btn footer-btn me-2">
                                <i className="fas fa-arrow-circle-up"/>
                            </button>
                            <button className="btn footer-btn cancelled">
                                <i className="fas fa-phone-slash"/>
                            </button>
                        </div>
                        <div/>
                    </div>
                </div>

            </div>
        </>
    )
}

function mapStateToProps(state) {
    return {
        profile: state.auth.profile,
    }
}

export default connect(mapStateToProps, {})(StaffLecture)