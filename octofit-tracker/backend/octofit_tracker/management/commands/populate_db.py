from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        self.stdout.write('Deleting existing data...')
        
        # Delete existing data using Django ORM
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()
        
        self.stdout.write(self.style.SUCCESS('Existing data deleted successfully'))
        
        # Create Teams
        self.stdout.write('Creating teams...')
        team_marvel = Team.objects.create(
            name='Team Marvel',
            description='The mightiest heroes of the Marvel Universe',
            members_count=0,
            total_points=0
        )
        
        team_dc = Team.objects.create(
            name='Team DC',
            description='The legendary heroes of the DC Universe',
            members_count=0,
            total_points=0
        )
        
        self.stdout.write(self.style.SUCCESS('Teams created successfully'))
        
        # Create Users (Superheroes)
        self.stdout.write('Creating users...')
        
        marvel_heroes = [
            {'name': 'Spider-Man', 'email': 'spiderman@marvel.com'},
            {'name': 'Iron Man', 'email': 'ironman@marvel.com'},
            {'name': 'Captain America', 'email': 'captainamerica@marvel.com'},
            {'name': 'Thor', 'email': 'thor@marvel.com'},
            {'name': 'Black Widow', 'email': 'blackwidow@marvel.com'},
            {'name': 'Hulk', 'email': 'hulk@marvel.com'},
            {'name': 'Doctor Strange', 'email': 'doctorstrange@marvel.com'},
            {'name': 'Black Panther', 'email': 'blackpanther@marvel.com'},
        ]
        
        dc_heroes = [
            {'name': 'Superman', 'email': 'superman@dc.com'},
            {'name': 'Batman', 'email': 'batman@dc.com'},
            {'name': 'Wonder Woman', 'email': 'wonderwoman@dc.com'},
            {'name': 'The Flash', 'email': 'flash@dc.com'},
            {'name': 'Aquaman', 'email': 'aquaman@dc.com'},
            {'name': 'Green Lantern', 'email': 'greenlantern@dc.com'},
            {'name': 'Cyborg', 'email': 'cyborg@dc.com'},
            {'name': 'Shazam', 'email': 'shazam@dc.com'},
        ]
        
        marvel_users = []
        for hero in marvel_heroes:
            points = random.randint(100, 1000)
            user = User.objects.create(
                name=hero['name'],
                email=hero['email'],
                team_id=str(team_marvel._id),
                total_points=points
            )
            marvel_users.append(user)
        
        dc_users = []
        for hero in dc_heroes:
            points = random.randint(100, 1000)
            user = User.objects.create(
                name=hero['name'],
                email=hero['email'],
                team_id=str(team_dc._id),
                total_points=points
            )
            dc_users.append(user)
        
        all_users = marvel_users + dc_users
        
        # Update team member counts and total points
        team_marvel.members_count = len(marvel_users)
        team_marvel.total_points = sum(u.total_points for u in marvel_users)
        team_marvel.save()
        
        team_dc.members_count = len(dc_users)
        team_dc.total_points = sum(u.total_points for u in dc_users)
        team_dc.save()
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(all_users)} users'))
        
        # Create Activities
        self.stdout.write('Creating activities...')
        
        activity_types = ['Running', 'Swimming', 'Cycling', 'Weight Training', 'Yoga', 'Boxing', 'HIIT']
        activities = []
        
        for user in all_users:
            num_activities = random.randint(3, 8)
            for i in range(num_activities):
                activity_type = random.choice(activity_types)
                duration = random.randint(15, 120)
                calories = duration * random.randint(5, 10)
                points = calories // 10
                
                activity_date = datetime.now() - timedelta(days=random.randint(0, 30))
                
                activity = Activity.objects.create(
                    user_id=str(user._id),
                    activity_type=activity_type,
                    duration=duration,
                    calories_burned=calories,
                    points_earned=points,
                    date=activity_date
                )
                activities.append(activity)
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(activities)} activities'))
        
        # Create Leaderboard entries
        self.stdout.write('Creating leaderboard...')
        
        sorted_users = sorted(all_users, key=lambda u: u.total_points, reverse=True)
        
        for rank, user in enumerate(sorted_users, start=1):
            Leaderboard.objects.create(
                user_id=str(user._id),
                team_id=user.team_id,
                rank=rank,
                points=user.total_points
            )
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(sorted_users)} leaderboard entries'))
        
        # Create Workouts
        self.stdout.write('Creating workouts...')
        
        workouts_data = [
            {
                'name': 'Super Soldier Sprint',
                'description': 'High-intensity interval training inspired by Captain America',
                'difficulty': 'Advanced',
                'duration': 45,
                'calories': 500,
                'category': 'Cardio'
            },
            {
                'name': 'Web-Slinger Workout',
                'description': 'Full body workout focusing on agility and strength',
                'difficulty': 'Intermediate',
                'duration': 30,
                'calories': 350,
                'category': 'Strength'
            },
            {
                'name': 'Kryptonian Power Training',
                'description': 'Maximum strength training for ultimate power',
                'difficulty': 'Advanced',
                'duration': 60,
                'calories': 600,
                'category': 'Strength'
            },
            {
                'name': 'Speed Force Circuit',
                'description': 'Lightning-fast cardio workout',
                'difficulty': 'Advanced',
                'duration': 40,
                'calories': 550,
                'category': 'Cardio'
            },
            {
                'name': 'Warrior Princess Combat',
                'description': 'Combat-style workout inspired by Wonder Woman',
                'difficulty': 'Intermediate',
                'duration': 50,
                'calories': 450,
                'category': 'Combat'
            },
            {
                'name': 'Dark Knight Training',
                'description': 'Stealth and agility focused workout',
                'difficulty': 'Advanced',
                'duration': 55,
                'calories': 500,
                'category': 'Agility'
            },
            {
                'name': 'Asgardian Strength',
                'description': 'God-level strength training',
                'difficulty': 'Advanced',
                'duration': 60,
                'calories': 650,
                'category': 'Strength'
            },
            {
                'name': 'Atlantean Swimming',
                'description': 'Aquatic endurance training',
                'difficulty': 'Intermediate',
                'duration': 45,
                'calories': 400,
                'category': 'Cardio'
            },
            {
                'name': 'Mystic Arts Flexibility',
                'description': 'Yoga and flexibility training',
                'difficulty': 'Beginner',
                'duration': 30,
                'calories': 200,
                'category': 'Flexibility'
            },
            {
                'name': 'Gamma Rage HIIT',
                'description': 'High-intensity training for maximum power',
                'difficulty': 'Advanced',
                'duration': 35,
                'calories': 500,
                'category': 'HIIT'
            },
        ]
        
        for workout_data in workouts_data:
            Workout.objects.create(**workout_data)
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(workouts_data)} workouts'))
        
        self.stdout.write(self.style.SUCCESS('\n=== Database populated successfully! ==='))
        self.stdout.write(f'Teams: {Team.objects.count()}')
        self.stdout.write(f'Users: {User.objects.count()}')
        self.stdout.write(f'Activities: {Activity.objects.count()}')
        self.stdout.write(f'Leaderboard entries: {Leaderboard.objects.count()}')
        self.stdout.write(f'Workouts: {Workout.objects.count()}')
