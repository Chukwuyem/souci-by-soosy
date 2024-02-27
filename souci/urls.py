from django.urls import path
from django.conf import settings
from django.views.static import serve
from django.conf.urls.static import static

from . import views

urlpatterns = [
    path("api/get-csrf-token/", views.get_csrf_token, name='get_csrf_token'),
    path("extract/", views.extract, name="extract"), #for nextjs frontend
    path("display/<str:image_name>", views.display, name="display"), #for nextjs frontend
    path("capture/", views.capture, name="capture"), #for django frontend
    path("show/", views.show, name="show"), #for django frontend
    path("", views.index, name="index"),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)