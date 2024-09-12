from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import authenticate, login
from django.contrib import messages
from main.models import *
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from django.contrib.auth import logout

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
    if not request.user.is_superuser:
        return HttpResponse("Unauthorized", status=401)
    
    Libasset=LibAsset.objects.filter(is_verified=False)
    context={'lib':Libasset, 'select': 'lib'}
    return render(request, 'library.html',context)


@csrf_exempt
def verify_book(request, book_id):  # Accept book_id from the URL
    if request.method == 'POST':
        try:
            book = LibAsset.objects.get(uuid=book_id)
            book.is_verified = True
            book.save()
            return JsonResponse({'success': True})
        except LibAsset.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Book not found'}, status=404)

    return JsonResponse({'success': False}, status=400)


@csrf_exempt
def verify_lecture(request, id):  # Accept book_id from the URL
    if request.method == 'POST':
        try:
            lecture = Lecture.objects.get(id=id)
            lecture.is_verified = True
            lecture.save()
            return JsonResponse({'success': True})
        except lecture.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Lecture not found'}, status=404)

    return JsonResponse({'success': False}, status=400)


def lecture_review(request):
    if not request.user.is_superuser:
        return HttpResponse("Unauthorized", status=401)
    
    Lectures =Lecture.objects.filter(visibility=False)
    context={'lectures':Lectures, 'select':'lec'}

    return render(request, 'lectures.html', context)


def logout_page(request):
   logout(request)
   return redirect('login_page')