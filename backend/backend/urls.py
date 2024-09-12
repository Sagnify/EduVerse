"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from master.views import *


urlpatterns = [
    # path('admin/', admin.site.urls),
    # path( 'admin/login/', views.login_page,name='login_page'),
    path('master/login/', login_page, name='login_page'),
    path('master/', master_page, name='master_page'),
    path('master/library-review/', library_review, name='library_review'),
    path('verify-book/<uuid:book_id>/', verify_book, name='verify_book'),
    path('master/lecture-review/', lecture_review, name='lecture_review'),
    path('logout/', logout_page, name='logout_page'),    
    path('api/', include('main.urls'))
]
