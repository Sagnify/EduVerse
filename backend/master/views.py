from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import authenticate, login
from django.contrib import messages
from main.models import *
from django.contrib.auth.models import User

def login_page(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
             if user.is_superuser:
                login(request, user)
                return redirect('master_page')  # Change this to your admin dashboard view
             else:
                messages.error(request, "You do not have permission to access the admin panel")
                print("You do not have permission to access the admin panel")
        else:
            messages.error(request, "Invalid username or password")
            print("Invalid username or password")
    
    return render(request, 'login.html')

def master_page(request):
   return render(request,'dashboard.html')


def library_review(request):
    return render(request, 'library_review.html')

def lecture_review(request):
    return render(request, 'lecture_review.html')
