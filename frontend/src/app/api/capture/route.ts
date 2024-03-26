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
  //const csrfToken = csrfResponse.headers['x-csrftoken'];
  // console.log("this is csrf response headers", csrfResponse.headers)

  // const csrfString = typeof csrfResponse.headers?.['set-cookie']?.[0] === 'string'
  //   ? csrfResponse.headers['set-cookie'][0].split(';')[0]
  //   : undefined;
  
  const setCookieHeader = csrfResponse.headers['set-cookie'];
  let csrfToken;
  
  if (setCookieHeader && Array.isArray(setCookieHeader)) {
      for (const cookie of setCookieHeader) {
          const match = cookie.match(/csrftoken=([^;]+)/);
          if (match) {
              csrfToken = match[1];
              break;
          }
      }
  }
  console.log("this is csrf token from get-csrf-token ", csrfToken)
  
  //const csrfToken = cookies().get('csrftoken')
  //console.log("this is NEW csrf token", csrfToken)


  return await axios.post('http://localhost:8000/souci/extract/',
    { imageData },
    {
      headers : {
        "X-CSRFToken": csrfToken,
      }
    })
    .then(function(response) {
      // console.log('Response from django backend: ', response.data);
      // console.log('Response status from django backend: ', response.status);
      // const imageUrl = response.data["image_name"]
      // const imageUrlb64 = response.data["image_name_b64"]
      // console.log(imageUrl)
      return NextResponse.json(response.data, {status: response.status});
    })
    .catch(function(error) {
      console.log('Error sending image data to django backend:', error);
      return NextResponse.json({ success: false, error: 'Failed to send image data to Django', status: error.response.status });
    });

}
