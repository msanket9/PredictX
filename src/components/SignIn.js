/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import formVector from "../images/FormImage.svg";
import logo from "../assets/logo.svg";
import "../css/SignIn.css";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import cookie from "js-cookie";

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setemail = this.setemail.bind(this);
    this.setpass = this.setpass.bind(this);
    this.setusertype = this.setusertype.bind(this);

    console.log(process.env.REACT_APP_SERVER_URL)

    this.state = {
      email: "",
      password: "",
      usertype: "",
      redirect: null,
      userExist: true,
      checkpass: true,
    };
  }

  setemail(prop) {
    this.setState({ email: prop });
  }
  setpass(prop) {
    this.setState({ password: prop });
  }
  setusertype(prop) {
    this.setState({ usertype: prop });
    localStorage.setItem("userType", prop);
  }

  handleSubmit(e) {
    e.preventDefault();
    let data = {
      email: this.state.email,
      password: this.state.password,
      userType: this.state.usertype,
    };
    if (this.state.usertype) {
      localStorage.setItem("userType", this.state.usertype);

      axios
        .post(`${process.env.REACT_APP_SERVER_URL}/auth/signin`, data)
        .then((res) => {
          if (res.data.success === true) {
            localStorage.setItem("UserData", JSON.stringify(res.data.data));
            cookie.set("jwt-token", res.data.token);
            
            if (this.state.usertype === "doctor")
              this.setState({ redirect: "/doctor-dashboard" });

            if (this.state.usertype === "patient")
              this.setState({ redirect: "/patient-dashboard" });
          }
          if (res.data.status === 401) {
            this.setState({ userExist: true });
            this.setState({ checkpass: false });
          }
          if (res.data.status === 404) {
            this.setState({ userExist: false });
            this.setState({ checkpass: true });
          }
        })
        .catch((err) => console.log(`Error: ${err}`));
    }
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <div className="signin__page">
        <div className="signin__left-section">
          <div className="signin__left-section-item1">
            <img src={logo} id="logo" alt="logo" />
            <h4>Be Connected with your Health</h4>
          </div>
          <img src={formVector} alt="form vector" />
        </div>

        <div className="signin__right-section">
          <div className="signin_-form">
            <div className="signin-text">
              <h1>Sign In</h1>
              <h5>Welcome Back,</h5>
              {!this.state.usertype ? (
                <h5 style={{ color: "red", fontSize: ".8em" }}>
                  Please select a user type
                </h5>
              ) : (
                ""
              )}
              <div className="userType__buttons">
                <a
                  className={
                    this.state.usertype === "doctor" ? "ut-button-bg" : ""
                  }
                  onClick={() => this.setusertype("doctor")}
                >
                  Doctor
                </a>
                <a
                  className={
                    this.state.usertype === "patient" ? "ut-button-bg" : ""
                  }
                  onClick={() => this.setusertype("patient")}
                >
                  Patient
                </a>
              </div>
            </div>
            <form onSubmit={this.handleSubmit}>
              <div className="form__item-1">
                <label>
                  Email*{" "}
                  {!this.state.userExist ? (
                    <span style={{ color: "red", fontSize: ".8em" }}>
                      User does not exist
                    </span>
                  ) : null}{" "}
                </label>
                <input
                  type="email"
                  id="femail"
                  name="femail"
                  placeholder="johndoe@example.com"
                  onChange={(e) => this.setemail(e.target.value)}
                  required
                />
              </div>
              <div className="form__item-2__signin">
                <label>
                  Password{" "}
                  {!this.state.checkpass ? (
                    <span style={{ color: "red", fontSize: ".8em" }}>
                      Wrong Password
                    </span>
                  ) : null}{" "}
                </label>
                <input
                  className={!this.state.checkpass ? "red" : ""}
                  type="password"
                  id="fname"
                  name="fcpass"
                  placeholder="*********"
                  style={{ width: "100%" }}
                  onChange={(e) => this.setpass(e.target.value)}
                  required
                />
                <Link to="/forgot-password">ForgotPassword?</Link>
              </div>
              <button type="submit">Sign In</button>
              <p id="login-text">
                Dont have an account? <Link to="/choose-usertype">Sign Up</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
