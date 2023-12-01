import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import * as client from "../client";
import "./index.css";

function Profile() {
  const { auth } = useContext(AuthContext);
  console.log("AuthContext:", auth);

  const [userData, setUserData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  useEffect(() => {
    console.log("auth.user:", auth.user);

    const fetchUserData = async () => {
      if (auth.user && auth.user.username) {
        try {
          const data = await client.getUserData(auth.user.username);
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [auth.user]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    const userId = auth.user._id;
    console.log("Updating user with ID:", userId); // 确保 ID 是正确的
    console.log("Updated user data:", userData); // 查看更新的数据

    try {
      // 发送更新请求到后端
      await client.updateUser(userId, userData);
      alert("Profile updated successfully.");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  if (!auth.user) {
    return <div>Please login to view this page.</div>;
  }

  return (
    //     <div className="profile-container">
    //       <h1>User Profile</h1>
    //       <div className="profile-details">
    //         <div className="profile-section">
    //           <h2>Personal Information</h2>
    //           {editMode ? (
    //             <form onSubmit={handleUpdate}>
    //               <div className="form-group mt-3 mb-3">
    //                 Username:
    //                 <input
    //                   type="text"
    //                   value={userData.username}
    //                   onChange={(e) =>
    //                     setUserData({ ...userData, username: e.target.value })
    //                   }
    //                 />
    //               </div>
    //               <div className="form-group mt-3 mb-3">
    //                 Email:
    //                 <input
    //                   type="email"
    //                   value={userData.email}
    //                   onChange={(e) =>
    //                     setUserData({ ...userData, email: e.target.value })
    //                   }
    //                 />
    //               </div>
    //               <div className="form-group mt-3 mb-3">
    //                 Password:
    //                 <input
    //                   type="password"
    //                   onChange={(e) =>
    //                     setUserData({ ...userData, password: e.target.value })
    //                   }
    //                 />
    //               </div>
    //               <div className="form-group mt-3 mb-3">
    //                 FirstName:
    //                 <input
    //                   type="text"
    //                   value={userData.firstName}
    //                   onChange={(e) =>
    //                     setUserData({ ...userData, firstName: e.target.value })
    //                   }
    //                 />
    //               </div>
    //               <div className="form-group mt-3 mb-3">
    //                 LastName:
    //                 <input
    //                   type="text"
    //                   value={userData.lastName}
    //                   onChange={(e) =>
    //                     setUserData({ ...userData, lastName: e.target.value })
    //                   }
    //                 />
    //               </div>
    //               <button type="submit">Save Changes</button>
    //               <button type="button" onClick={() => setEditMode(false)}>
    //                 Cancel
    //               </button>
    //             </form>
    //           ) : (
    //             <>
    //               <p>
    //                 <strong>Username:</strong> {userData.username}
    //               </p>
    //               <p>
    //                 <strong>Password:</strong> {userData.password}
    //               </p>
    //               <p>
    //                 <strong>Email:</strong> {userData.email}
    //               </p>
    //               <p>
    //                 <strong>FirstName:</strong> {userData.firstName}
    //               </p>
    //               <p>
    //                 <strong>LastName:</strong> {userData.lastName}
    //               </p>
    //               <button onClick={() => setEditMode(true)}>Edit Profile</button>
    //             </>
    //           )}
    //         </div>
    //       </div>
    //     </div>
    //   );
    // }
    <div className="profile-container">
      <h1>User Profile</h1>
      <div className="profile-tabs">
        <button
          className={activeTab === "personal" ? "active" : ""}
          onClick={() => setActiveTab("personal")}
        >
          Personal Information
        </button>
        <button
          className={activeTab === "security" ? "active" : ""}
          onClick={() => setActiveTab("security")}
        >
          Security
        </button>
      </div>
      <div className="profile-details">
        {activeTab === "personal" ? (
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <p>
                <strong>Username:</strong> {userData.username}
              </p>
              {/* <input
                type="text"
                value={userData.username}
                onChange={(e) =>
                  setUserData({ ...userData, username: e.target.value })
                }
              /> */}
            </div>
            <div className="form-group mt-3 mb-3">
              <label>Email:</label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
              />
            </div>
            <div className="form-group mt-3 mb-3">
              <label>First Name:</label>
              <input
                type="text"
                value={userData.firstName}
                onChange={(e) =>
                  setUserData({ ...userData, firstName: e.target.value })
                }
              />
            </div>
            <div className="form-group mt-3 mb-3">
              <label>Last Name:</label>
              <input
                type="text"
                value={userData.lastName}
                onChange={(e) =>
                  setUserData({ ...userData, lastName: e.target.value })
                }
              />
            </div>
            <button className="btn" type="submit">
              Save Changes
            </button>
          </form>
        ) : (
          <div className="security-section">
            <h2>Security</h2>
            <p>
              <strong>Username:</strong> {userData.username}
            </p>
            <p>
              <strong>Password:</strong> ********
            </p>
            <button className="btn" onClick={() => alert("Change Password")}>
              Change Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
