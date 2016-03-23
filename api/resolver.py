from urllib.parse import urlparse
from django.core.urlresolvers import resolve, Resolver404


def url_kwargs(data):
    """
    Extract the kwargs from an url
    """
    url = urlparse(data)

    try:
        return resolve(url.path).kwargs
    except Resolver404:
        return None
