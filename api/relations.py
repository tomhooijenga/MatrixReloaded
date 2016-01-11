from rest_framework import serializers
from rest_framework.reverse import reverse


class HyperlinkedRelatedCollection(serializers.HyperlinkedRelatedField):
    def get_url(self, obj, view_name, request, format):
        url_kwargs = {
            'engineer': obj.pk
        }

        return reverse(view_name, kwargs=url_kwargs, request=request, format=format)

    def get_object(self, view_name, view_args, view_kwargs):
        pass
