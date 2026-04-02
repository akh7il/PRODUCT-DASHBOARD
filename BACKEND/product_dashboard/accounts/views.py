from django.shortcuts import render
from rest_framework import generics
from .serializers import RegisterSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from django.contrib.auth import get_user_model
User = get_user_model()

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

class CustomTokenSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        data = super().validate(attrs)
        data["usertype"] = self.user.usertype
        data["full_name"] = self.user.full_name
        return data

class CustomTokenView(TokenObtainPairView):
    serializer_class = CustomTokenSerializer

class GoogleLoginView(APIView):
    def post(self, request):
        token = request.data.get('token')

        try:
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                "542660838713-algi2r3c18g3koisqe34291m5vrs4utj.apps.googleusercontent.com"
            )

            email = idinfo['email']
            name = idinfo.get('name', '')

            user, created = CustomUser.objects.get_or_create(
                email=email,
                defaults={"full_name": name}
            )

            refresh = RefreshToken.for_user(user)

            return Response({
                "access": str(refresh.access_token),
                "usertype": user.usertype,
                "full_name": user.full_name,
                "email": user.email
            })

        except Exception:
            return Response({"error": "Invalid Google token"}, status=400)