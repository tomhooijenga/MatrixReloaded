from django.conf.urls import url, include
from django.conf import settings

from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

# Groups
router.register(r'groups', views.GroupViewSet)
# Users
router.register(r'users', views.UserViewSet)
# Engineers
router.register(r'engineers', views.EngineerViewSet)
router.register(r'engineers/(?P<engineer>\d+)/countries', views.EngineerCountriesViewSet)
router.register(r'engineers/(?P<engineer>\d+)/languages', views.EngineerLanguagesViewSet)
# Countries
router.register(r'countries', views.CountryViewSet)
# Languages
router.register(r'languages', views.LanguageViewSet)
# Skills
router.register(r'skills', views.SkillViewSet)
# Products
router.register(r'products', views.ProductViewSet)
# Categories
router.register(r'categories', views.CategoryViewSet)
# Notes
router.register(r'notes', views.NoteViewSet)

# API URLs go here
urlpatterns = [
    url(r'', include(router.urls))
]

if settings.DEBUG:
    # API browser
    urlpatterns.append(url(r'auth/', include('rest_framework.urls', namespace='rest_framework')))