from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from .serializers import *


class UserViewSet(ModelViewSet):
    """
    API endpoint for the users. Read and write.
    """

    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer


class GroupViewSet(ReadOnlyModelViewSet):
    """
    Api endpoint for the Groups. Read only.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
