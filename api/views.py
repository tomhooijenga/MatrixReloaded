from django.contrib.auth import get_user_model
from rest_framework import status
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
    queryset = models.Engineer.objects.all().select_related('country', 'note').prefetch_related('countries',
                                                                                                'languages',
                                                                                                'skills')

    # The default serializer
    serializer_class = serializers.EngineerSerializer

    def filter_queryset(self, queryset):
        # Filter the engineers to have at least one of their operating countries in the list
        countries = self.request.query_params.get('countries', None)
        if countries is not None:
            # Convert to list of country codes
            countries = countries.upper().split(',')
            queryset = queryset.filter(countries__code__in=countries)

        # filter by active status. Is actually 3 values:
        # true: active only
        # false: not active only
        # omitted: include all
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            if is_active.lower() in ('true', '1'):
                queryset = queryset.filter(is_active=True)
            elif is_active.lower() in ('false', '0'):
                queryset = queryset.filter(is_active=False)

        return queryset


class EngineerCountriesViewSet(mixins.RetrieveModelMixin,
                               mixins.ListModelMixin,
                               GenericViewSet):
    """
    API endpoint for the engineer's countries
    """

    # The default queryset
    queryset = models.Country.objects.all()

    # The default serializer
    serializer_class = serializers.CountrySerializer

    def get_queryset(self):
        """
        Filter the countries to only return those of the engineer
        """
        engineer = self.kwargs['engineer']

        return self.queryset.filter(engineers__id=engineer)

    def update(self, request, *args, **kwargs):
        """
        Create a link between a country and an engineer
        """
        engineer = models.Engineer.objects.get(pk=kwargs['engineer'])
        country = models.Country.objects.get(pk=kwargs['pk'])

        engineer.countries.add(country)

        return self.list(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """
        Destroy a link between a country and an engineer
        """
        engineer = models.Engineer.objects.get(pk=kwargs['engineer'])
        country = models.Country.objects.get(pk=kwargs['pk'])

        engineer.countries.remove(country)

        return Response(status=status.HTTP_204_NO_CONTENT)


class EngineerLanguagesViewSet(mixins.RetrieveModelMixin,
                               mixins.ListModelMixin,
                               GenericViewSet):
    """
    API endpoint for the engineer's languages
    """

    # The default queryset
    queryset = models.Language.objects.all()

    # The default serializer
    serializer_class = serializers.LanguageSerializer

    def get_queryset(self):
        """
        Filter the countries to only return those of the engineer
        """
        engineer = self.kwargs['engineer']

        return self.queryset.filter(engineers__id=engineer)

    def update(self, request, *args, **kwargs):
        """
        Create a link between a language and an engineer
        """
        engineer = models.Engineer.objects.get(pk=kwargs['engineer'])
        language = models.Language.objects.get(pk=kwargs['pk'])

        engineer.languages.add(language)

        return self.list(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """
        Destroy a link between a language and an engineer
        """
        engineer = models.Engineer.objects.get(pk=kwargs['engineer'])
        country = models.Country.objects.get(pk=kwargs['pk'])

        engineer.countries.remove(country)

        return Response(status=status.HTTP_204_NO_CONTENT)


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

    queryset = models.Skill.objects.all().select_related('engineer', 'product')

    serializer_class = serializers.SkillSerializer

    def filter_queryset(self, queryset):
        # filter by active status. Is actually 3 values:
        # true: active only
        # false: not active only
        # omitted: include all
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            if is_active.lower() in ('true', '1'):
                queryset = queryset.filter(is_active=True)
            elif is_active.lower() in ('false', '0'):
                queryset = queryset.filter(is_active=False)

        return queryset


class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the products
    """

    queryset = models.Product.objects.all().select_related('category').prefetch_related('skills')

    serializer_class = serializers.ProductSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the categories
    """

    queryset = models.Category.objects.all().select_related('parent').prefetch_related('children')

    serializer_class = serializers.CategorySerializer


class NoteViewSet(viewsets.ModelViewSet):
    """
    API endpoint for notes
    """

    queryset = models.Note.objects.all()

    serializer_class = serializers.NoteSerializer
