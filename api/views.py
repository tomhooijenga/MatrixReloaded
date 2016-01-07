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


class EngineerCountriesViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the engineer's countries
    """

    # The default queryset
    queryset = models.Country.objects.all()

    # The default serializer
    serializer_class = serializers.CountrySerializer

    def get_queryset(self):
        """
        Override the default queryset to limit the countries to the specified
        engineer
        :return:
        """
        engineer = self.kwargs['engineer']

        return self.queryset.filter(engineers__id=engineer)


class EngineerSkillsViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the engineer's skills
    """

    # The default queryset
    queryset = models.Skill.objects.all()

    # The default serializer
    serializer_class = serializers.SkillSerializer

    # def get_queryset(self):
    #     """
    #     Override the default queryset to limit the skills to the specified
    #     engineer
    #     :return:
    #     """
    #     engineer = self.kwargs['engineer']
    #
    #     return self.queryset.filter(engineer_id=engineer)


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

    serializers_class = serializers.SkillSerializer
