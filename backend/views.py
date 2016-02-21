from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect

from api.models import Engineer, Product, Category


def index(request):
    """
    There is no index. Instead, redirect to the engineers page.
    """
    return redirect('backend-engineers', permanent=True)


@login_required
def engineers(request):
    return render(request, 'engineers.html', {
        'meta': Engineer._meta
    })


@login_required
def products(request):
    return render(request, 'products.html', {
        'meta': Product._meta
    })


@login_required
def categories(request):
    return render(request, 'categories.html', {
        'meta': Category._meta
    })


@login_required
def users(request):
    return render(request, 'users.html', {
        'meta': get_user_model()._meta
    })
