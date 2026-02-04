from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import User, Team, Activity, Leaderboard, Workout
from datetime import datetime


class TeamAPITestCase(APITestCase):
    """Test case for Team API endpoints"""
    
    def setUp(self):
        self.team1 = Team.objects.create(
            name='Test Team Marvel',
            description='Test Marvel team',
            members_count=5,
            total_points=1000
        )
        self.team2 = Team.objects.create(
            name='Test Team DC',
            description='Test DC team',
            members_count=5,
            total_points=900
        )
    
    def test_get_teams_list(self):
        url = reverse('team-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
    
    def test_get_team_detail(self):
        url = reverse('team-detail', args=[self.team1._id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Team Marvel')


class UserAPITestCase(APITestCase):
    """Test case for User API endpoints"""
    
    def setUp(self):
        self.team = Team.objects.create(
            name='Test Team',
            description='Test team',
            members_count=1,
            total_points=100
        )
        self.user = User.objects.create(
            name='Spider-Man',
            email='spiderman@test.com',
            team_id=str(self.team._id),
            total_points=100
        )
    
    def test_get_users_list(self):
        url = reverse('user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_get_user_detail(self):
        url = reverse('user-detail', args=[self.user._id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Spider-Man')
        self.assertEqual(response.data['email'], 'spiderman@test.com')


class ActivityAPITestCase(APITestCase):
    """Test case for Activity API endpoints"""
    
    def setUp(self):
        self.user = User.objects.create(
            name='Test User',
            email='testuser@test.com',
            total_points=100
        )
        self.activity = Activity.objects.create(
            user_id=str(self.user._id),
            activity_type='Running',
            duration=30,
            calories_burned=300,
            points_earned=30,
            date=datetime.now()
        )
    
    def test_get_activities_list(self):
        url = reverse('activity-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_get_activity_detail(self):
        url = reverse('activity-detail', args=[self.activity._id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['activity_type'], 'Running')


class LeaderboardAPITestCase(APITestCase):
    """Test case for Leaderboard API endpoints"""
    
    def setUp(self):
        self.user = User.objects.create(
            name='Test User',
            email='testuser@test.com',
            total_points=500
        )
        self.leaderboard_entry = Leaderboard.objects.create(
            user_id=str(self.user._id),
            team_id='test_team_id',
            rank=1,
            points=500
        )
    
    def test_get_leaderboard_list(self):
        url = reverse('leaderboard-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)


class WorkoutAPITestCase(APITestCase):
    """Test case for Workout API endpoints"""
    
    def setUp(self):
        self.workout = Workout.objects.create(
            name='Test Workout',
            description='A test workout',
            difficulty='Intermediate',
            duration=45,
            calories=400,
            category='Strength'
        )
    
    def test_get_workouts_list(self):
        url = reverse('workout-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_get_workout_detail(self):
        url = reverse('workout-detail', args=[self.workout._id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Workout')
        self.assertEqual(response.data['difficulty'], 'Intermediate')


class APIRootTestCase(APITestCase):
    """Test case for API root endpoint"""
    
    def test_api_root(self):
        url = reverse('api-root')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('users', response.data)
        self.assertIn('teams', response.data)
        self.assertIn('activities', response.data)
        self.assertIn('leaderboard', response.data)
        self.assertIn('workouts', response.data)
