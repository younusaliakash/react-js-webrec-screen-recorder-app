import { useEffect, useRef, useState } from "react";
import { BsFillStopFill, BsRecordCircleFill } from "react-icons/bs";
import { IoMdDownload } from "react-icons/io";
import "./App.css";

let chunks = [];

function App() {
  let [stream, setStream] = useState(null) ;
  let [audio, setAudio] = useState(null) ;
  let [mixedStream, setMixedStream] = useState(null) ;
  let [recorder, setrecorder] = useState(null) ;
  

  const videoFeedback = useRef();
  const videoDownload = useRef();
  const linkRef = useRef();


    async function setupStream () {
      try{
        const _stream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        })
        setStream(_stream)

        const _audio = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100
          }
        })
        setAudio(_audio)
        setupVideoFeedBack();

      }catch(e){
        console.log("Error",e)
      }
    }

    useEffect(() => {setMixedStream()}, [stream])

  const setupVideoFeedBack = () => {
    if(stream){
      videoFeedback.current.srcObject = stream
      videoFeedback.current.play()
    }
    else{
      console.warn("No stream avialable")
    }
  }

  return (
    <div className="screen_recorder">
      <h1 className="title">Webrec Screen Recorder</h1>
      <div className="main_recorder_container">
        <div className="preview">
          {console.log(videoFeedback.current)}
          {stream && <video
            ref={videoFeedback}
            autoPlay
            className="main_recorder_preview"
          ></video>}
        </div>
        <div className="action_btn">
          <button onClick={setupStream}>
            {" "}
            <BsRecordCircleFill className="icon" />{" "}
            <span className="btn_title">Start Recording</span>
          </button>
          <button >
            {" "}
            <BsFillStopFill className="icon" />{" "}
            <span className="btn_title">Stop Recording</span>
          </button>
        </div>
      </div>
      <div className="recording_download_section">
        <div className="preview_recorded_video">
          <video className="download_preview" ref={videoDownload}></video>
        </div>
        <div className="download_btn">
          <a ref={linkRef}>
            {" "}
            <IoMdDownload className="icon" />{" "}
            <span className="btn_title">Download Video</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
