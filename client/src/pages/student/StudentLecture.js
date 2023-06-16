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

import styled from "styled-components";

const Container = styled.div`
    padding: 20px;
    display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
`;

const StyledVideo = styled.video`
    height: 40%;
    width: 50%;
`;

const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};
const notyf = new Notyf({dismissible: true, duration: 20000, position: {x: 'center', y: 'top'}});
const Video = ({peer}) => {
    const ref = useRef();

    useEffect(() => {
        peer.on("stream", stream => {
            //console.log(`Peer is streaming`)
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <div className="col-sm-6 mb-3">
            <video className="flex-grow-1 h-100 w-100 img-fluid" autoPlay ref={ref}/>
        </div>
    );
}


const StudentLecture = ({profile}) => {
    const [messageText, setMessageText] = useState('')
    const [error, setError] = useState(null)
    const [chatting, setChatting] = useState(false)
    const [loading, setLoading] = useState(null)

    let params = useParams();
    let roomId = params.id
    const socketRef=useRef();
    const userRef=useRef();
    const partnerRef=useRef();
    const PeerRef=useRef();

    useEffect(()=>{
        navigator.mediaDevices.getUserMedia({video:true,audio:true}).then((stream)=>{
                userRef.current.srcObject=stream;

                socketRef.current=io.connect(HOST_URL);
                console.log("hello");
                console.log(roomId);
                socketRef.current.emit("join room", roomId);

                socketRef.current.on("other user",(PartnerID)=>{
                    console.log("creator");
                    if(PartnerID){
                        console.log("partner");
                        PeerRef.current=createPeer(PartnerID,socketRef.current.id,stream);
                    }
                });
                socketRef.current.on("caller signal",(incoming)=>{
                    console.log("Caller signal from browser");
                    PeerRef.current=addPeer(incoming.CallerID,incoming.signal,stream);

                });
                socketRef.current.on("callee signal",(signal)=>{
                    console.log("callee signal from browser");

                    PeerRef.current.signal(signal);
                });

        })


    },[]);

    function handleStream(stream){
        partnerRef.current.srcObject=stream;

    }
    const createPeer = (PartnerID,CallerID,stream) =>{
        const peer = new Peer({
            initiator:true,
            trickle:false,
            stream
        });
        peer.on("signal",(signal)=>{
            const payload={
                PartnerID,
                CallerID,
                signal
            }
            socketRef.current.emit("call partner",payload);

        });
        peer.on("stream",handleStream);
        //peer.on("data",handleData);
        return peer;
    }

    const addPeer = (CallerID,insignal,stream) =>{
        console.log("inside addpeer");
        const peer = new Peer({
            initiator:false,
            trickle:false,
            stream
        });
        peer.on("signal",(signal)=>{
            console.log("inside peer");
            const payload={
                CallerID,
                signal
            }
            socketRef.current.emit("accept call",payload);
        });
        peer.on("stream",handleStream);

        peer.signal(insignal);

        return peer;
    }

    const handleSendMessage = () => {
        //console.log(`Message Sent`)
        socketRef.current.emit("student sent message", {messageText, roomId: params.id, studentId: profile.id})
        setMessageText('')
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
                {
                    error && <AlertNotification type={'danger'} icon={"exclamation-triangle-fill"} msg={error}/>
                }
                <div className="container-fluid position-relative">
                    <div className="row">
                        <div className="col-sm-6 mb-3">
                            <video className="img-fluid w-100 h-100" muted ref={userRef} autoPlay playsInline/>
                        </div>
                        <div className="col-sm-6 mb-3">
                            <video className="img-fluid w-100 h-100" muted ref={partnerRef} autoPlay playsInline/>
                        </div>

                    </div>
                    <div id="chat-main" className={` ${chatting ? 'show' : ''}`}>
                        <div className="msg-head">
                            Lecture Name Here
                        </div>
                        <div className="msg-body">

                        </div>
                        <div className="msg-input">
                            <input value={messageText} onChange={(e) => setMessageText(e.target.value)}
                                   className="form-control"/>
                            <button onClick={handleSendMessage} disabled={messageText.length < 3}
                                    className="ms-2 btn send-btn">
                                <i className="fas fa-share"/>
                            </button>
                        </div>
                    </div>
                    <div id="video-footer" className="d-flex justify-content-between align-items-center">
                        <div>
                            <h5 className="fw-bold d-none d-sm-inline mb-0">13:13:23</h5>
                        </div>

                        <div id="btns" className="d-flex align-items-center">
                            <button className="btn footer-btn me-2">
                                <i className="fas fa-microphone"/>
                            </button>
                            <button className="btn footer-btn me-2 cancelled">
                                <i className="fas fa-video-slash"/>
                            </button>
                            <button onClick={() => setChatting(!chatting)} className="btn footer-btn me-2">
                                <i className="far fa-comment-alt"/>
                            </button>
                            <button className="btn footer-btn cancelled">
                                <i className="fas fa-phone-slash"/>
                            </button>
                        </div>
                        <div></div>
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

export default connect(mapStateToProps, {})(StudentLecture)