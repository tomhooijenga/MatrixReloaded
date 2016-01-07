from django.conf.urls import url, include
from django.conf import settings

from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
# Engineers
router.register(r'engineers', views.EngineerViewSet)
# Countries
router.register(r'countries', views.CountryViewSet)
# Languages
router.register(r'languages', views.LanguageViewSet)
# Skills
router.register(r'skills', views.SkillViewSet)
# Products
router.register(r'products', views.ProductViewSet)

# API URLs go here
urlpatterns = [
    url(r'', include(router.urls))
]

if settings.DEBUG:
    # API browser
    urlpatterns.append(url(r'auth/', include('rest_framework.urls', namespace='rest_framework')))