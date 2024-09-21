import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useSignup } from '../../context/SignupContext';
import AuthService from '../../services/AuthService';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { setHasSignedUp } = useSignup();

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    return hasUpperCase && hasNumber && hasSpecialChar && isLongEnough;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters, include one uppercase letter, one number, and one special character.');
      return;
    }
    const signUpResp = await AuthService.signup(email, password);
    if (signUpResp.status_code === 201) {
      setHasSignedUp(true);

      console.log('Creating account for', email, password);
      navigate('/createaccount', { state: { email, password } });
    } else {
      setError(signUpResp.message);
    }
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="signup-main-page">
      <header>
        <h1>EquiLedger Dashboard</h1>
      </header>
      <main>
        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={error ? 'error' : ''}
            />
            <span
              onClick={togglePasswordVisibility}
              className="eye-icon"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>

          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              onClick={togglePasswordVisibility}
              className="eye-icon"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>

          {error && <p className="error-message">{error}</p>}
          <button type="submit">Sign Up</button>
        </form>
      </main>
    </section>
  );
};

export default Signup;
