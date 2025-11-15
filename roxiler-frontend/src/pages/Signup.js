import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "USER",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await API.post("/auth/signup", form);
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-text">Join RateMyStore and start sharing your reviews</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={onSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            onChange={onChange}
            required
          />
          <input
            name="email"
            placeholder="Email"
            onChange={onChange}
            required
          />
          <input
            name="address"
            placeholder="Address"
            onChange={onChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={onChange}
            required
          />
          <select name="role" onChange={onChange} value={form.role}>
            <option value="USER">User</option>
            <option value="OWNER">Owner</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button type="submit" className="btn-primary">
            Sign Up
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account?</p>
          <Link to="/login">
            <button className="btn-secondary">Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
