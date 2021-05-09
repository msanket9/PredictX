import React from "react";
import formVector from "../images/FormImage.svg";
import logo from "../assets/logo.svg"
import chooseUser from "../assets/chooseUser.svg"
import "../css/ChooseUser.css"
import {Link} from "react-router-dom";

function ChooseUser() {
  return (
    <div className="choose-user__page">
      <div className="choose-user__left-section">
        <div className="choose-user__left-section-item1">
          <img src={logo} id="logo" alt="logo" />
          <h4>Be Connected with your Health</h4>
        </div>
        <img src={formVector} alt="form vector" />
      </div>

      <div className="choose-user__right-section">
        <img src={chooseUser} alt="choose user vector"/>
        <h2>Signup as</h2>
        <div className="userType__choice">
            <Link to={{pathname:"/signup", usertype:"doctor"}}>Doctor</Link>
            <p>Or</p>
            <Link  to={{pathname:"/signup", usertype:"patient"}}>Patient</Link>
        </div>
      </div>
    </div>
  );
}

export default ChooseUser;
