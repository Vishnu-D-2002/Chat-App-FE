import React, { useState, useEffect } from "react";
import axios from "axios";
import { authInstance } from "../services/instance";
import "bootstrap/dist/css/bootstrap.min.css";
import Navlink from "./Navbar/Navbar";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const userId = JSON.parse(sessionStorage.getItem("User")).user._id;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authInstance.get(`/one-user/${userId}`);
        setUser(response.data.user);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name||user.name);
      formData.append("email", email||user.email);
      formData.append("image", file);

      const response = await authInstance.put(`/users/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(response.data.user);
      setEditMode(false);
      setName('');
      setEmail('');
      setFile(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  if (loading) {
    return (
        <div className="container fs-4 text-center mt-5 ">
          Loading...
        </div>
    );
  }

  if (error) {
    return <div className="container">Error: {error}</div>;
  }

  return (
    <>
      <Navlink />
      <div className="container d-flex justify-content-center align-items-center vh-100 bg-dark-subtle ">
        <div className="card w-75">
          <div className="card-body">
            {editMode ? (
              <div>
                <h2 className="card-title text-center">Update Profile</h2>
                <hr />
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="email"
                  className="form-control mb-3"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="file"
                  className="form-control-file mb-3 mt-2 mx-1"
                  onChange={handleFileChange}
                />
                <div className="d-flex m-3">
                  <button
                    className="btn btn-primary mr-2 mx-auto"
                    onClick={handleUpdate}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-secondary mx-auto"
                    onClick={toggleEditMode}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="d-flex flex-column text-center ">
                <h2 className="card-title">User Profile</h2>
                <hr />
                <p className="mt-4">
                  <strong>Name :</strong> {user.name}
                </p>
                <p>
                  <strong>Email :</strong> {user.email}
                </p>
                {user.image && (
                  <img
                    src={user.image}
                    alt="User Avatar"
                    className="img-fluid mb-3 mx-auto mt-3 rounded-4"
                    style={{ width: "150px" }}
                  />
                )}
                <div className="d-flex">
                  <button
                    className="btn btn-primary mx-auto m-3"
                    onClick={toggleEditMode}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
