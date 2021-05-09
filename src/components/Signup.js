import React from "react";
import "../css/Signup.css";
import formVector from "../images/FormImage.svg";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";
import axios from "axios";

export default class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeConfirmPass = this.onChangeConfirmPass.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: "",
      userExist: false,
      passwordMatch: null,
    };
  }

  componentDidMount() {
    // Once the component mounts store the usertype
    // in the localstorage.
    // Added this if statement so that we dont lose
    // the user type on refresh.
    if (this.props.location.usertype !== undefined) {
      console.log("setting in local storage");
      console.log(this.props.location.usertype);
      localStorage.setItem("userType", this.props.location.usertype)
    } else {
      this.userType = localStorage.getItem("userType");
    }
  }

  // On change event handles for the form.
  onChangeName(event) {
    this.setState({ fullName: event.target.value });
  }

  onChangeEmail(event) {
    this.setState({ email: event.target.value });
  }

  onChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  onChangeConfirmPass(event) {
    this.setState({ confirmPassword: event.target.value });
    let element = document.getElementById("confirmPass");
    if (this.state.password !== element.value) {
      element.style.border = "2px solid red";
    } else {
      console.log("else");
      element.style.border = "2px solid #00a459";
    }
  }

  onSubmit(event) {
    event.preventDefault();
    const userType = localStorage.getItem("userType");
    this.setState({ userType: userType }, () => {
      if (this.state.password !== this.state.confirmPassword) {
        this.state.passwordMatch = false;
        return;
      } else {
        this.state.passwordMatch = true;
      }

      // Declare the data to send to the backend.
      const userData = {
        name: this.state.fullName,
        email: this.state.email,
        password: this.state.password,
        confirmPassword: this.state.confirmPassword,
        userType: this.state.userType,
      };

      console.log(userData);

      axios
        .post(`${process.env.REACT_APP_SERVER_URL}/auth/signup`, userData)
        .then((res) => {
          if (res.data.success == true) {
            window.location = "/email-verification";
          } else if (res.data.status == 404) {
            this.setState({ userExist: true });
            console.log(res);
          } else {
            window.location = "/not-found";
          }
        })
        .catch((err) => console.log(`Error: ${err}`));
    });
  }

  render() {
    return (
      <div className="signup__page">
        <div className="signup__left-section">
          <div className="signup__left-section-item1">
            <img src={logo} id="logo" alt="logo" />
            <h4>Be Connected with your Health</h4>
          </div>
          <img src={formVector} alt="form vector" />
        </div>

        <div className="signup__right-section">
          <div className="signup_-form">
            <div className="signup-text">
              <h1>Sign Up</h1>
              <h5>
                Manage all your {/* Shows content based on user type. */}
                {this.userType === "doctor"
                  ? "patients efficiently."
                  : "Medical Records."}{" "}
              </h5>
              <p>Lets get you setup and verify your personal account</p>
            </div>
            <form onSubmit={this.onSubmit}>
              <div className="form__item-1">
                <label>Full Name*</label>
                <input
                  type="text"
                  id="fname"
                  name="fname"
                  placeholder="John Doe"
                  onChange={this.onChangeName}
                  required
                ></input>
                <label>
                  Email*{" "}
                  {this.state.userExist ? (
                    <span style={{ color: "red" }}>
                      User with this email already exist
                    </span>
                  ) : null}{" "}
                </label>
                <input
                  type="text"
                  id="femail"
                  name="femail"
                  placeholder="johndoe@example.com"
                  onChange={this.onChangeEmail}
                  required
                ></input>
              </div>
              <div className="form__item-2">
                <div className="form__item-2-pass">
                  <label>Password*</label>
                  <input
                    type="password"
                    id="fname"
                    name="fpass"
                    placeholder="********"
                    minlength="8"
                    onChange={this.onChangePassword}
                    required
                  ></input>
                </div>
                <div className="form__item-2-pass">
                  <label>
                    Confirm Password*
                    {this.state.passwordMatch == false ? (
                      <span style={{ color: "red" }}>
                        {" "}
                        Passwords don't match!
                      </span>
                    ) : null}
                  </label>
                  <input
                    type="password"
                    id="confirmPass"
                    name="fcpass"
                    placeholder="*********"
                    minlength="8"
                    onChange={this.onChangeConfirmPass}
                    required
                  ></input>
                </div>
              </div>
              <div className="form__item-3">
                <input type="checkbox" id="terms-conditons" required />
                <label for="terms-conditions">
                  I agree to all the <Link to="#">Terms and Conditions.</Link>
                </label>
              </div>
              <button>Create Account</button>
              <p id="login-text">
                Already have an account? <Link to="/signin">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
