"use client"

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import styles from './capture.module.css';
import { useRouter } from 'next/navigation';

export default function CapturePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [csrfToken, setcsrf] = useState<String | null>('');

  useEffect(() => { 
    //get camera stream in useEffect to render on page load
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => {
          track.stop();
        });
      }
    };
  }, []);


  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImageUrl(dataUrl);
      }
    }
  };

  const router = useRouter()

  const sendImageToBackend = async () => {

    if (!imageUrl) {
      console.error('No image captured.');
      return;
    }

    //send image to backend
    // '/api/capture/'
    await axios.post(
      '/api/capture',
      { 
        imageData: imageUrl
      })
      .then(function(response) {
        console.log('Response from nextjs backend:', response);
        router.push(`/display?image=${response.data["image_name_b64"]}`)
      })
      .catch(function(error) {
        console.error('Error sending image data to nextjs backend:', error);
      });

  };


  return (
    <div className={styles.contentarea}>
      <div className="Input">
        <div id="camera" className={styles.camera}>
          <video ref={videoRef} autoPlay={true} playsInline/>
          <button onClick={captureImage}>Take photo</button>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
        <br />
        <div>
          <img src={imageUrl} alt="Captured Image" />
        </div>
        <br />
        <button onClick={sendImageToBackend}>Submit</button>
      </div>
    </div>
  );
}
