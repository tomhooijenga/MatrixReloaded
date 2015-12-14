from django.conf.urls import include, url
import api.urls
import backend.urls
import frontend.urls

urlpatterns = [
    url(r'^api/', include(api.urls.urlpatterns)),
    url(r'^admin/', include(backend.urls.urlpatterns)),
    url(r'', include(frontend.urls.urlpatterns))
]
