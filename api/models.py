import datetime

from django.contrib.auth.models import (
    AbstractBaseUser, BaseUserManager, PermissionsMixin
)
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.db.models import Q
from django.utils.crypto import get_random_string


def upload_location(instance, filename):
    """
    Helper function to determine the location where the uploaded file should go.
    """
    # Grab the extension from the original file name
    extension = filename.split('.')[-1]
    # Generate a 20 char random string [a-z0-9]
    rand = get_random_string(20).lower()
    return "{0}/{1}.{2}".format(instance._meta.verbose_name, rand, extension)


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

    # The user's email address
    email = models.EmailField(unique=True)

    # Is this user enabled?
    is_active = models.BooleanField(default=True, db_index=True)

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


class Country(models.Model):
    # The ISO-3166-Alpha-2 country code
    code = models.CharField(max_length=2)

    # The name of the country
    name = models.CharField(max_length=100)

    # The engineers that are available in this country
    # engineers


class Language(models.Model):
    # The ISO-639-1 language code
    code = models.CharField(max_length=2)

    # The name of the language
    name = models.CharField(max_length=100)

    # The engineers that speak this language
    # engineers


class Engineer(models.Model):
    # The id in the external system
    employee_number = models.CharField(max_length=20)

    # The first name of the employee
    first_name = models.CharField(max_length=100)

    # The last name of the employee
    last_name = models.CharField(max_length=100)

    # The location code where supplies should be dropped
    droppoint = models.CharField(max_length=255)

    # Employee's phone number
    phone = models.CharField(max_length=31)

    # Employee's email
    email = models.EmailField()

    # VCA number. Empty if employee doesn't have a VCA
    vca_number = models.CharField(max_length=20, null=True)

    # VCA expiry date. Empty if employee doesn't have a VCA
    vca_date = models.DateField(null=True)

    # Employee's car brand and model. Example: Audi A5
    car_type = models.CharField(max_length=100)

    # Color of the employees car
    car_color = models.CharField(max_length=100)

    # License plate of the employee's car
    license_plate = models.CharField(max_length=10)

    # Address, street with number
    street = models.CharField(max_length=100)

    # Address, zip code part
    zip_code = models.CharField(max_length=10)

    # Address, City part
    city = models.CharField(max_length=100)

    # Address, Country part
    # Because an engineer has 2 relations with Country, the address country does
    # not have a reverse relationship
    country = models.ForeignKey(Country, related_name='+')

    # Countries that a the employee is available in
    countries = models.ManyToManyField(Country, related_name='engineers')

    # Languages that the employee speaks
    languages = models.ManyToManyField(Language, related_name='engineers')

    # Whether this employee is still active or not
    is_active = models.BooleanField(default=True, db_index=True)

    # A picture of the engineer
    image = models.ImageField(upload_to=upload_location, blank=True)

    # The skills of this employee. Defined in the Skill model
    # skills

    # The note of this employee. Defined in the Note model
    # note

    # The type of engineer.
    type = models.SmallIntegerField(choices=(
        (0, 'FSE'),
        (1, 'ASP')
    ))


class Note(models.Model):
    """
    This class represents a single comment on an engineer
    """

    # The actual message of the comment
    content = models.CharField(max_length=255)

    # The comment is visible from this date. Defaults to today
    visible_from = models.DateField(default=datetime.date.today)

    # The comment is visible until this date
    visible_until = models.DateField(default=None, null=True)

    # The engineer that this note belongs to
    engineer = models.OneToOneField(Engineer, related_name='note')


class Category(models.Model):
    # The abbreviation of the Category. Example: AA for Atomic Absorption
    short_name = models.CharField(max_length=5)

    # The full name of the Category
    name = models.CharField(max_length=100)

    # The parent category of this category
    parent = models.ForeignKey('self', null=True, related_name='children', limit_choices_to=Q(parent__isnull=True))

    # The child categories of this category. Defined in the 'parent' property
    # children

    # The products that belong to this category. Defined in the Product model
    # products

    class Meta:
        verbose_name_plural = 'categories'


class Product(models.Model):
    # The name of the product
    name = models.CharField(max_length=100)

    # Whether this product is still in use
    is_active = models.BooleanField(default=True, db_index=True)

    # Whether this product is CrossLab or not
    is_crosslab = models.BooleanField(default=False)

    # The category that this product belongs to
    category = models.ForeignKey(Category, related_name='products')

    # An image of the product
    image = models.ImageField(upload_to=upload_location, blank=True)

    # The engineers that can work with this product. Defined in the Skill model
    # engineers


class Skill(models.Model):
    # The engineer that has this skill
    engineer = models.ForeignKey(Engineer, related_name='skills')

    # The product that this skill belongs to
    product = models.ForeignKey(Product, related_name='skills')

    # The level of the skill. Min = 1, Max = 4
    level = models.SmallIntegerField(validators=[
        MinValueValidator(1),
        MaxValueValidator(4)
    ])

    # Is the engineer a specialist in this skill?
    is_fss = models.BooleanField(default=False)

    class Meta:
        # Ensure there's always only one combination of engineer and product
        unique_together = ('engineer', 'product')
