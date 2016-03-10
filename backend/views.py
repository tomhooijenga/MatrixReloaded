from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import render, redirect

from api.models import Engineer, Product, Category


def index(request):
    """
    There is no index. Instead, redirect to the engineers page.
    """
    return redirect('backend-engineers', permanent=True)


@login_required
@user_passes_test(lambda u: (u.has_perm('api.add_engineer') or u.has_perm('api.change_engineer')))
def engineers(request):
    return render(request, 'engineers.html', {
        'meta': Engineer._meta
    })


@login_required
@user_passes_test(lambda u: (u.has_perm('api.add_product') or u.has_perm('api.change_product')))
def products(request):
    return render(request, 'products.html', {
        'meta': Product._meta
    })


@login_required
@user_passes_test(lambda u: (u.has_perm('api.add_category') or u.has_perm('api.change_category') or u.has_perm(
    'api.delete_category')))
def categories(request):
    return render(request, 'categories.html', {
        'meta': Category._meta
    })


@login_required
@user_passes_test(lambda u: (u.has_perm('api.add_user') or u.has_perm('api.change_user')))
def users(request):
    return render(request, 'users.html', {
        'meta': get_user_model()._meta
    })
