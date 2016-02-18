from django.conf.urls import url

from .views import home

# Frontend URLs go here
urlpatterns = [
    # Sample url with template
    url(r'^$', home, name='index'),
]