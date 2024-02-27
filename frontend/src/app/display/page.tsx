"use client"

import Image from "next/image"
import axios from "axios"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

// async function getImageAndExtract() {
//     const response = await fetch(
//         '/api/display' + new URLSearchParams({
//             image: imageUrlb64,
//         })
//     )
// }

export default function DisplayPage() {
    const searchParams = useSearchParams()
    const imageUrlb64 = searchParams.get('image')
    console.log("this is image url b64", imageUrlb64)


    const [ImageB64, setImageB64] = useState('');
    const [ImageInfo, setImageInfo] = useState('');


    useEffect(() => {
        axios.get(
            '/api/display',
            {
                params: {
                    image: imageUrlb64
                }
            })
            .then(function(response) {
                setImageB64(response?.data[""])
            })
    }, []);

    

    return (
        <div>This is the Display Page</div>
    );
}

