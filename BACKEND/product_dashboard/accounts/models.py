from django.contrib.auth.models import BaseUserManager, AbstractUser
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, full_name=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        
        if not full_name:
            raise ValueError("Full name is required")

        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, full_name=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('usertype', 'admin')

        return self.create_user(email, password, full_name, **extra_fields)


class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)

    USER_TYPE_CHOICES = (
        ('user', 'User'),
        ('admin', 'Admin'),
    )

    usertype = models.CharField(
        max_length=10,
        choices=USER_TYPE_CHOICES,
        default='user'
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']
    
    objects = CustomUserManager()