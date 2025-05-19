from django.urls import path
from .views import MovieListCreateView, MovieDetailView, ReviewListCreateView, ReviewDetail, movie_average_rating, RegisterView
from . import views

urlpatterns = [
    path('movies/', MovieListCreateView.as_view(), name='movie-list'),
    path('movies/<int:pk>/', MovieDetailView.as_view(), name='movie-detail'),
    path('reviews/', ReviewListCreateView.as_view(), name='review-list'),
   
    path('reviews/<int:pk>/', ReviewDetail.as_view(), name='review-detail'),
    path('reviews/average/<str:movie_id>/', movie_average_rating, name='average-rating'),

    path('register/', RegisterView.as_view(), name='register'),
    path('sync-movie/', views.sync_movie),
    path('me/', views.me, name='me'),

]
