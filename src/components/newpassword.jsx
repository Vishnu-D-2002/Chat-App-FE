import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { protecdInstance } from "../services/instance";

function NewPassword() {
  const [password, setpassword] = useState("");
  const navigate = useNavigate();
  const [show, setShow] = useState("");
  const changeNewPassword = async (e) => {
    e.preventDefault();
    const currentURL = window.location.href;
    const match = currentURL.match(/\/reset-password\/new-password\/(\w{6})/);

    if (match) {
      const OTP = match[1];
      //  console.log(OTP)
      const res = await protecdInstance.post(`/reset-password/${OTP}`, {
        password,
      });
      //  console.log(res.data);
      setShow(res.data.meaasge);
      navigate("/");
    } else {
      console.error("URL format doesn't match expected pattern");
    }
  };
  return (
    <div className="signup">
      <div className="outside">
        <form onSubmit={changeNewPassword}>
          <label>New Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setpassword(e.target.value);
            }}
            required
          />{" "}
          <br />
          <br />
          <button className="submit" type="submit">
            submit
          </button>
          <div>
            <p>{show}</p>
          </div>
        </form>
        <Link className="link" to="/">
          Singin
        </Link>
      </div>
    </div>
  );
}

export default NewPassword;
