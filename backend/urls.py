from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VacaViewSet, PrediccionCeloAPIView
from .views import CustomTokenObtainPairView
from .views import RegisterView, UserListView, UserDetailView
from .views import CurrentUserView

router = DefaultRouter()
router.register(r'vacas', VacaViewSet)

urlpatterns = [
   path('', include(router.urls)),
   path('predecir/', PrediccionCeloAPIView.as_view(), name='predecir-celo'),
   path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', RegisterView.as_view(), name='register'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('auth/user/', CurrentUserView.as_view(), name='current-user'),
]
