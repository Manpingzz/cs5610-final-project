import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
      // 检查用户是否登录
      if (!auth.user) {
        // 用户未登录，重定向到登录页面
        navigate("/login");
      }
    }, [auth, navigate]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
