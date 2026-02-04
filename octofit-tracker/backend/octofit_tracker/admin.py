from django.contrib import admin
from .models import User, Team, Activity, Leaderboard, Workout


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'team_id', 'total_points')
    search_fields = ('name', 'email')
    list_filter = ('team_id',)


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'members_count', 'total_points')
    search_fields = ('name',)


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'activity_type', 'duration', 'calories_burned', 'points_earned', 'date')
    list_filter = ('activity_type', 'date')
    search_fields = ('user_id',)


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ('rank', 'user_id', 'team_id', 'points')
    list_filter = ('team_id',)
    ordering = ('rank',)


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('name', 'difficulty', 'duration', 'calories', 'category')
    list_filter = ('difficulty', 'category')
    search_fields = ('name', 'description')
