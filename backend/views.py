from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required, user_passes_test
from django.http import HttpResponseForbidden
from django.shortcuts import render, redirect
from django.template import loader

from api.models import Engineer, Product, Category


def index(request):
    """
    There is no index. Instead, redirect to the engineers page.
    """
    return redirect('backend-engineers', permanent=True)


@login_required
@user_passes_test(lambda u: (u.has_perm('api.add_engineer') or u.has_perm('api.change_engineer')),
                  login_url='/admin/forbidden', redirect_field_name=None)
def engineers(request):
    return render(request, 'engineers.html', {
        'meta': Engineer._meta,
        'can_add': request.user.has_perm('api.add_engineer')
    })


@login_required
@user_passes_test(lambda u: (u.has_perm('api.add_product') or u.has_perm('api.change_product')),
                  login_url='/admin/forbidden', redirect_field_name=None)
def products(request):
    return render(request, 'products.html', {
        'meta': Product._meta,
        'can_add': request.user.has_perm('api.add_product')
    })


@login_required
@user_passes_test(lambda u: (u.has_perm('api.add_category') or u.has_perm('api.change_category') or u.has_perm(
    'api.delete_category')), login_url='/admin/forbidden', redirect_field_name=None)
def categories(request):
    return render(request, 'categories.html', {
        'meta': Category._meta,
        'can_add': request.user.has_perm('api.add_category')
    })


@login_required
@user_passes_test(lambda u: (u.has_perm('api.add_user') or u.has_perm('api.change_user')),
                  login_url='/admin/forbidden', redirect_field_name=None)
def users(request):
    return render(request, 'users.html', {
        'meta': get_user_model()._meta,
        'can_add': request.user.has_perm('api.add_user')
    })


def forbidden(request):
    t = loader.get_template('errors/403.html')
    return HttpResponseForbidden(t.render(request))
