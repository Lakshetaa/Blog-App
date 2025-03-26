import React, { useContext, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import "./Login.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState("");
  const { setUserInfo } = useContext(UserContext);

  async function login(ev) {
    ev.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      
      if (response.ok) {
        setUserInfo({ username });
        setRedirect(true);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError("An error occurred during login");
    }
  }

  if (redirect) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="login-container">
      <form className="login" onSubmit={login}>
        <h1>Login</h1>
        {error && <div className="error">{error}</div>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <button type="submit">Login</button>
        <div className="register-link">
          New user?<Link to="/register">Register here</Link>
        </div>
      </form>
    </div>
  );
}