import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authInstance } from "../services/instance";
import Navlink from "./Navbar/Navbar";
import { ColorRing } from "react-loader-spinner";
function PasswordReset() {
  const [email, setEmail] = useState("");
  const [mgs, setMgs] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await authInstance.post("/reset-password", { email });
      setLoading(false);
      setMgs(res.data.message);
      setEmail("");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div>
      <Navlink />
      <div className="signup d-flex justify-content-center align-items-center vh-100">
        <div className="outside card p-5 bg-dark-subtle ">
          <form onSubmit={handleSendOTP}>
            <div>
              <h2 className="title">Reset Password</h2>
              <label className="fs-4 text-black ">Email Id:</label>
              <br />
              <input
                className="mt-2 rounded"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="d-flex">
                {loading ? (
                  <button
                    type="submit"
                    className="submit mt-3 mx-auto  rounded bg-transparent"
                  >
                    <ColorRing
                      visible={true}
                      height="40"
                      width="40"
                      ariaLabel="color-ring-loading"
                      wrapperStyle={{}}
                      wrapperClass="color-ring-wrapper"
                      colors={[
                        "#abbd81",
                        "#f8b26a",
                        "#849b87",
                        "#e15b64",
                        "#f47e60",
                      ]}
                    />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="submit mt-3 mx-auto  rounded bg-transparent"
                  >
                    Send Reset Link
                  </button>
                )}
                <p className="message mt-3 fs-2 text-danger ">{mgs}</p>
              </div>
            </div>
          </form>
          <Link className="link text-danger fw-bolder fs-3 mx-auto mt-2" to="/">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PasswordReset;
