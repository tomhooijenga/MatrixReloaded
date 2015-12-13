from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework.serializers import HyperlinkedModelSerializer

class UserSerializer(HyperlinkedModelSerializer):
    """
    This class is responsible for the serialization of the 'User' model
    """
    class Meta:
        model = get_user_model()

        # Attributes to exclude from serialization
        exclude = ('password', 'groups', 'user_permissions')

class GroupSerializer(HyperlinkedModelSerializer):
    """
    This class is responsible for the serialization of the 'Group' model
    """
    class Meta:
        model = Group

        include = ('id', 'name')