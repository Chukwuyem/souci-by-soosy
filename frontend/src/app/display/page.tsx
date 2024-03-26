"use client"

import Image from "next/image"
import axios from "axios"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"


export default function DisplayPage() {
    const searchParams = useSearchParams()
    const imageUrlb64 = searchParams.get('image')
    console.log("this is image url b64", imageUrlb64)

    type ImageExtract = {
        [key: string]: any;
    }


    const [ImageB64, setImageB64] = useState('');
    const [ImageExtract, setImageExtract] = useState<ImageExtract>({});
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
                setImageExtract(response.data["image_extract"][0]);
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
        //console.log("this is image_data", ImageB64);
        console.log("this is image_extract", ImageExtract);
    }, [ImageB64, ImageExtract]);
    

    return (
        <main className="flex flex-col items-center gap-8">
            <div className="text-center">
                <h1 className="text-2xl font-bold">This is the Display Page</h1>
                {isImageLoaded ? (
                    <img src={`data:image/jpeg;base64,${ImageB64}`} alt="Image" className="max-w-full h-auto" /> // Display image
                ) : (
                    <div className="w-64 h-64 bg-gray-200"></div> // Blank div as placeholder
                )}
            </div>
            <div className="w-full max-w-md text-center">
                {isImageLoaded && (
                    <div>
                        <h2 className="text-lg font-semibold">Image Extract Data</h2>
                        {ImageExtract ? (
                            ImageExtract.length > 0 && ImageExtract.map((page: any, pageIndex: any) => (
                            <div key={pageIndex} className="block">
                                <p key={pageIndex + '_word'}>{page[1][0]}</p>
                                <p key={pageIndex + '_confidence'}>{page[1][1]}</p>
                                
                            </div>
                            ))
                            ) : (
                                <p>No text to extract</p>
                            )
                        }
                    </div>
                )}
            </div>
        </main>
    );
}

