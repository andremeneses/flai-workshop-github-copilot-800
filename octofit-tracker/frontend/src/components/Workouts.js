import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const codespace = process.env.REACT_APP_CODESPACE_NAME;
    const apiUrl = codespace 
      ? `https://${codespace}-8000.app.github.dev/api/workouts/`
      : 'http://localhost:8000/api/workouts/';
    
    console.log('Workouts API URL:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Workouts data received:', data);
        // Handle both paginated (.results) and plain array responses
        const workoutsData = data.results || data;
        console.log('Workouts array:', workoutsData);
        setWorkouts(workoutsData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching workouts:', error);
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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="container mt-4 fade-in">
      <div className="component-header">
        <h2>💪 Workouts</h2>
        <p className="text-muted">Superhero-themed fitness workouts</p>
      </div>
      <div className="row">
        {workouts.map((workout) => (
          <div key={workout.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card custom-card h-100">
              <div className="card-body">
                <h5 className="card-title">{workout.name}</h5>
                <p className="card-text">{workout.description}</p>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>Difficulty:</strong> 
                    <span className={`badge bg-${getDifficultyColor(workout.difficulty)} ms-2`}>
                      {workout.difficulty}
                    </span>
                  </li>
                  <li className="list-group-item">
                    <strong>Duration:</strong> {workout.duration} minutes
                  </li>
                  <li className="list-group-item">
                    <strong>Calories:</strong> {workout.calories} cal
                  </li>
                  <li className="list-group-item">
                    <strong>Category:</strong> {workout.category}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3">Total Workouts: <strong>{workouts.length}</strong></p>
    </div>
  );
}

export default Workouts;
