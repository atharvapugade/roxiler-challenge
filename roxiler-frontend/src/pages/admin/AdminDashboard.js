// src/pages/admin/AdminDashboard.js
import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSummary(res.data);
      } catch (err) {
        console.error("Error fetching summary:", err);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container fadeIn">
        <h2 className="dashboard-title">System Administrator Dashboard</h2>

        
        <div className="summary-cards">
          <div className="summary-card total-users">
            <h3>Total Users</h3>
            <p>{summary?.users?.total || 0}</p>
          </div>
          <div className="summary-card total-stores">
            <h3>Total Stores</h3>
            <p>{summary?.stores || 0}</p>
          </div>
          <div className="summary-card total-ratings">
            <h3>Total Ratings</h3>
            <p>{summary?.ratings?.total || 0}</p>
          </div>
        </div>

        
        <div className="admin-links">
          <Link to="/admin/users">
            <button className="btn-primary large">Manage Users</button>
          </Link>
          <Link to="/admin/stores">
            <button className="btn-secondary large">Manage Stores</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
