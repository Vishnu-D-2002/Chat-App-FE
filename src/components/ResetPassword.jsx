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
    <div>
      <h1>Enter the New Password to reset the old Password </h1>

      <form onSubmit={handleNewPassword}>
        <label>New Password : </label>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
}

export default ResetPassword;
