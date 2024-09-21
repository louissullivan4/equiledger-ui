import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SignupPage from './pages/SignupPage';
import CreateAccountPage from './pages/CreateAccountPage';
import HomePage from './pages/HomePage';
import { SignupProvider } from './context/SignupContext';

import './styles/styles.css';

const App = () => {
  return (
    <SignupProvider>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/createaccount" element={<CreateAccountPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
        </Route>
      </Routes>
    </SignupProvider>
  );
};

export default App;