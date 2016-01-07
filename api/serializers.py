from django.contrib.auth import get_user_model
from rest_framework import serializers

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


class EngineerSerializer(serializers.ModelSerializer):
    """
    This class is responsible for the serialization of the 'Engineer' model
    """

    class Meta:
        model = models.Engineer

        #exclude = ('countries', 'languages')


class SkillSerializer(serializers.ModelSerializer):
    """
    This class is responsible for the serialization of the 'Skill' model
    """

    class Meta:
        model = models.Skill


class ProductSerializer(serializers.ModelSerializer):
    """
    This class is responsible for the serialization of the 'Product' model'
    """

    class Meta:
        model = models.Product
