import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const codespace = process.env.REACT_APP_CODESPACE_NAME;
    const apiUrl = codespace 
      ? `https://${codespace}-8000.app.github.dev/api/teams/`
      : 'http://localhost:8000/api/teams/';
    
    console.log('Teams API URL:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Teams data received:', data);
        // Handle both paginated (.results) and plain array responses
        const teamsData = data.results || data;
        console.log('Teams array:', teamsData);
        setTeams(teamsData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching teams:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

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
        <h2>👥 Teams</h2>
        <p className="text-muted">Superhero teams competing for fitness glory</p>
      </div>
      <div className="row">
        {teams.map((team) => (
          <div key={team.id} className="col-md-6 mb-4">
            <div className="card custom-card h-100">
              <div className="card-body">
                <h5 className="card-title">{team.name}</h5>
                <p className="card-text">{team.description}</p>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>Members:</strong> {team.members_count}
                  </li>
                  <li className="list-group-item">
                    <strong>Total Points:</strong> 
                    <span className="badge bg-success ms-2">{team.total_points}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3">Total Teams: <strong>{teams.length}</strong></p>
    </div>
  );
}

export default Teams;
