import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleChangePassword = () => {
    navigate("/update-password");
    setShowDropdown(false);
  };

  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <h1>RateMyStore</h1>

      {user && (
        <div className="navbar-right">
          
          <div className="user-profile" ref={dropdownRef}>
            <span
              role="img"
              aria-label="profile"
              className="profile-emoji"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              👤
            </span>

            {showDropdown && (
              <div className="profile-dropdown">
                <div className="profile-header">
                  <p className="profile-name">
                    <b>{user.name}</b>
                  </p>
                  <p className="profile-role">Role: {user.role}</p>
                </div>
                <hr />
                <button
                  className="dropdown-btn"
                  onClick={handleChangePassword}
                >
                   Change Password
                </button>
                <button className="dropdown-btn logout" onClick={handleLogout}>
                   Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
