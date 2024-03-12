import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./components/Chat";
import Login from "./components/login";

const App = () => {
  

  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/chat"
            element={<Chat/>}
          />
          <Route
            path="/"
            element={ <Login />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
