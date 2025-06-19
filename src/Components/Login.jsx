import React, { useState } from "react";
import "./Login.css";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
  e.preventDefault();
  // Only allow admin/admin12345
  if (username === "admin" && password === "admin12345") {
    onLogin(username);
  } else {
    alert("Invalid username or password. Please try again.");
  }
};

  return (
    <div className="login-root">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>AI Chat Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          autoFocus
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;