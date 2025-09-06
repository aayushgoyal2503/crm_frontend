// src/App.jsx
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

// IMPORTANT: Replace with your deployed backend URL
const API_URL = 'http://localhost:5000'; 

function App() {
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', source: '', description: '' });

  const fetchLeads = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/leads`);
      setLeads(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
    const interval = setInterval(fetchLeads, 5000); // Poll for updates every 5 seconds
    return () => clearInterval(interval);
  }, [fetchLeads]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/leads`, form);
      setForm({ name: '', email: '', source: '', description: '' }); // Clear form
      fetchLeads(); // Immediately fetch after submission
    } catch (error) {
      console.error("Error creating lead:", error);
      alert("Failed to create lead. Check console for details.");
    }
  };

  const getTagClass = (assignedTo) => {
    if (assignedTo === "Senior Sales") return 'tag senior';
    if (assignedTo === "Junior Sales") return 'tag junior';
    if (assignedTo === "Nurture Later") return 'tag nurture';
    return '';
  }

  return (
    <div className="container">
      <h1>Mini CRM - Lead Management</h1>
      <form onSubmit={handleSubmit}>
        <h2>Add New Lead</h2>
        <input name="name" value={form.name} onChange={handleInputChange} placeholder="Name" required />
        <input name="email" type="email" value={form.email} onChange={handleInputChange} placeholder="Email" required />
        <input name="source" value={form.source} onChange={handleInputChange} placeholder="Lead Source (e.g., Website, Referral)" />
        <textarea name="description" value={form.description} onChange={handleInputChange} placeholder="Lead Description" required />
        <button type="submit">Add Lead</button>
      </form>

      <h2>Current Leads</h2>
      <table className="leads-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Score</th>
            <th>Assigned To</th>
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => (
            <tr key={lead.id}>
              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.score ?? '...'}</td>
              <td>
                {lead.assignedTo ? (
                  <span className={getTagClass(lead.assignedTo)}>{lead.assignedTo}</span>
                ) : (
                  'Assigning...'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;