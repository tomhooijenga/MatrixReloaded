from django.conf.urls import url

from .views import home

# Frontend URLs go here
urlpatterns = [
    url(r'^$', home, name='index'),
]