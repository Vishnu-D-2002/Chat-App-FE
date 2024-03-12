import React, { useState } from "react";
import "../App.css";
import { authInstance } from "../services/instance";

function EmailSend() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleMailSend = async (e) => {
    try {
      e.preventDefault();

      const mail = await authInstance.post("/reset-password", { email });

      // console.log('Password Reset Mail send successfully', mail);
      setMessage("Password Reset Mail send successfully");
      setEmail("");
    } catch (error) {
      // console.error('Error in sending mail', error);
      setMessage("Error in sending mail");
    }
  };

  return (
    <div>
      <form onSubmit={handleMailSend}>
        <h2>
          Enter your Email Id for that Email id the Link to reset the Password
          will be Send
        </h2>
        <input
          type="email"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">SUBMIT</button>
        {message && <h2 id="activ-msg">{message}</h2>}
      </form>
    </div>
  );
}

export default EmailSend;
