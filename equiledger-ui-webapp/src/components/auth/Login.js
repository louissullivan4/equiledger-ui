// src/components/Auth/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';

const Login = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage('Email and password are required');
      return;
    }

    const loginResp = await AuthService.login(email, password);
    if (loginResp.status_code === 200) {
      navigate('/home');
    } else {
      setErrorMessage(loginResp.message);
    }
  };

  return (
    <section className="login-main-page">
      <header>
        <h1>EquiLedger Dashboard</h1>
      </header>
      <main>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </main>
    </section>
  );
};

export default Login;
