from django.conf.urls import url
from django.contrib.auth.views import login, logout_then_login, password_reset


from .views import engineers, products, categories, users

# Backend URLs go here
urlpatterns = [
    # Sample url with template
    url(r'engineers/$', engineers, name='backend-engineers'),
    url(r'products/$', products, name='backend-products'),
    url(r'categories/$', categories, name='backend-categories'),
    url(r'users/$', users, name='backend-users'),

    url(r'login/$', login),
    url(r'logout/$', logout_then_login, name='logout')
]
