import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";
import "../../styles/main.css";
import { AuthContext } from "../../context/AuthContext";
import { signout } from "../client";

const Navbar = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  // const handleLogout = () => {
  //   setAuth({ user: null, token: null });
  //   // 这里可以添加逻辑来处理注销
  // };

  const handleLogout = async () => {
    try {
      await signout();
      setAuth({ user: null, token: null });
      sessionStorage.removeItem("token"); // 清除 sessionStorage 中的令牌
      sessionStorage.removeItem("user"); // 清除 sessionStorage 中的用户信息
      navigate("/login"); // 将用户重定向到登录页面
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <Link to="/" className="navbar-brand">
        My Movie
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div
        className="collapse navbar-collapse justify-content-end"
        id="navbarNavDropdown"
      >
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          {auth.user ? (
            <>
              <li className="nav-item">
                <span className="nav-link">Welcome, {auth.user.username}!</span>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-link">
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <button
                  onClick={handleLogout}
                  className="nav-link btn btn-link"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};
//           <li className="nav-item">
//             <Link to="/login" className="nav-link">
//               Login
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link to="/register" className="nav-link">
//               Register
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link to="/profile" className="nav-link">
//               Profile
//             </Link>

//             {auth.user ? (
//               <div>
//                 <span>Welcome, {auth.user.username}!</span>
//                 <button onClick={handleLogout}>Logout</button>
//               </div>
//             ) : (
//               <div>
//                 <a href="/login">Login</a>
//                 <a href="/register">Register</a>
//               </div>
//             )}
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// };

export default Navbar;
