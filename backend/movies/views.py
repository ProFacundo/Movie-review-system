from rest_framework import generics, permissions
from .models import Movie, Review
from .serializers import MovieSerializer, ReviewSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.db.models import Avg
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.serializers import ModelSerializer
from datetime import datetime
from django.core.files.base import ContentFile
import os
import requests
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

# --- Movie Views ---

class MovieListCreateView(generics.ListCreateAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [permissions.AllowAny]  # Anyone can view movies

class MovieDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [permissions.AllowAny]  

# --- Review Views ---

class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        movie_id = self.request.query_params.get('movie_id')
        print("Filtering reviews for movie_id:", movie_id)
        if movie_id:
            return Review.objects.filter(movie_id=movie_id)
        return Review.objects.none()  # Or all() if you want fallback

    def perform_create(self, serializer):
        movie_id = self.request.data.get('movie')

        if movie_id is None:
            raise serializers.ValidationError({"movie": "Movie ID is required."})

        try:
            movie = Movie.objects.get(id=movie_id)
        except Movie.DoesNotExist:
            movie = Movie.objects.create(
                id=movie_id,
                title=f"Untitled Movie {movie_id}",
                description="Automatically created movie",
                release_date="2000-01-01",
                genre="Unknown",
            )

        serializer.save(user=self.request.user, movie=movie)

class ReviewDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Ensure that the user can only modify their own reviews
        return Review.objects.filter(user=self.request.user)  # Only allow users to edit/delete their own reviews



@api_view(['GET'])
def movie_average_rating(request, movie_id):
    avg_rating = Review.objects.filter(movie_id=movie_id).aggregate(Avg('rating'))['rating__avg']
    return Response({"movie_id": movie_id, "average_rating": avg_rating or 0})



class RegisterSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

# --- Movie Sync View (for TMDb) ---

@api_view(['POST'])
def sync_movie(request):
    data = request.data
    tmdb_id = data.get('tmdb_id')

    if not tmdb_id:
        return Response({'error': 'tmdb_id is required'}, status=400)

    movie, created = Movie.objects.get_or_create(
        tmdb_id=tmdb_id,
        defaults={
            'title': data.get('title', ''),
            'description': data.get('description', ''),
            'release_date': data.get('release_date', datetime.now().date()),
            'genre': data.get('genre', ''),
        }
    )

    if created and data.get("poster_path"):
        image_url = f"https://image.tmdb.org/t/p/w500{data['poster_path']}"
        try:
            img_response = requests.get(image_url)
            if img_response.status_code == 200:
                filename = os.path.basename(data['poster_path'])
                movie.poster.save(filename, ContentFile(img_response.content), save=True)
        except Exception as e:
            print("Image download failed:", e)

    serializer = MovieSerializer(movie)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    # Simply return the current user’s username (or any other fields you need)
    return Response({
        "username": request.user.username,
        "id": request.user.id,
        # you can add email, first_name, etc.
    })