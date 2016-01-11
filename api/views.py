from django.contrib.auth import get_user_model
from rest_framework import viewsets, mixins
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

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


class EngineerCountriesViewSet(mixins.RetrieveModelMixin,
                               mixins.UpdateModelMixin,
                               mixins.DestroyModelMixin,
                               mixins.ListModelMixin,
                               GenericViewSet):
    """
    API endpoint for the engineer's countries.
    GET     /engineers/:engineer/countries              Show all the engineer's countries
    GET     /engineers/:engineer/countries/:country     Show the country or 404 if there's no link
    PUT     /engineers/:engineer/countries/:country     Creates a link
    DELETE  /engineers/:engineer:/countries:country     Deletes a link
    """

    # The default queryset
    queryset = models.Country.objects.all()

    # The default serializer
    serializer_class = serializers.CountrySerializer

    def get_queryset(self):
        """
        Filter the countries to only return those of the engineer
        :return:
        """
        engineer = self.kwargs['engineer']

        return self.queryset.filter(engineers__id=engineer)

    def update(self, request, *args, **kwargs):
        """
        Create a link between a country and an engineer
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        engineer = models.Engineer.objects.get(pk=kwargs['engineer'])
        country = models.Country.objects.get(pk=kwargs['pk'])

        engineer.countries.add(country)

        return Response(self.get_serializer(country))

    def destroy(self, request, *args, **kwargs):
        """
        Destroy a link between a country and an engineer
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        engineer = models.Engineer.objects.get(pk=kwargs['engineer'])
        country = models.Country.objects.get(pk=kwargs['pk'])

        engineer.countries.remove(country)

        return Response(self.get_serializer(country))


class CountryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for the countries. Read only.
    """

    queryset = models.Country.objects.all()

    serializer_class = serializers.CountrySerializer


class LanguageViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for the languages. Read only.
    """

    queryset = models.Language.objects.all()

    serializer_class = serializers.LanguageSerializer


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
