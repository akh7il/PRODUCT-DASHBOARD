from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from accounts.views import RegisterView, CustomTokenView, GoogleLoginView
from rest_framework.routers import DefaultRouter
from products.views import ProductViewSet, CartViewSet, CartItemViewSet
from products.views import OrderViewSet

router = DefaultRouter()
router.register('products', ProductViewSet)
router.register('cart', CartViewSet, basename='cart')
router.register('cart-items', CartItemViewSet, basename='cart-items')
router.register('orders', OrderViewSet, basename='orders')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', RegisterView.as_view()),
    path('api/login/', CustomTokenView.as_view()),
    path('api/', include(router.urls)),
    path('api/google-login/', GoogleLoginView.as_view()),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)