import random
from datetime import date
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from movies.models import Movie, Review  # Adjust 'movies' to your app name

class Command(BaseCommand):
    help = 'Populate the database with sample movies and reviews'

    def handle(self, *args, **kwargs):
        sample_movies = [
            {
                "title": "The Matrix",
                "description": "A hacker discovers the shocking truth about reality.",
                "release_date": date(1999, 3, 31),
                "genre": "Sci-Fi"
            },
            {
                "title": "Inception",
                "description": "A skilled thief invades dreams to steal secrets.",
                "release_date": date(2010, 7, 16),
                "genre": "Action"
            },
            {
                "title": "Interstellar",
                "description": "A team travels through a wormhole in search of a new home for humanity.",
                "release_date": date(2014, 11, 7),
                "genre": "Adventure"
            },
            {
                "title": "Parasite",
                "description": "A poor family schemes to infiltrate a wealthy household.",
                "release_date": date(2019, 5, 30),
                "genre": "Drama"
            }
        ]

        sample_comments = [
            "Amazing movie!",
            "Really makes you think.",
            "Cinematography was top notch.",
            "Not my type, but well-made.",
            "I’d definitely watch again."
        ]

        users = User.objects.all()
        if not users.exists():
            self.stdout.write(self.style.ERROR("⚠️ No users found. Please create test users first."))
            return

        for movie_data in sample_movies:
            movie, created = Movie.objects.get_or_create(
                title=movie_data["title"],
                defaults={
                    "description": movie_data["description"],
                    "release_date": movie_data["release_date"],
                    "genre": movie_data["genre"]
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"✅ Created movie: {movie.title}"))
            else:
                self.stdout.write(self.style.WARNING(f"ℹ️ Movie already exists: {movie.title}"))

            for _ in range(3):
                user = random.choice(users)
                rating = random.randint(1, 5)
                comment = random.choice(sample_comments)

                Review.objects.create(
                    user=user,
                    movie=movie,
                    rating=rating,
                    comment=comment
                )
            self.stdout.write(f"📝 Added reviews for: {movie.title}")
