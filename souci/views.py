from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import Image
from .utils import ocr_extract
import datetime
from django.core.files import File
from django.core.files.base import ContentFile
from django.core.files.temp import NamedTemporaryFile
from urllib.request import urlopen
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import Http404
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie

import base64
import json
import uuid

# Create your views here.
def index(request):
    return HttpResponse("Hello world. This is souci landing page.")

# @ensure_csrf_cookie
def get_csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'X-CSRFToken': csrf_token, 'Info': 'Success - Set CSRF cookie'})

@csrf_exempt
def display(request, image_name):
    print("this is image_Name", image_name)
    if request.method == 'GET':
        try:
            image_name = base64.urlsafe_b64decode(image_name).decode()
            print("this is image name url re-decoded", image_name)
            image = Image.objects.get(title = image_name)
            image_extract = ocr_extract(image.image.path)

            #get image as base64 encoded string
            with open(image.image.path, "rb") as image_file:
                image_data = base64.b64encode(image_file.read()).decode('utf-8')

            # Return success respnse
            return JsonResponse({'success': True, 'image_data': image_data, 'image_extract': json.dumps(image_extract)})
        except Image.DoesNotExist:
            return JsonResponse({'error': 'Image not found'})
    else:
        # Only accept GET requests
        return JsonResponse({'success': False, 'error': 'Method not allowed'}, status=405)

@csrf_exempt
def extract(request): #for nextjs frontend
    if request.method == 'POST':
        req_json = json.loads(request.body.decode('utf-8'))
        # print("this is req_json", req_json)
        image_data = req_json.get('imageData')
        if image_data:
            image_format, image_str = image_data.split(';base64,')
            image_ext = image_format.split('/')[-1]
            image_meta = base64.b64decode(image_str)

            # Save the image data to model
            time = datetime.datetime.today().strftime('%s')
            image_name = time + "." + image_ext
            image_obj = Image.objects.create(title=image_name)
            image_obj.image.save(image_name, ContentFile(image_meta))
            print("new image", image_name, " saved")

            image_name_b64 = base64.urlsafe_b64encode(image_name.encode()).decode()
            print("this is image name url encoded", image_name_b64)

            # Return success response
            return JsonResponse({'success': True, 'image_name': image_name, 'image_name_b64': image_name_b64})
        else:
            # No image data found in the request
            return JsonResponse({'success': False, 'error': 'No image data found'})
    else:
        # Only accept POST requests
        return JsonResponse({'success': False, 'error': 'Method not allowed'}, status=405)

def capture(request): #for django frontend
    if request.method == 'POST':
        if 'webimg' in request.POST:
            image_data = request.POST['webimg'].split(',')[1]
            image_data = base64.b64decode(image_data)

            # Save the image data to model
            time = datetime.datetime.today().strftime('%s')
            image_name = time+'.jpg'
            image_obj = Image.objects.create(title=image_name)
            image_obj.image.save(image_name, ContentFile(image_data))
            
            return JsonResponse({'success': True, 'redirect_url': '/souci/show/'})
        else:
            return JsonResponse({'success': False, 'error': 'No image data found'})
    return render(request, 'souci/capture.html')

def show(request):
    try:
        image = Image.objects.last()
        image_extract = ocr_extract(image.image.path)
    except Image.DoesNotExist:
        raise Http404("No images found")
    return render(request, 'souci/show.html', {'image': image, 'image_extract': json.dumps(image_extract)})
