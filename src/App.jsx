import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./components/Chat";
import Login from "./components/login";
import Active from "./components/active";
import ResetPassword from "./components/ResetPassword";
import EmailSend from "./components/EmailSend";
import PasswordReset from "./components/passwordreset";
import Profile from "./components/Profile";

const App = () => {
  

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Login />} />
          <Route path="/emailSend" element={<EmailSend />} />
          <Route
            path="/resetPassword/:randomString"
            element={<ResetPassword />}
          />
          <Route
            path="/activate/:activationToken"
            element={<Active />}
          />
          <Route path="/password-reset" element={<PasswordReset />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
