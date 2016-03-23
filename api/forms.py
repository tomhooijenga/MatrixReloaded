from django.contrib.auth import get_user_model
from django.contrib.auth.forms import PasswordResetForm as DjangoPasswordResetForm


class PasswordResetForm(DjangoPasswordResetForm):
    def get_users(self, email):
        """
        Include users with an unusable password
        """
        active_users = get_user_model()._default_manager.filter(email__iexact=email, is_active=True)
        return (u for u in active_users)
