from django.conf.urls import url

from .views import engineers, products, categories, users

# Backend URLs go here
urlpatterns = [
    # Sample url with template
    url(r'engineers$', engineers, name='backend-engineers'),
    url(r'products', products, name='backend-products'),
    url(r'categories', categories, name='backend-categories'),
    url(r'users', users, name='backend-users')

]
