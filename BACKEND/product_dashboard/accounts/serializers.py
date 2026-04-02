from rest_framework import serializers
from .models import CustomUser
import re

class RegisterSerializer(serializers.ModelSerializer):
    model = CustomUser

    class Meta:
        model = CustomUser
        fields = ['full_name', 'email', 'password']

    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError("Password must be at least 6 characters")
        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError("Must contain uppercase letter")
        return value

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            full_name=validated_data['full_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user