import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";

export default function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading)
    return (
      <div className="user-details-page">
        <div className="loading-box">Fetching user details...</div>
      </div>
    );

  if (!user)
    return (
      <div className="user-details-page">
        <div className="error-box">Failed to load user details.</div>
      </div>
    );

  return (
    <div className="user-details-page fadeIn">
      <div className="user-details-card">
        <h2 className="user-details-title">👤 User Details</h2>

        <div className="user-info-grid">
          <div className="info-item">
            <span className="label">Name:</span>
            <span className="value">{user.name}</span>
          </div>
          <div className="info-item">
            <span className="label">Email:</span>
            <span className="value">{user.email}</span>
          </div>
          <div className="info-item">
            <span className="label">Address:</span>
            <span className="value">{user.address || "—"}</span>
          </div>
          <div className="info-item">
            <span className="label">Role:</span>
            <span
              className={`role-badge ${
                user.role === "ADMIN"
                  ? "admin"
                  : user.role === "OWNER"
                  ? "owner"
                  : "user"
              }`}
            >
              {user.role}
            </span>
          </div>

          {user.role === "OWNER" && (
            <div className="info-item">
              <span className="label">Average Rating:</span>
              <span className="value">⭐ {user.rating?.toFixed(2) || "—"}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
