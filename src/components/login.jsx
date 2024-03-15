import React, { useState } from "react";
import "../App.css";
import { ColorRing } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import { authInstance } from "../services/instance";

const Login = () => {
  const [activeForm, setActiveForm] = useState("login");
    const [msg, setMsg] = useState("");
    const [msg1, setMsg1] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const switchForm = (formType) => {
    setActiveForm(formType);
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]:  value,
    });
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name] : value,
    });
  };

  const signupSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      // console.log('Registering the User...');

      const res = await authInstance.post("/", signupData);

      if (res.data) {
        // console.log('User Registered successfully ', res.data.message);

        const email = signupData.email;
        if (res.data.message === "Activation Mail Sent Successfull to your Mail") {
          const activationMail = await authInstance.post(
            `/link/${email}`,
            { email }
          );
          if (activationMail) {
            setLoading(false);

            setSignupData({
              name: "",
              email: "",
              password: "",
              userRole: "customer",
            });
            return setMsg(res.data.message);
          }
        } else {
          setLoading(false);
          return setMsg(res.data.message);
        }
      }
    } catch (error) {
      return setMsg("Error While SigningUp", error);
    }
  };

  const loginSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const user = await authInstance.post("/login", loginData);
      sessionStorage.setItem("User", JSON.stringify(user.data));
      let Users = JSON.parse(sessionStorage.getItem('User'));
      setLoading(false);
      setMsg1(user.data.message);
      // console.log("login Done", user.data);
      if (Users.message === "No Users found") {
        setMsg1("Click Activate button send to your Mail then login");
      }
       else if (
         Users.message == "Password is wrong" ||
         Users.message == "User not found!"
       ) {
         sessionStorage.clear();
         setLoading(false);
         setMsg1("Password is incorrect or User not found!");
       } else {
         navigate("/chat");
       }
      setLoginData({
        email: "",
        password: "",
      });
    } catch (e) {
      console.log("Error in signin", e);
    }
  };

  return (
    <div className=" container-fluid color bg-dark ">
      <section className="forms-section">
        <h1 className="section-title mt-4">Welcome to Live Chat</h1>
        <div className="forms">
          <div
            className={`form-wrapper ${
              activeForm === "login" ? "is-active" : ""
            }`}
          >
            <button
              type="button"
              className="switcher switcher-login"
              onClick={() => switchForm("login")}
            >
              Login
              <span className="underline"></span>
            </button>
            <form
              className={`form form-login ${
                activeForm === "login" ? "is-active" : ""
              }`}
              onSubmit={loginSubmit}
            >
              <fieldset>
                <legend>
                  Please, enter your email and password for login.
                </legend>
                <div className="input-block">
                  <label htmlFor="login-email">E-mail</label>
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    required
                    value={loginData.email}
                    onChange={handleLoginChange}
                  />
                </div>
                <div className="input-block">
                  <label htmlFor="login-password">Password</label>
                  <input
                    id="login-password"
                    type="password"
                    name="password"
                    required
                    value={loginData.password}
                    onChange={handleLoginChange}
                  />
                </div>
              </fieldset>
              {<h3>{msg1}</h3>}

              <div>
                {loading ? (
                  <button type="submit" className="btn-login">
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
                  <button type="submit" className="btn-login">
                    Login
                  </button>
                )}
                <h3>
                  <Link to="/password-reset" className="mx-3">
                    Reset Password
                  </Link>
                </h3>
              </div>
            </form>
          </div>
          <div
            className={`form-wrapper ${
              activeForm === "signup" ? "is-active" : ""
            }`}
          >
            <button
              type="button"
              className="switcher switcher-signup"
              onClick={() => switchForm("signup")}
            >
              Sign Up
              <span className="underline"></span>
            </button>
            <form
              className={`form form-signup ${
                activeForm === "signup" ? "is-active" : ""
              }`}
              onSubmit={signupSubmit}
            >
              <fieldset>
                <legend>
                  Please, enter your email, password, and password confirmation
                  for sign up.
                </legend>
                <div className="input-block">
                  <label htmlFor="signup-name">Name</label>
                  <input
                    id="signup-name"
                    type="text"
                    name="name"
                    required
                    value={signupData.name}
                    onChange={handleSignupChange}
                  />
                </div>
                <div className="input-block">
                  <label htmlFor="signup-email">E-mail</label>
                  <input
                    id="signup-email"
                    type="email"
                    name="email"
                    required
                    value={signupData.email}
                    onChange={handleSignupChange}
                  />
                </div>
                <div className="input-block">
                  <label htmlFor="signup-password">Password</label>
                  <input
                    id="signup-password"
                    type="password"
                    name="password"
                    required
                    value={signupData.password}
                    onChange={handleSignupChange}
                  />
                </div>
                
              </fieldset>
              {<h3>{msg}</h3>}
              <div>
                {loading ? (
                  <button type="submit" className="btn-signup">
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
                  <button type="submit" className="btn-signup">
                    Continue
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
