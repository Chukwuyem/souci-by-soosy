"use client"

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import '../globals.css'
import { useRouter } from 'next/navigation';

export default function CapturePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [csrfToken, setcsrf] = useState<String | null>('');
  const [streaming, setStreaming] = useState(false);
  const width = 640;

  
  useEffect(() => {
    //get camera stream in useEffect to render on page load
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
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

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const handleCanPlay = () => {
      if (!streaming && video) {
        let height = video.videoHeight / (video.videoWidth / width);

        if (isNaN(height)) {
          height = width / (4 / 3);
        }

        video.setAttribute('width', width.toString());
        video.setAttribute('height', height.toString());
        if (canvas) {
          canvas.setAttribute('width', width.toString());
          canvas.setAttribute('height', height.toString());
        }
        setStreaming(true);
      }
    };

    if (video) {
      video.addEventListener('canplay', handleCanPlay);
    }

    return () => {
      if (video) {
        video.removeEventListener('canplay', handleCanPlay);
      }
    };
  }, [streaming]);


  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      // canvas.width = video.videoWidth;
      // canvas.height = video.videoHeight;
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

    if (imageUrl === '') {
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
        router.push(`/display?image=${response.data["image_name_b64"]}`);
      })
      .catch(function(error) {
        console.error('Error sending image data to nextjs backend:', error);
      });

  };


  return (

    <main className="flex-grow">
        <div className="container mx-auto p-4 flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 mb-4 md:mb-0">
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <video ref={videoRef} className="w-full" autoPlay={true} playsInline></video>
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
          </div>
              {/* <button onClick={captureImage}>Take photo</button> */}

          <div className="w-full md:w-1/2 md:ml-4">
            <div className="border border-gray-300 rounded-lg overflow-hidden h-full sm:h-290">
              {imageUrl === '' ? (
                <div className="w-full h-full bg-gray-300" style={{ maxWidth: '100%', maxHeight: '100%' }}></div>
              ) : (
                // <img className="w-full h-full object-cover" src={imageUrl} alt="Captured Image" />
                <img className="h-full w-full object-cover object-center mx-auto" src={imageUrl} alt="Captured Image" />
              )}
            </div>
          </div>
            {/* <button onClick={sendImageToBackend}>Submit</button> */}
        </div>

        <div className="container mx-auto p-4 flex justify-center">
          <button className="bg-maize text-white px-4 py-2 rounded hover:bg-cream-dark" onClick={captureImage}>Capture</button>
          <button className="bg-maize text-white px-4 py-2 rounded hover:bg-cream-dark ml-4" onClick={sendImageToBackend}>Submit</button>
        </div>
    </main>
  );
}
