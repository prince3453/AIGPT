import React, { useState } from "react";
import "./Login.css";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin12345") {
      onLogin(username);
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="login-root">
      <div className="login-box">
        <div className="login-title">AI Chat Login</div>
        {error && <div className="login-error">{error}</div>}
        <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="login-group">
            <label className="login-label" htmlFor="username">Username</label>
            <input
              className="login-input"
              id="username"
              type="text"
              autoFocus
              autoComplete="username"
              placeholder="Enter username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="login-group">
            <label className="login-label" htmlFor="password">Password</label>
            <input
              className="login-input"
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button className="login-btn" type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
}