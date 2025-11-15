import React, { useEffect, useState, useCallback } from "react";
import API from "../../api/axios";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "", role: "" });
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "USER",
  });
  const [errors, setErrors] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const fetchUsers = useCallback(async (appliedFilters = {}) => {
    try {
      const token = localStorage.getItem("token");
      const params = { ...appliedFilters };
      if (params.role) params.role = params.role.toUpperCase();

      const res = await API.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      if (res.data?.data) setUsers(res.data.data);
      else setUsers([]);
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("Failed to fetch users");
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleChange = (e) =>
    setUserForm({ ...userForm, [e.target.name]: e.target.value });

  const validateForm = () => {
    const errs = {};
    const name = (userForm.name || "").trim();
    if (!name) errs.name = "Name is required.";
    else if (name.length < 3 || name.length > 60)
      errs.name = "Name must be between 3 and 60 characters.";

    if (!userForm.email) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email))
      errs.email = "Enter a valid email address.";

    if (!userForm.address) errs.address = "Address is required.";
    else if (userForm.address.length > 400)
      errs.address = "Address cannot exceed 400 characters.";

    const pwd = userForm.password || "";
    if (!pwd) errs.password = "Password is required.";
    else if (pwd.length < 8 || pwd.length > 16)
      errs.password = "Password must be 8–16 characters.";
    else if (!/[A-Z]/.test(pwd))
      errs.password = "Password must contain at least one uppercase letter.";
    else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(pwd))
      errs.password = "Password must contain at least one special character.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const addUser = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("token");
      await API.post("/admin/users", userForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("User added successfully!");
      setUserForm({ name: "", email: "", address: "", password: "", role: "USER" });
      fetchUsers();
    } catch (err) {
      console.error("Error adding user:", err);
      alert(err.response?.data?.message || "Failed to add user");
    }
  };

  const applyFilters = () => {
    const applied = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key].trim() !== "") applied[key] = filters[key];
    });
    fetchUsers(applied);
  };

  const clearFilters = () => {
    const empty = { name: "", email: "", address: "", role: "" };
    setFilters(empty);
    fetchUsers();
  };

  const sortedUsers = React.useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig.key !== null) {
      sortableUsers.sort((a, b) => {
        const aVal = a[sortConfig.key]?.toString().toLowerCase() || "";
        const bVal = b[sortConfig.key]?.toString().toLowerCase() || "";
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  return (
    <div className="manage-users-page fadeIn">
      <div className="dashboard-container">
        <h2 className="dashboard-title text-center"> Manage Users</h2>

        
        <div className="form-section">
          <h3>Add New User</h3>
          <form onSubmit={addUser} className="user-form">
            <input name="name" placeholder="Full Name" value={userForm.name} onChange={handleChange} />
            {errors.name && <p className="error">{errors.name}</p>}

            <input name="email" placeholder="Email" value={userForm.email} onChange={handleChange} />
            {errors.email && <p className="error">{errors.email}</p>}

            <input name="address" placeholder="Address" value={userForm.address} onChange={handleChange} />
            {errors.address && <p className="error">{errors.address}</p>}

            <input type="password" name="password" placeholder="Password" value={userForm.password} onChange={handleChange} />
            {errors.password && <p className="error">{errors.password}</p>}

            <select name="role" value={userForm.role} onChange={handleChange}>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="OWNER">Owner</option>
            </select>

            <button type="submit" className="btn-primary">Add User</button>
          </form>
        </div>

        
        <div className="filter-box">
          <h4> Search & Filters</h4>
          <div className="filter-grid">
            <input placeholder="Filter by Name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
            <input placeholder="Filter by Email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
            <input placeholder="Filter by Address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
            <select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
              <option value="">All Roles</option>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="OWNER">Owner</option>
            </select>
          </div>
          <div className="filter-actions">
            <button onClick={applyFilters} className="btn-primary small">Apply</button>
            <button onClick={clearFilters} className="btn-secondary small">Clear</button>
          </div>
        </div>

        
        <div className="table-wrapper mt-6">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th onClick={() => requestSort("name")}>Name</th>
                <th onClick={() => requestSort("email")}>Email</th>
                <th onClick={() => requestSort("address")}>Address</th>
                <th onClick={() => requestSort("role")}>Role</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.length ? (
                sortedUsers.map((u, i) => (
                  <tr key={u._id || u.id || i}>
                    <td>{i + 1}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.address}</td>
                    <td>{u.role}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
