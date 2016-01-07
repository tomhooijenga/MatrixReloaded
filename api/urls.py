from django.conf.urls import url, include
from django.conf import settings

from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
# Engineers
router.register(r'engineers', views.EngineerViewSet)
# Engineer's countries
router.register(r'engineers/(?P<engineer>\d+)/countries',
                views.EngineerCountriesViewSet)
# Engineer's skills
router.register(r'engineers/(?P<engineer>\d+)/skills',
                views.EngineerSkillsViewSet)
# Countries
# router.register(r'countries', views.CountryViewSet)
# Languages
# router.register(r'languages', views.LanguageViewSet)
# # Skills
# router.register(r'skills', views.SkillViewSet)

# API URLs go here
urlpatterns = [
    url(r'', include(router.urls))
]

if settings.DEBUG:
    # API browser
    urlpatterns.append(url(r'auth/', include('rest_framework.urls', namespace='rest_framework')))