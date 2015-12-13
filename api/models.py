from django.contrib.auth.models import (
    AbstractBaseUser, BaseUserManager, PermissionsMixin
)
from django.db import models


class UserManager(BaseUserManager):
    """
    Override the UserManager to enable commandline creation
    """

    def create_user(self, email, password):
        user = self.model(email=email)
        user.set_password(raw_password=password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        user = self.model(email=email, is_superuser=True)
        user.set_password(raw_password=password)
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    """
    Override the default User model from django.contrib.auth to trim of all unused database columns
    - id
    - email
    - password
    - is_active
    - is_superuser
    - last_login
    - groups
    - user_permissions
    """

    # Fields
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)

    # Name of the field that uniquely identifies a User
    USERNAME_FIELD = 'email'

    # User manager
    objects = UserManager()

    def get_short_name(self):
        """
        Get the short string representation of a user
        """
        return getattr(self, self.USERNAME_FIELD)

    def get_full_name(self):
        """
        Get the long string representation of a user
        """
        return getattr(self, self.USERNAME_FIELD)
