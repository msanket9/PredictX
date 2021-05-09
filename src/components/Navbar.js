import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";
import "../css/Navbar.css";

function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar__items container">
        <img src={logo} alt="logo" />
        <div className="navbar__buttons">
          <Link to="/signin" id="login">
            Login
          </Link>
          <Link to="/choose-usertype">Signup</Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
