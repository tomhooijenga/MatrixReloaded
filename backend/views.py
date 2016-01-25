from django.contrib.auth import get_user_model
from django.shortcuts import render

from api.models import Engineer, Product, Category


def engineers(request):
    return render(request, 'engineers.html', {
        'meta': Engineer._meta
    })


def products(request):
    return render(request, 'products.html', {
        'meta': Product._meta
    })


def categories(request):
    return render(request, 'categories.html', {
        'meta': Category._meta
    })


def users(request):
    return render(request, 'users.html', {
        'meta': get_user_model()._meta
    })
