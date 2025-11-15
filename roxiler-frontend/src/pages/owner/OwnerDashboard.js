import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function OwnerDashboard() {
  const { user } = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
    storeId: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/owner/stores/ratings",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStores(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load store data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const requestSort = (storeId, key) => {
    let direction = "asc";
    if (
      sortConfig.key === key &&
      sortConfig.direction === "asc" &&
      sortConfig.storeId === storeId
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction, storeId });
  };

  const getSortedRatings = (store) => {
    if (sortConfig.storeId !== store.storeId || !sortConfig.key)
      return store.ratings;
    return [...store.ratings].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const getSortArrow = (storeId, key) => {
    if (sortConfig.key === key && sortConfig.storeId === storeId) {
      return sortConfig.direction === "asc" ? " ↑" : " ↓";
    }
    return "";
  };

  return (
    <div className="owner-dashboard fadeIn">
      <div className="dashboard-container">
        <h2 className="dashboard-title text-center">Owner Dashboard</h2>
        <p className="welcome-text text-center">
          Welcome, <b>{user?.name}</b> 👋 (Owner)
        </p>

        {loading ? (
          <div className="loading-box">Loading your store ratings...</div>
        ) : error ? (
          <div className="error-box">{error}</div>
        ) : stores.length === 0 ? (
          <div className="empty-box">You haven’t added any stores yet.</div>
        ) : (
          <div className="store-grid">
            {stores.map((store) => (
              <div key={store.storeId} className="store-card">
                <div className="store-header">
                  <h3>{store.storeName}</h3>
                  <span className="rating-badge">
                    ⭐ {store.averageRating.toFixed(2)}
                  </span>
                </div>

                {store.ratings.length === 0 ? (
                  <p className="no-ratings">No ratings yet for this store.</p>
                ) : (
                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th
                            onClick={() =>
                              requestSort(store.storeId, "userName")
                            }
                          >
                            User Name {getSortArrow(store.storeId, "userName")}
                          </th>
                          <th
                            onClick={() =>
                              requestSort(store.storeId, "userEmail")
                            }
                          >
                            Email {getSortArrow(store.storeId, "userEmail")}
                          </th>
                          <th
                            onClick={() =>
                              requestSort(store.storeId, "rating")
                            }
                          >
                            Rating {getSortArrow(store.storeId, "rating")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {getSortedRatings(store).map((r, i) => (
                          <tr key={i}>
                            <td>{r.userName}</td>
                            <td>{r.userEmail}</td>
                            <td>{r.rating} ⭐</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
