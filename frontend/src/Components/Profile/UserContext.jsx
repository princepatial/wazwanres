import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(
    JSON.parse(sessionStorage.getItem('userDetails')) || null
  );

  useEffect(() => {
    if (userDetails) {
      sessionStorage.setItem('userDetails', JSON.stringify(userDetails));
    }
  }, [userDetails]);

  return (
    <UserContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
