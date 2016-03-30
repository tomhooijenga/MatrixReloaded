from datetime import date

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from rest_framework import serializers

from . import models


class DynamicHyperlinkedModelSerializer(serializers.HyperlinkedModelSerializer):
    def __init__(self, *args, **kwargs):
        exclude = kwargs.pop('exclude', None)

        expanded_fields = kwargs.pop('expanded_fields', None)
        expandable_fields = kwargs.pop('expandable_fields', None)

        super(DynamicHyperlinkedModelSerializer, self).__init__(*args, **kwargs)

        # Exclude
        if exclude is not None:
            for field in exclude:
                self.fields.pop(field)

        # Expansion
        if expandable_fields is None and expanded_fields is None:
            expandable_fields = getattr(self.Meta, 'expandable_fields', None)

        if not expandable_fields:
            return

        if not expanded_fields:
            context = self.context
            if not context:
                return

            request = context.get('request', None)
            if not request:
                return

            expanded_fields = request.query_params.get('expand', None)
            if not expanded_fields:
                return

        for expanded_field in expanded_fields.split(','):
            next_level_expanded_field = ''

            if '.' in expanded_field:
                expanded_field, next_level_expanded_field = expanded_field.split('.', 1)

            if expanded_field in expandable_fields:
                serializer_class_info = expandable_fields[expanded_field]

                # Two formats
                # 1. CLASS
                # 2. (CLASS, args, kwargs)
                if isinstance(serializer_class_info, tuple):
                    serializer_class, args, kwargs = serializer_class_info
                else:
                    args = ()
                    kwargs = {}
                    serializer_class = serializer_class_info

                # If the serializer class isn't an expander then it can't handle the expanded_fields kwarg.
                if issubclass(serializer_class, DynamicHyperlinkedModelSerializer):
                    serializer = serializer_class(*args, expanded_fields=next_level_expanded_field, **kwargs)
                else:
                    serializer = serializer_class(*args, **kwargs)

                self.fields[expanded_field] = serializer


class PermissionSerializer(serializers.ModelSerializer):
    """
    This class is responsible for the serialization of the 'Permission' model
    """

    class Meta:
        model = Permission

        fields = ('codename',)


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    """
    This class is responsible for the serialization of the 'Group' model
    """

    permissions = PermissionSerializer(many=True, read_only=True)

    class Meta:
        model = Group

        fields = ('url', 'name', 'permissions')


class UserSerializer(DynamicHyperlinkedModelSerializer):
    """
    This class is responsible for the serialization of the 'User' model
    """

    class Meta:
        # The 'User' model is pluggable, so use this function instead of an
        # import
        model = get_user_model()

        # Attributes to exclude from serialization
        fields = ('url', 'email', 'groups', 'is_active')


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


class ProductSerializer(DynamicHyperlinkedModelSerializer):
    """
    This class is responsible for the serialization of the 'Product' model'
    """

    skills = serializers.HyperlinkedRelatedField(view_name='skill-detail', many=True, read_only=True)

    class Meta:
        model = models.Product


class SkillSerializer(DynamicHyperlinkedModelSerializer):
    """
    This class is responsible for the serialization of the 'Skill' model
    """

    class Meta:
        model = models.Skill


class CategorySerializer(DynamicHyperlinkedModelSerializer):
    """
    This class is responsible for the serialization of the 'Category' model
    """

    products = serializers.HyperlinkedRelatedField(view_name='product-detail', many=True, read_only=True)

    children = serializers.HyperlinkedRelatedField(view_name='category-detail', many=True, read_only=True)

    class Meta:
        model = models.Category


class NoteSerializer(DynamicHyperlinkedModelSerializer):
    """
    This class is responsible for the serialization of the 'Note' model
    """

    visible_from = serializers.DateField(default=date.today)

    class Meta:
        model = models.Note

    def validate(self, data):
        if 'visible_until' in data:
            if data['visible_until'] < data['visible_from']:
                raise serializers.ValidationError('visible_until must be after visible_from');

        return data


class EngineerSerializer(DynamicHyperlinkedModelSerializer):
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
UserSerializer.Meta.expandable_fields = {
    'groups': (GroupSerializer, (), {'many': True})
}

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
    'category': (CategorySerializer, (), {
        'exclude': ('products', 'children'),
        'expandable_fields': {
            'parent': (CategorySerializer, (), {
                'exclude': ('products', 'children')
            }),
        }
    }),
    'skills': (SkillSerializer, (), {
        'many': True,
        'expandable_fields': {
            'engineer': EngineerSerializer
        }
    })
}

EngineerSerializer.Meta.expandable_fields = {
    'country': CountrySerializer,
    'countries': (CountrySerializer, (), {'many': True}),
    'languages': (LanguageSerializer, (), {'many': True}),
    'skills': (SkillSerializer, (), {
        'many': True,
        'expandable_fields': {}
    }),
    'note': (NoteSerializer, (), {
        'expandable_fields': {}
    })
}
