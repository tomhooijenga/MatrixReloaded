from django.conf.urls import url
from django.contrib.auth.views import login, logout_then_login

from .views import index, engineers, products, categories, users

# Backend URLs go here
urlpatterns = [
    url('^$', index),

    url(r'engineers/$', engineers, name='backend-engineers'),
    url(r'products/$', products, name='backend-products'),
    url(r'categories/$', categories, name='backend-categories'),
    url(r'users/$', users, name='backend-users'),

    url(r'login/$', login),
    url(r'logout/$', logout_then_login, name='logout')
]
