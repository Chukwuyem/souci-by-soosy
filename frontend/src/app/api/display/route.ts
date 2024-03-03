import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {

    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const imageUrlb64 = searchParams.get("image");

    return await axios.get(
        `http://localhost:8000/souci/display/${imageUrlb64}`,
        )
        .then(function(response) {
            //console.log("Image data from django /display ", response.data)
            return NextResponse.json({image_data: response.data['image_data'], image_extract: response.data['image_extract']});
        })
        .catch(function(error) {
            console.log('Error getting image data from django backend: ', error);
            return NextResponse.json({ success: false, error: 'Failed to get image data from Django', status: error.response.status });
        })

}