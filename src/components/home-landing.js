import React from "react";
import { Link } from "react-router-dom";

import "../css/home.css";
import AboutImg from "../assets/AboutImage.svg";
import dashboardSvg from "../assets/dashboard_landing.svg";
import landingAiSvg from "../assets/landing_ai.svg";
import landingReminderSvg from "../assets/landing_reminder.svg";

import logo from "../assets/logo.svg";
import Navbar from "./Navbar";

function HomeLanding() {
  return (
    <>
      <Navbar />
      <About />

      <Features />
      <Contact />
      <Footer />
    </>
  );
}

function About() {
  return (
    <section className="landing__about" id="landing__about">
      <div className="container">
        <div className="container__about">
          <div className="info__about">
            <h4>Be Connected with your Health</h4>
            <p>
              PredictX is a simple application that allows you to store all your
              medical reocrds and medications and much more.
            </p>
            <div className="navbar__buttons">
              <Link to="/signin">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          </div>
          <div className="images__about">
            <img src={AboutImg} alt="about" />
          </div>
        </div>
      </div>
    </section>
  );
}
function Features() {
  return (
    <section className="landing__features" id="landing__features">
      <div className="Wave-svg">
        <svg
          viewBox="0 0 1440 131"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 61L80 55.7C160 50 320 40 480 50.3C640 61 800 93 960 87.7C1120 82 1280 40 1360 18.3L1440 -3V131H1360C1280 131 1177 131 1017 131C857 131 741.5 131 581.5 131C421.5 131 247 131 167 131H0V61Z"
            fill="#F3F3F3"
          />
        </svg>
      </div>
      <div className="landing__dashboard">
        <div className="container">
          <div className="landing__dashboard__text">
            <h4>Keep track of your patients health</h4>
            <p>
              Transform your clinic or hospital into digital environment for
              better care for patients through a standalone health record
              management and follow-up visit reminders on patient’s digital
              health wallet along with patient relationship
            </p>
          </div>
          <div className="landing__dashboard__images">
            <img src={dashboardSvg} alt="dashboard-svg" />
          </div>
        </div>
      </div>
      <div className="landing__ai_section">
        <div className="container">
          <div className="landing_ai_images">
            <img src={landingAiSvg} alr="landingaisvg" />
          </div>
          <div className="landing_ai_text">
            <h4>Detect heart desease and diabeties with powerful AI</h4>
            <p>
              The digital self-care app that helps you predict the risk of any
              heart & diabetes related diseases.It is a long established fact
              that a reader will be distracted by the readable content of a page
              when looking at its layout. The point of using Lorem Ipsum is that
              it has a more-or-less normal distribution
            </p>
          </div>
        </div>
      </div>
      <div className="landing_reminder">
        <div className="container">
          <div className="landing_reminder_text">
            <h4>Medication Reminder for Patient </h4>
            <p>
              Manage Health details to access anytime, anywhere and trend health
              progress. Make yourself aware and understand of how to maintain
              personal Health.
            </p>
          </div>
          <div className="landing_reminder_images">
            <img src={landingReminderSvg} alt="landingReminderSvg" />
          </div>
        </div>
      </div>
      <svg viewBox="0 0 1440 87" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0 60.9939L80 55.9428C160 50.5106 320 40.9803 480 50.7965C640 60.9939 800 91.4909 960 86.4398C1120 81.0075 1280 40.9803 1360 20.2995L1440 0H1305.5C1225.5 0 1142.5 0 982.5 0C822.5 0 701 0 541 0C381 0 228 4.20085e-05 148 4.20085e-05H0V60.9939Z"
          fill="#F3F3F3"
        />
      </svg>
    </section>
  );
}
function Contact() {
  return (
    <section className="landing__Contact" id="landing__Contact">
      <div className="container">
        <div className="contact__container">
          <h3>Get In Touch</h3>
          <a href="#">someone@PredictX.com</a>
        </div>
      </div>
    </section>
  );
}
function Footer() {
  return (
    <section className="footer">
      <div className="container">
        <div className="left-footer-row">
          <img src={logo} alt="logo" />
          <p>Connecting you to yourself</p>
        </div>
        <div className="right-footer-row">
          <div className="footer-links">
            <a href="#landing__about">About</a>
            <a href="#landing__features">Features</a>
            <a href="#landing__Contact">Contact</a>
          </div>
          <h4>© 2021 PredictX All rights reserved.</h4>
        </div>
      </div>
    </section>
  );
}
export default HomeLanding;
