'use client';

import { useEffect, useRef, useState } from 'react';

export default function CreateVideo() {
  const player = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(
    null
  );
  const [recorder, setRecorder] = useState<MediaRecorder | null>(
    null
  );

  console.log(recorder);

  const isrecording = recorder
    ? recorder.state === 'recording'
    : false;

  const chunks = useRef<Blob[]>([]);

  const streamActive = stream?.active;
  const [shouldCaptureAudio, setShouldCaptureAudio] = useState(true);

  useEffect(() => {
    if (player.current && stream) {
      player.current.srcObject = stream;
    }
  }, [stream]);

  const captureWebcam = () => {
    if (shouldCaptureAudio) {
      captureAudio();
    }
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        setStream(stream);
      })
      .catch((error) => {
        console.error('Webcam error:', error);
      });
  };

  const captureScreen = () => {
    if (shouldCaptureAudio) {
      captureAudio();
    }

    navigator.mediaDevices
      .getDisplayMedia({ video: true, audio: false })
      .then((stream) => {
        setStream(stream);
      })
      .catch((error) => {
        console.error('Screen capture error:', error);
      });
  };

  const captureAudio = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: false,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })
      .then((stream) => {
        setAudioStream(stream);
      })
      .catch((error) => {
        console.error('Audio capture error:', error);
      });
  };

  const startRecording = () => {
    const fullStream = new MediaStream([
      ...(stream?.getTracks() || []),
      ...(audioStream?.getTracks() || []),
    ]);

    const newRecorder = new MediaRecorder(fullStream);
    setRecorder(newRecorder);

    newRecorder.start(300);
    newRecorder.ondataavailable = (event) => {
      if (!event.data || event.data.size <= 0) return;

      chunks.current.push(event.data);
    };
    newRecorder.onstop = () => {
      console.log(chunks);
    };
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
      setAudioStream(null);
      setRecorder(null);
    }
  };

  return (
    <div>
      <div>Create Video</div>
      {streamActive ? (
        <div>
          <video ref={player} autoPlay muted playsInline></video>

          <div className="flex justify-center space-x-4">
            {isrecording ? (
              <button onClick={stopRecording}>Stop Recording</button>
            ) : (
              <button onClick={startRecording}>
                Start Recording
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center space-x-4">
          <button onClick={captureWebcam}>Capture webcam</button>
          <button onClick={captureScreen}>Capture Screen</button>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="audio"
              checked={shouldCaptureAudio}
              onChange={(e) => {
                setShouldCaptureAudio(e.target.checked);
              }}
            />
            <label htmlFor="audio">Enable Audio</label>
          </div>
        </div>
      )}
    </div>
  );
}
