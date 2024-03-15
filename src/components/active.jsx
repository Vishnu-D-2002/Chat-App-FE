import React, { useState } from "react";
import { Link } from "react-router-dom";
import { protecdInstance } from "../services/instance";

function Active() {
  const [info, setInfo] = useState("");

  const handleActive = async (e) => {
    e.preventDefault();
    const currentURL = window.location.href;
    const match = currentURL.slice(-7);

    if (match) {
      const activationToken = match;
      try {
        const res = await protecdInstance.get(`/activate/${activationToken}`);
        if (res.data) {
          setInfo(res.data.message);
        } else {
          console.error("No data received in the response");
        }
      } catch (error) {
        console.error("Error occurred during activation", error);
      }
    } else {
      console.error("URL format doesn't match the expected pattern");
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="card p-5">
            <h2 className="mb-4">
              To activate your account, please click the button below:
            </h2>
            <button
              className="btn btn-success btn-block"
              onClick={handleActive}
            >
              Activate
            </button>
            <p className="mt-3 text-danger fs-5 mb-0">{info}</p>
            <p className="mt-3 text-center fs-5 mb-0">
              Already have an account?{" "}
              <Link to="/" className="text-decoration-none">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Active;
