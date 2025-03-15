// src/components/Login/Login.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

/**
 * Login component that allows users to enter their name and email.
 * On successful authentication, the user is redirected to the search page.
 */
const Login: React.FC = () => {
  // Local state to manage form inputs and error messages.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /**
   * Handles form submission by validating inputs and calling the login API.
   * If login is successful, navigates to the search page.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Basic validation: check if name and email are provided.
    if (!name.trim() || !email.trim()) {
      setError("Both name and email are required.");
      return;
    }

    try {
      // Attempt to log in using our API service function.
      await loginUser(name, email);
      // Redirect to the search page after successful login.
      navigate("/search");
    } catch (err) {
      // Handle errors by showing an error message to the user.
      setError("Login failed. Please try again.");
      console.error("Error during login:", err);
    }
  };

  return (
    <div className="container mt-5">
      {/* Center the form horizontally */}
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4">Welcome to Dog Shelter</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
