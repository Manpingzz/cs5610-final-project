import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const withAuth = (WrappedComponent) => {
  return (props) => {
    // const { auth } = useContext(AuthContext);
    const { auth, isInitialized } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
      console.log("withAuth: 检查用户登录状态", auth);
      if (isInitialized && !auth.user) {
        console.log("withAuth: 用户未登录，重定向到登录页面");
        navigate("/login");
      }
    }, [auth, navigate, isInitialized]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
