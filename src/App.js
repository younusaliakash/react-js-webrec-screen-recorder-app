import { useRef, useState } from "react";
import { BsFillStopFill, BsRecordCircleFill } from "react-icons/bs";
import { IoMdDownload } from "react-icons/io";
import "./App.css";

let chunks = [];
let recorder = null;

function App() {
  let [stream, setStream] = useState(null);
  let [audio, setAudio] = useState(null);
  let [mixedStream, setMixedStream] = useState(null);

  const videoFeedback = useRef();
  const videoDownload = useRef();
  const linkRef = useRef();

  async function setupStream() {
    try {
      const _stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      setStream(_stream);

      const _audio = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });
      setAudio(_audio);
      setupVideoFeedBack();
    } catch (e) {
      console.log("Error", e);
    }
  }

  const setupVideoFeedBack = () => {
    if (stream) {
      videoFeedback.current.srcObject = stream;
      videoFeedback.current.play();
    } else {
      console.warn("No stream avialable");
    }
  };

  const startRecorder = async () => {
    await setupStream();
    if (stream && audio) {
      const _mixedStream = new MediaStream([
        ...stream.getTracks(),
        ...audio.getTracks(),
      ]);
      recorder = new MediaRecorder(_mixedStream);
      recorder.ondataavailable = handleDataAvailable;
      recorder.onstop = handleStop;
      recorder.start(1000);

      console.log("Recording is started");
      console.log(recorder);
    } else {
      console.warn("No stream available.");
    }
  };

  function stopRecording() {
    recorder.stop();
  }

  function handleDataAvailable(e) {
    chunks.push(e.data);
  }

  const handleStop = (e) => {
    const blob = new Blob(chunks, { type: "video/mp4" });
    chunks = [];

    //   downloadButton.href = URL.createObjectURL(blob);
    // downloadButton.download = 'video.mp4';
    // downloadButton.disabled = false;

    videoDownload.current.src = URL.createObjectURL(blob);
    videoDownload.current.load();
    videoDownload.current.onloadeddata = function () {
      // const rc = document.querySelector(".recorded-video-wrap");
      // rc.classList.remove("hidden");
      // rc.scrollIntoView({ behavior: "smooth", block: "start" });

      videoDownload.current.play();
    };

    stream.getTracks().forEach((track) => track.stop());
    audio.getTracks().forEach((track) => track.stop());

    console.log("Recording stopped");
  };

  return (
    <div className="screen_recorder">
      <h1 className="title">Webrec Screen Recorder</h1>
      <div className="main_recorder_container">
        <div className="preview">
          <video
            ref={videoFeedback}
            autoPlay
            className="main_recorder_preview"
          ></video>
        </div>
        <div className="action_btn">
          <button onClick={startRecorder}>
            {" "}
            <BsRecordCircleFill className="icon" />{" "}
            <span className="btn_title">Start Recording</span>
          </button>
          <button onClick={stopRecording}>
            {" "}
            <BsFillStopFill className="icon" />{" "}
            <span className="btn_title">Stop Recording</span>
          </button>
        </div>
      </div>
      {stream && (
        <div className="recording_download_section">
          <div className="preview_recorded_video">
            <video
              controls
              className="download_preview"
              ref={videoDownload}
            ></video>
          </div>
          <div className="download_btn">
            <a ref={linkRef}>
              {" "}
              <IoMdDownload className="icon" />{" "}
              <span className="btn_title">Download Video</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
