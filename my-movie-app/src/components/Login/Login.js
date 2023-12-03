import React, { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./index.css";
import * as client from "../client.js";
import { AuthContext } from "../../context/AuthContext.js";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  // 检查会话存储中是否存在令牌
  // useEffect(() => {
  //   const storedToken = sessionStorage.getItem("token");
  //   console.log("Stored token:", storedToken); // 查看存储的令牌
  //   if (storedToken) {
  //     // 在这里可以添加发送令牌到后端验证的逻辑
  //     // 例如，发送一个请求到后端验证令牌是否有效
  //     // 如果验证成功，则进行自动登录
  //     // 如果验证失败，则不执行自动登录，甚至可以清除 sessionStorage 中的令牌
  //     client.verifyToken(storedToken).then((isValid) => {
  //       if (isValid) {
  //         setAuth({ token: storedToken });
  //         navigate("/");
  //       } else {
  //         sessionStorage.removeItem("token");
  //       }
  //     });
  //   }
  // }, [setAuth, navigate]);
  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    console.log("Checking stored token in sessionStorage:", storedToken);

    if (storedToken) {
      console.log("Verifying token...");

      client
        .verifyToken(storedToken)
        .then((isValid) => {
          console.log("Token verification result:", isValid);

          if (isValid) {
            setAuth({ token: storedToken });
            navigate("/");
          } else {
            console.log(
              "Token is invalid. Removing token and redirecting to login."
            );
            sessionStorage.removeItem("token");
            // 重定向到登录页面或处理登出逻辑
          }
        })
        .catch((error) => {
          console.error("Error during token verification:", error);
          // 处理错误情况
        });
    }
  }, [setAuth, navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const credentials = { username, password };
      const response = await client.signin(credentials);
      console.log("user666:", response);
      if (response && response.token) {
        const { user, token } = response;
        setAuth({ user, token });
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));
        navigate("/");
      } else {
        setError("Invalid login credentials.");
      }
    } catch (error) {
      console.log("Login Error:", error);
      setError(error.message || "An error occurred while logging in.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Login to your account</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-field">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
        <p className="signup-text">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
