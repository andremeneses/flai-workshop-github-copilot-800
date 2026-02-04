import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', team_id: '', total_points: 0 });
  const [saveError, setSaveError] = useState(null);
  const [saving, setSaving] = useState(false);

  const codespace = process.env.REACT_APP_CODESPACE_NAME;
  const baseUrl = codespace 
    ? `https://${codespace}-8000.app.github.dev/api`
    : 'http://localhost:8000/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    console.log('Users base URL:', baseUrl);

    Promise.all([
      fetch(`${baseUrl}/users/`).then(res => res.json()),
      fetch(`${baseUrl}/teams/`).then(res => res.json())
    ])
      .then(([usersData, teamsData]) => {
        const usersArray = usersData.results || usersData;
        const teamsArray = teamsData.results || teamsData;
        console.log('Users array:', usersArray);
        console.log('Teams array:', teamsArray);
        setUsers(usersArray);
        setTeams(teamsArray);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      team_id: user.team_id,
      total_points: user.total_points
    });
    setSaveError(null);
  };

  const handleClose = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', team_id: '', total_points: 0 });
    setSaveError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'total_points' ? parseInt(value) || 0 : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    try {
      const response = await fetch(`${baseUrl}/users/${editingUser.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.status}`);
      }

      const updatedUser = await response.json();
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      handleClose();
    } catch (error) {
      console.error('Error updating user:', error);
      setSaveError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : 'N/A';
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
        <h2>🦸 Users</h2>
        <p className="text-muted">All superheroes in the OctoFit Tracker</p>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Team</th>
              <th>Total Points</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td><strong>{user.name}</strong></td>
                <td>@{user.email?.split('@')[0]}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${getTeamName(user.team_id) === 'Team Marvel' ? 'bg-danger' : 'bg-primary'}`}>
                    {getTeamName(user.team_id)}
                  </span>
                </td>
                <td><span className="badge bg-info">{user.total_points}</span></td>
                <td>
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => handleEdit(user)}
                  >
                    ✏️ Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3">Total Users: <strong>{users.length}</strong></p>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User: {editingUser.name}</h5>
                <button type="button" className="btn-close" onClick={handleClose}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body">
                  {saveError && (
                    <div className="alert alert-danger" role="alert">
                      {saveError}
                    </div>
                  )}
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="team_id" className="form-label">Team</label>
                    <select
                      className="form-select"
                      id="team_id"
                      name="team_id"
                      value={formData.team_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a team</option>
                      {teams.map(team => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="total_points" className="form-label">Total Points</label>
                    <input
                      type="number"
                      className="form-control"
                      id="total_points"
                      name="total_points"
                      value={formData.total_points}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleClose}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
