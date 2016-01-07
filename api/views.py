from django.contrib.auth import get_user_model
from rest_framework import viewsets

from . import serializers, models


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the users. Read and write.
    """

    # The default queryset
    queryset = get_user_model().objects.all()

    # The default serializer
    serializer_class = serializers.UserSerializer


class EngineerViewSet(viewsets.ModelViewSet):
    """
    API endpoint for engineers. Read and write.
    """

    # The default queryset
    queryset = models.Engineer.objects.all()

    # The default serializer
    serializer_class = serializers.EngineerSerializer

    def get_queryset(self):
        """
        Override the default queryset to pre-load the country
        :return:
        """
        return self.queryset.select_related('country').prefetch_related(
                'countries', 'languages', 'skills')


class CountryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for the countries. Read only.
    """

    queryset = models.Country.objects.all()

    serializers_class = serializers.CountrySerializer


class LanguageViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for the languages. Read only.
    """

    queryset = models.Language.objects.all()

    serializers_class = serializers.LanguageSerializer


class SkillViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the Skills.
    """

    queryset = models.Skill.objects.all()

    serializer_class = serializers.SkillSerializer


class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the products
    """

    queryset = models.Product.objects.all()

    serializer_class = serializers.ProductSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the categories
    """

    queryset = models.Category.objects.all()

    serializer_class = serializers.CategorySerializer
