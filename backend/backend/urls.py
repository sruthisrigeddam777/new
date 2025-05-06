from django.contrib import admin
from django.urls import path, include
from api.views import homepage

urlpatterns = [
    path('',homepage, name='home'),
    path('admin/', admin.site.urls),
    path('auth/', include('api.urls')),  # Include API URLs
]