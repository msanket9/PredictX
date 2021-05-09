import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Signup from "./components/Signup";
import SignIn from "./components/SignIn";
import HomeLanding from "./components/home-landing";
import ForgotPassword from "./components/ForgotPassword";
import ChooseUser from "./components/ChooseUser";
import ChangedPassword from "./components/ChangedPassword";
import ErrorPage from "./components/ErrorPage";
import PatientDashboard from "./components/Patientdashboard";
import DoctorDashboard from "./components/Doctordashboard";
import EmailVerificationSent from "./components/EmailVerificationSent";
import EmailVerified from "./components/EmailVerified";
require('dotenv').config();

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomeLanding} />
        <Route path="/signup" component={Signup} />
        <Route path="/signin" component={SignIn} />
        <Route path="/email-verification" component={EmailVerificationSent} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/choose-usertype" component={ChooseUser} />
        <Route path="/change-password/:token" component={ChangedPassword} />
        <Route path="/error-page" component={ErrorPage} />
        <Route path="/email-verified/:token" component={EmailVerified} />
        <Route path="/patient-dashboard" component={PatientDashboard} />
        <Route path="/doctor-dashboard" component={DoctorDashboard} />
      </Switch>
    </Router>
  );
}

export default App;
