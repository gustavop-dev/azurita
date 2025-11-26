from django.shortcuts import render

def index(request):
    """Vista principal que sirve el frontend de Vue"""
    return render(request, 'index.html')
