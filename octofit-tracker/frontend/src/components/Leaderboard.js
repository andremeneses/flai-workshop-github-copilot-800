import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [users, setUsers] = useState({});
  const [teams, setTeams] = useState({});
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const codespace = process.env.REACT_APP_CODESPACE_NAME;
    const baseUrl = codespace 
      ? `https://${codespace}-8000.app.github.dev/api`
      : 'http://localhost:8000/api';
    
    console.log('Leaderboard base URL:', baseUrl);

    // Fetch all required data
    Promise.all([
      fetch(`${baseUrl}/leaderboard/`).then(res => res.json()),
      fetch(`${baseUrl}/users/`).then(res => res.json()),
      fetch(`${baseUrl}/teams/`).then(res => res.json()),
      fetch(`${baseUrl}/activities/`).then(res => res.json())
    ])
      .then(([leaderboardData, usersData, teamsData, activitiesData]) => {
        console.log('All data received');
        
        // Handle paginated responses
        const leaderboardArray = leaderboardData.results || leaderboardData;
        const usersArray = usersData.results || usersData;
        const teamsArray = teamsData.results || teamsData;
        const activitiesArray = activitiesData.results || activitiesData;
        
        // Create lookup maps
        const usersMap = {};
        usersArray.forEach(user => {
          usersMap[user.id] = user;
        });
        
        const teamsMap = {};
        teamsArray.forEach(team => {
          teamsMap[team.id] = team;
        });
        
        setLeaderboard(leaderboardArray);
        setUsers(usersMap);
        setTeams(teamsMap);
        setActivities(activitiesArray);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const calculateTotalCalories = (userId) => {
    return activities
      .filter(activity => activity.user_id === userId)
      .reduce((total, activity) => total + (activity.calories_burned || 0), 0);
  };

  if (loading) return (
    <div className="container mt-4 loading-spinner">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mt-4 error-message">
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error!</h4>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="container mt-4 fade-in">
      <div className="component-header">
        <h2>🏆 Leaderboard</h2>
        <p className="text-muted">Top performers across all teams</p>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Team</th>
              <th>Points</th>
              <th>Total Calories</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry) => {
              const user = users[entry.user_id];
              const team = teams[entry.team_id];
              const totalCalories = calculateTotalCalories(entry.user_id);
              
              return (
                <tr key={entry.id} className={entry.rank <= 3 ? 'table-warning' : ''}>
                  <td>
                    {entry.rank === 1 && '🥇 '}
                    {entry.rank === 2 && '🥈 '}
                    {entry.rank === 3 && '🥉 '}
                    <strong>{entry.rank}</strong>
                  </td>
                  <td><strong>{user?.name || 'N/A'}</strong></td>
                  <td>
                    <span className={`badge ${team?.name === 'Team Marvel' ? 'bg-danger' : 'bg-primary'}`}>
                      {team?.name || 'N/A'}
                    </span>
                  </td>
                  <td><span className="badge bg-success">{entry.points}</span></td>
                  <td>{totalCalories.toLocaleString()} cal</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3">Total Entries: <strong>{leaderboard.length}</strong></p>
    </div>
  );
}

export default Leaderboard;
