from django.contrib.auth import get_user_model
from expander import ExpanderSerializerMixin
from rest_framework import serializers

from . import models


class UserSerializer(serializers.HyperlinkedModelSerializer):
    """
    This class is responsible for the serialization of the 'User' model
    """

    class Meta:
        # The 'User' model is pluggable, so use this function instead of an
        # import
        model = get_user_model()

        # Attributes to exclude from serialization
        exclude = ('password', 'groups', 'user_permissions')


class CountrySerializer(serializers.HyperlinkedModelSerializer):
    """
    This class is responsible for the serialization of the 'Country' model
    """

    class Meta:
        model = models.Country


class LanguageSerializer(serializers.HyperlinkedModelSerializer):
    """
    This  class is responsible for the serialization of the 'Language' model
    """

    class Meta:
        model = models.Language


class ProductSerializer(ExpanderSerializerMixin, serializers.HyperlinkedModelSerializer):
    """
    This class is responsible for the serialization of the 'Product' model'
    """

    skills = serializers.HyperlinkedRelatedField(view_name='skill-detail', many=True, read_only=True)

    class Meta:
        model = models.Product


class SkillSerializer(ExpanderSerializerMixin, serializers.HyperlinkedModelSerializer):
    """
    This class is responsible for the serialization of the 'Skill' model
    """

    class Meta:
        model = models.Skill


class CategorySerializer(ExpanderSerializerMixin, serializers.HyperlinkedModelSerializer):
    """
    This class is responsible for the serialization of the 'Category' model
    """

    products = serializers.HyperlinkedRelatedField(view_name='product-detail', many=True, read_only=True)

    children = serializers.HyperlinkedRelatedField(view_name='category-detail', many=True, read_only=True)

    class Meta:
        model = models.Category


class NoteSerializer(serializers.HyperlinkedModelSerializer):
    """
    This class is responsible for the serialization of the 'Note' model
    """

    class Meta:
        model = models.Note


class EngineerSerializer(ExpanderSerializerMixin, serializers.HyperlinkedModelSerializer):
    """
    This class is responsible for the serialization of the 'Engineer' model
    """

    # Skills is a reverse relation, so add it manually
    skills = serializers.HyperlinkedRelatedField(view_name='skill-detail', many=True, read_only=True)

    note = serializers.HyperlinkedRelatedField(view_name='note-detail', read_only=True)

    class Meta:
        model = models.Engineer


# Python does not have 'hoisting'. That is, you can not reference a class that is later defined. Because the
# SkillSerializer has a reference to the EngineerSerializer, we have to add this reference after the declaration of
# the EngineerSerializer
SkillSerializer.Meta.expandable_fields = {
    'engineer': EngineerSerializer,
    'product': ProductSerializer
}

CategorySerializer.Meta.expandable_fields = {
    'parent': CategorySerializer,
    'children': (CategorySerializer, (), {'many': True}),
    'products': (ProductSerializer, (), {'many': True})
}

ProductSerializer.Meta.expandable_fields = {
    'category': CategorySerializer,
    'skills': (SkillSerializer, (), {'many': True})
}

EngineerSerializer.Meta.expandable_fields = {
    'country': CountrySerializer,
    'countries': (CountrySerializer, (), {'many': True}),
    'languages': (LanguageSerializer, (), {'many': True}),
    'skills': (SkillSerializer, (), {'many': True}),
    'note': NoteSerializer
}
