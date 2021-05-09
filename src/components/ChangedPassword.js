import React from "react";
import formVector from "../images/FormImage.svg";
import logo from "../assets/logo.svg";
import passwordChanged from "../assets/passwordChanged.svg";
import { Link } from "react-router-dom";
import "../css/ChangedPassword.css";
import axios from "axios";

export default class ChangedPassword extends React.Component {
  constructor(props) {
    super(props);

    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onConfirmPasswordChange = this.onConfirmPasswordChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      passwordChanged: null,
      password: "",
      confirmPassword: "",
      passwordMatch: null,
    };
  }

  onPasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  onConfirmPasswordChange(event) {
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
    // Get the token from the url.
    const url = window.location.href.split("/");
    const token = url[url.length - 2];

    if (this.state.password !== this.state.confirmPassword) {
      this.setState({passwordMatch: false})
      return;
    } else {
      this.setState({passwordMatch: true})
    }

    const data = {
      password: this.state.password
    }

    axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/changepassword/${token}`, data)
      .then((res) => {
        if (res.data.success === true) {
          this.setState({passwordChanged: true})
          console.log(this.state.passwordChanged)
        } else {
          console.log(res)
          // window.location = "/not-found"
        }
      }).catch(err => console.log(err))
  }

  render() {
    if (this.state.passwordChanged === true) {
      return (
        <div className="passwordChanged__page">
          <div className="passwordChanged__left-section">
            <div className="passwordChanged__left-section-item1">
              <img src={logo} id="logo" alt="logo" />
              <h4>Be Connected with your Health</h4>
            </div>
            <img src={formVector} alt="form vector" />
          </div>

          <div className="passwordChanged__right-section">
            <img src={passwordChanged} alt="password changed" />
            <h2>Password Changed!</h2>
            <p>
              Back to <Link to="/signin">Login?</Link>
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="passwordChanged__page">
          <div className="passwordChanged__left-section">
            <div className="passwordChanged__left-section-item1">
              <img src={logo} id="logo" alt="logo" />
              <h4>Be Connected with your Health</h4>
            </div>
            <img src={formVector} alt="form vector" />
          </div>

          <div className="passwordChanged__right-section">
            <h2>Change Password!</h2>
            <form action="" onSubmit={this.onSubmit}>
              <label>Password*</label>
              <input
                type="password"
                id="fpass"
                name="fpass"
                placeholder="********"
                onChange={this.onPasswordChange}
                minLength="8"
                required
              ></input>
              <label>
                Confirm Password*
                {this.state.passwordMatch === false ? (
                  <span style={{ color: "red" }}> Passwords don't match!</span>
                ) : null}
              </label>
              <input
                type="password"
                id="confirmPass"
                name="fcpass"
                placeholder="********"
                onChange={this.onConfirmPasswordChange}
                minLength="8"
                required
              ></input>
              <button type="submit">Submit</button>
            </form>
            <p>
              back to <Link to="/signin">login?</Link>
            </p>
          </div>
        </div>
      );
    }
  }
}
