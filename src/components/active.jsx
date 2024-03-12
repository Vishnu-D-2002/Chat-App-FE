import React, { useState } from "react";
import { Link } from "react-router-dom";
import { protecdInstance } from "../services/instance";

function Active() {
  const [info, setInfo] = useState("");
  const handleactive = async (e) => {
    e.preventDefault();
    const currentURL = window.location.href;
    const match = currentURL.slice(-7);

    if (match) {
        const activationToken = match;
        console.log(activationToken);
      try {
        const res = await protecdInstance.get(`/activate/${activationToken}`);
        // console.log('Response:', res);

        if (res.data) {
          console.log("Activation successful:", res.data);
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
    <div>
      <div className="m-5 d-flex flex-column ">
        <h2>To activate your Account please click the link below,else ignore it. </h2>
        <button
          className="btn btn-success mx-auto mt-4"
          onClick={handleactive}
          id="btn"
        >
          Activate
        </button>
        <p className="fs-3 text-danger ">{info}</p>
        <Link to="/" className="fs-3 text-decoration-none mx-auto">
          Login
        </Link>
      </div>
    </div>
  );
}

export default Active;
