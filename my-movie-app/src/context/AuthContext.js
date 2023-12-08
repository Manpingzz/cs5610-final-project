// import React, { createContext, useState } from "react";

// export const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [auth, setAuth] = useState({ user: null, token: null });

//   return (
//     <AuthContext.Provider value={{ auth, setAuth }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, token: null });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const user = sessionStorage.getItem("user");
    console.log("Token from sessionStorage:", token);
    console.log("User from sessionStorage:", user);

    if (token && user) {
      setAuth({ token: token, user: JSON.parse(user) });
    }
    setIsInitialized(true);
  }, []);

  console.log("authContext", auth);
  return isInitialized ? (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  ) : (
    <div>Loading...</div>
  );
};
