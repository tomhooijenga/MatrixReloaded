from django.contrib.auth import get_user_model
from expander import ExpanderSerializerMixin
from rest_framework import serializers, filters

from . import models


class UserSerializer(serializers.ModelSerializer):
    """
    This class is responsible for the serialization of the 'User' model
    """

    class Meta:
        # The 'User' model is pluggable, so use this function instead of an
        # import
        model = get_user_model()

        # Attributes to exclude from serialization
        exclude = ('password', 'groups', 'user_permissions')


class CountrySerializer(serializers.ModelSerializer):
    """
    This class is responsible for the serialization of the 'Country' model
    """

    class Meta:
        model = models.Country


class LanguageSerializer(serializers.ModelSerializer):
    """
    This  class is responsible for the serialization of the 'Language' model
    """

    class Meta:
        model = models.Language


class ProductSerializer(serializers.ModelSerializer):
    """
    This class is responsible for the serialization of the 'Product' model'
    """

    class Meta:
        model = models.Product


class SkillSerializer(ExpanderSerializerMixin, serializers.ModelSerializer):
    """
    This class is responsible for the serialization of the 'Skill' model
    """

    class Meta:
        model = models.Skill


class EngineerSerializer(ExpanderSerializerMixin, serializers.HyperlinkedModelSerializer):
    """
    This class is responsible for the serialization of the 'Engineer' model
    """

    # Skills is a reverse relation, so add it manually
    skills = serializers.HyperlinkedRelatedField(view_name='skill-detail', many=True, read_only=True)

    class Meta:
        model = models.Engineer

        expandable_fields = {
            'country': CountrySerializer,
            'countries': (CountrySerializer, (), {'many': True}),
            'languages': (LanguageSerializer, (), {'many': True}),
            'skills': (SkillSerializer, (), {'many': True})
        }


# Python does not have 'hoisting'. That is, you can not reference a class that is later defined. Because the
# SkillSerializer has a reference to the EngineerSerializer, we have to add this reference after the declaration of
# the EngineerSerializer
SkillSerializer.Meta.expandable_fields = {
    'engineer': EngineerSerializer,
    'product': ProductSerializer
}
