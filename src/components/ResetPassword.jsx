import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { authInstance } from "../services/instance";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  const handleNewPassword = async (e) => {
    try {
      e.preventDefault();

      const randomString = window.location.pathname.slice(-7);

      console.log(randomString,newPassword);

      await authInstance.post("/new-password", { randomString, newPassword });

      console.log('Password changed successfull');

      setNewPassword("");
      navigate("/");
    } catch (error) {
      console.error("Error is Changing Password :", error);
    }
  };
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h1 className="text-center">
                Enter the New Password to reset your old Password
              </h1>
            </div>
            <div className="card-body">
              <form onSubmit={handleNewPassword}>
                <div className="form-group">
                  <label htmlFor="newPassword" className="m-2">
                    <strong>New Password:</strong>
                  </label>
                  <input
                    type="password"
                    className="form-control m-2 mb-3"
                    id="newPassword"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className=" d-flex flex-column">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block mx-auto "
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
