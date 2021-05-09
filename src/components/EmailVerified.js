import React from "react";
import formVector from "../images/FormImage.svg";
import logo from "../assets/logo.svg";
import emailVerified from "../assets/emailVerified.svg";
import Loading from "../components/Loading";
import axios from "axios";
import { Link } from "react-router-dom";

export default class EmailVerified extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true,
      loading: true,
    };
  }

  componentDidMount() {
    // Get the token from the url.
    const url = window.location.href.split("/");
    const token = url[url.length - 1];

    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/auth/activate/${token}`)
      .then((res) => {
        this.setState({ loading: false });
        if (res.data.success === true) {
          console.log("Loading is false now");
          console.log("User logged");
        } else if (res.data.status === 400) {
          // User already exist so send to signin.
          window.location = "/signin";
        } else {
          window.location = "/error-page";
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.log(err);
        window.location = "/error-page";
      });
  }

  render() {
    if (this.state.loading) {
      return <Loading open={this.state.loading} />;
    } else {
      return (
        <div className="email-verifi__page">
          <div className="email-verifi__left-section">
            <div className="email-verifi__left-section-item1">
              <img src={logo} id="logo" alt="logo" />
              <h4>Be Connected with your Health</h4>
            </div>
            <img src={formVector} alt="form vector" />
          </div>

          <div className="email-verifi__right-section">
            <img src={emailVerified} alt="verify vector" />
            <h2>Account Created!</h2>
            <Link to="/signin">Login</Link>
          </div>
        </div>
      );
    }
  }
}
