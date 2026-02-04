import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const codespace = process.env.REACT_APP_CODESPACE_NAME;
    const apiUrl = codespace 
      ? `https://${codespace}-8000.app.github.dev/api/leaderboard/`
      : 'http://localhost:8000/api/leaderboard/';
    
    console.log('Leaderboard API URL:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Leaderboard data received:', data);
        // Handle both paginated (.results) and plain array responses
        const leaderboardData = data.results || data;
        console.log('Leaderboard array:', leaderboardData);
        setLeaderboard(leaderboardData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching leaderboard:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container mt-4"><p>Loading leaderboard...</p></div>;
  if (error) return <div className="container mt-4"><p className="text-danger">Error: {error}</p></div>;

  return (
    <div className="container mt-4">
      <h2>Leaderboard</h2>
      <p className="text-muted">Top performers across all teams</p>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Rank</th>
              <th>User ID</th>
              <th>Team ID</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry) => (
              <tr key={entry.id} className={entry.rank <= 3 ? 'table-warning' : ''}>
                <td>
                  {entry.rank === 1 && '🥇 '}
                  {entry.rank === 2 && '🥈 '}
                  {entry.rank === 3 && '🥉 '}
                  <strong>{entry.rank}</strong>
                </td>
                <td>{entry.user_id}</td>
                <td>{entry.team_id}</td>
                <td><span className="badge bg-primary">{entry.points}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3">Total Entries: <strong>{leaderboard.length}</strong></p>
    </div>
  );
}

export default Leaderboard;
