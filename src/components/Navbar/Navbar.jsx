import React, { useState } from "react";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
function Navlink() {
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();

  const handleMenu = () => {
    setMenu((prevMenu) => !prevMenu);
  };
  const handlelogout = () => {
    sessionStorage.removeItem("User");
    navigate("/");
  };
  return (
    <div>
      {" "}
      <nav>
        <h2>CHAT APP</h2>
        <ul style={{ display: menu ? "block" : "none" }} onClick={handleMenu}>
          <li>
            <Link to="/">Login</Link>
          </li>
          <li>
            <Link to="/chat">Dashboard</Link>
          </li>
          <li>
            <Link to="/password-reset">Change password</Link>
          </li>
          <li>
            <button onClick={handlelogout}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                width="16"
                viewBox="0 0 512 512"
              >
                <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" />
              </svg>
            </button>
          </li>
        </ul>
        <input
          id="checkbox"
          type="checkbox"
          checked={menu}
          onChange={handleMenu}
        />
        <label className="toggle" htmlFor="checkbox">
          <div id="bar1" className="bars"></div>
          <div id="bar2" className="bars"></div>
          <div id="bar3" className="bars"></div>
        </label>
      </nav>
    </div>
  );
}

export default Navlink;
