import React, { useState } from "react";
import Dashboard from "./Components/Dashboard";
import Login from "./Components/Login";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => setUser(null);

  return (
    <div className="App">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={setUser} />
      )}
    </div>
  );
}

export default App;