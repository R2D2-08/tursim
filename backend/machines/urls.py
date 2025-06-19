from django.urls import path
from . import views

urlpatterns = [
    path('machines/', views.MachineListView.as_view(), name='machine-list'),
    path('machines/<int:pk>/', views.MachineDetailView.as_view(), name='machine-detail'),
] 