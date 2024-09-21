import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const SignupContext = createContext();

export const SignupProvider = ({ children }) => {
  const [hasSignedUp, setHasSignedUp] = useState(false);

  return (
    <SignupContext.Provider value={{ hasSignedUp, setHasSignedUp }}>
      {children}
    </SignupContext.Provider>
  );
};

SignupProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useSignup = () => {
  return useContext(SignupContext);
};