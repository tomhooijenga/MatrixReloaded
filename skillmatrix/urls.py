from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static

import api.urls
import backend.urls
import frontend.urls

urlpatterns = [
    url(r'^api/', include(api.urls.urlpatterns)),
    url(r'^admin/', include(backend.urls.urlpatterns)),
    url(r'^', include(frontend.urls.urlpatterns))
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
