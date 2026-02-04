from django.db import models
from djongo import models as djongo_models


class User(djongo_models.Model):
    _id = djongo_models.ObjectIdField(primary_key=True)
    name = djongo_models.CharField(max_length=100)
    email = djongo_models.EmailField(unique=True)
    team_id = djongo_models.CharField(max_length=100, blank=True, null=True)
    total_points = djongo_models.IntegerField(default=0)
    
    class Meta:
        db_table = 'users'
    
    def __str__(self):
        return self.name


class Team(djongo_models.Model):
    _id = djongo_models.ObjectIdField(primary_key=True)
    name = djongo_models.CharField(max_length=100)
    description = djongo_models.TextField(blank=True)
    members_count = djongo_models.IntegerField(default=0)
    total_points = djongo_models.IntegerField(default=0)
    
    class Meta:
        db_table = 'teams'
    
    def __str__(self):
        return self.name


class Activity(djongo_models.Model):
    _id = djongo_models.ObjectIdField(primary_key=True)
    user_id = djongo_models.CharField(max_length=100)
    activity_type = djongo_models.CharField(max_length=50)
    duration = djongo_models.IntegerField()  # in minutes
    calories_burned = djongo_models.IntegerField()
    points_earned = djongo_models.IntegerField()
    date = djongo_models.DateTimeField()
    
    class Meta:
        db_table = 'activities'
    
    def __str__(self):
        return f"{self.activity_type} - {self.date}"


class Leaderboard(djongo_models.Model):
    _id = djongo_models.ObjectIdField(primary_key=True)
    user_id = djongo_models.CharField(max_length=100)
    team_id = djongo_models.CharField(max_length=100)
    rank = djongo_models.IntegerField()
    points = djongo_models.IntegerField()
    
    class Meta:
        db_table = 'leaderboard'
    
    def __str__(self):
        return f"Rank {self.rank} - {self.points} points"


class Workout(djongo_models.Model):
    _id = djongo_models.ObjectIdField(primary_key=True)
    name = djongo_models.CharField(max_length=100)
    description = djongo_models.TextField()
    difficulty = djongo_models.CharField(max_length=20)
    duration = djongo_models.IntegerField()  # in minutes
    calories = djongo_models.IntegerField()
    category = djongo_models.CharField(max_length=50)
    
    class Meta:
        db_table = 'workouts'
    
    def __str__(self):
        return self.name
