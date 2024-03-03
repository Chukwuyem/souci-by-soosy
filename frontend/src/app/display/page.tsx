"use client"

import Image from "next/image"
import axios from "axios"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"


export default function DisplayPage() {
    const searchParams = useSearchParams()
    const imageUrlb64 = searchParams.get('image')
    console.log("this is image url b64", imageUrlb64)


    const [ImageB64, setImageB64] = useState('');
    const [ImageExtract, setImageExtract] = useState('');
    const [isImageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        console.log("starting effect work");
    
        const fetchImage = async () => {
            await axios.get('/api/display', {
                params: {
                    image: imageUrlb64
                }
            })
            .then(function(response) {
                setImageB64(response.data["image_data"]);
                setImageExtract(response.data["image_extract"]);
                setImageLoaded(true);
                console.log("this is response ", response.data);
            })
            .catch (function(error) {
            console.log('Error getting image and data from nextjs backend:', error);
            });
        }

        fetchImage();

    }, []);


    useEffect(() => {
        console.log("this is image_data", ImageB64);
        console.log("this is image_extract", ImageExtract);
    }, [ImageB64, ImageExtract]);
    

    return (
        <div>
           <h1>This is the Display Page</h1>
           {isImageLoaded ? (
                <img src={`data:image/jpeg;base64,${ImageB64}`} alt="Image" /> // Display image
            ) : (
                <div style={{ width: '400px', height: '400px', backgroundColor: 'lightgray' }}></div> // Blank div as placeholder
            )}
        {/* {ImageB64 && <img src={`data:image/jpeg;base64,${ImageB64}`} alt="Image" />} */}
        </div>
    );
}

