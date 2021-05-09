import React from "react";
import formVector from "../images/FormImage.svg";
import logo from "../assets/logo.svg";
import forgotPassword from "../assets/forgotPassword.svg";
import { Link } from "react-router-dom";
import "../css/ForgotPassword.css";
import axios from "axios";

export default class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);

    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      email: "",
      userData: {}
    };
  }

  onChangeEmail(event) {
    this.setState({ email: event.target.value });
  }

  onSubmit(event) {

    event.preventDefault();
    const data = {
      email:this.state.email,
      userType: localStorage.getItem("userType")
    }

    console.log(data)

    axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/forgotpassword`, data)
      .then((res) => {
        if (res.data.success === true) {
          window.location = "/email-verification"
        } else {
          window.location = "/error-page"
        }
        console.log(res)
      }).catch((err) => {
        console.log(err);
        window.location = "/error-page"
      })
  }

  render() {
    return (
      <div className="forgot-pass__page">
        <div className="forgot-pass__left-section">
          <div className="forgot-pass__left-section-item1">
            <img src={logo} id="logo" alt="logo" />
            <h4>Be Connected with your Health</h4>
          </div>
          <img src={formVector} alt="form vector" />
        </div>

        <div className="forgot-pass__right-section">
          <img src={forgotPassword} alt="forgot password vector" />
          <h1>Forgot Password</h1>
          <form action="" onSubmit={this.onSubmit}>
            <label>Email*</label>
            <input
              type="text"
              id="femail"
              name="femail"
              placeholder="johndoe@example.com"
              onChange={this.onChangeEmail}
            ></input>
            <button type="submit">Submit</button>
            <p>
              back to <Link to="/signin">login?</Link>
            </p>
          </form>
        </div>
      </div>
    );
  }
}
