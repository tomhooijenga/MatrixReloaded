from django.conf.urls import url
from django.contrib.auth.views import login, logout_then_login, password_reset_confirm

from . import views

# Backend URLs go here
urlpatterns = [
    url('^$', views.index),

    url(r'engineers/$', views.engineers, name='backend-engineers'),
    url(r'products/$', views.products, name='backend-products'),
    url(r'categories/$', views.categories, name='backend-categories'),
    url(r'users/$', views.users, name='backend-users'),

    url(r'login/$', login),
    url(r'logout/$', logout_then_login, name='logout'),

    url(r'forbidden/$', views.forbidden),

    url(r'reset/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        password_reset_confirm, name='password_reset_confirm'),
    url(r'reset/done/$', logout_then_login, name='password_reset_complete'),
]
