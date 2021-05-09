import React from "react";
import formVector from "../images/FormImage.svg";
import logo from "../assets/logo.svg";
import verifiImage from "../assets/emailVerification.svg"
import "../css/EmailVerificationSent.css"

function EmailVerificationSent() {
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
          <img src={verifiImage} alt="verify vector" />
          <h2>Email Verification sent successfully!!</h2>
          <h7>Please check your mail to activate your account</h7>
          <p>Gmail ?<a href="https://www.google.com/gmail/"> Click here</a></p>
      </div>
    </div>
  );
}

export default EmailVerificationSent;
