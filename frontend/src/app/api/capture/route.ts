import { NextResponse  } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';


export async function POST(req: Request) {

  const client_req_json  = await req.json();
  const imageData = client_req_json['imageData']
  //console.log(imageData)


  // Fetch CSRF token from Django backend
  const csrfResponse = await axios.get('http://localhost:8000/souci/api/get-csrf-token/');
  //const csrfToken = csrfResponse.headers['set-cookie'][0].split(';')[0];
  const csrfToken = csrfResponse.data.csrf_token;


  return await axios.post('http://localhost:8000/souci/extract/',
    { imageData },
    {
      headers : {
        "X-CSRFToken": csrfToken,
      },
      withCredentials: true
    })
    .then(function(response) {
      console.log('Response from django backend: ', response.data);
      console.log('Response status from django backend: ', response.status);
      const imageUrl = response.data["image_name"]
      const imageUrlb64 = response.data["image_name_b64"]
      console.log(imageUrl)
      console.log("this is req.url", req.url)
      return NextResponse.json(response.data, {status: response.status});

      const displayUrl = new URL('/display', req.url)
      displayUrl.searchParams.set('image', imageUrlb64)
      console.log("is this display url", displayUrl)
      //return NextResponse.redirect(displayUrl)
      //redirect()
    })
    .catch(function(error) {
      console.log('Error sending image data to django backend:', error);
      return NextResponse.json({ success: false, error: 'Failed to send image data to Django', status: error.response.status });
    });

}
