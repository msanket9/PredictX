import React from "react";
import axios from "axios";
import cookie from "js-cookie";
import Loading from "./Loading";
import { MyResponsiveGraph } from "./Graph";
import { Link, Redirect } from "react-router-dom";
import Hamburger from "hamburger-react";

// CSS
import "../css/Doctordashboard.css";

// Images
import MobileNavLogo from "../assets/MobileNavLogo.svg";
import MobileDashboardIcon from "../assets/MobileDashboardIcon.svg";
import MobilePatientsIcon from "../assets/PatientsIcon.svg";
import AddPatientsIcon from "../assets/AddPatientIcon.svg";
import LogoutIcon from "../assets/LogoutIcon.svg";
import NotifiBell from "../assets/NotifiBell.svg";
import AgeIcon from "../assets/NewIcons/AgeIcon.svg";
import HeightIcon from "../assets/NewIcons/HeightIcon.svg";
import WeightIcon from "../assets/NewIcons/WeightIcon.svg";
import BmiIcon from "../assets/NewIcons/BmiIcon.svg";
import ProfileIcon from "../assets/ProfileIcon.svg";
import AiIcon from "../assets/AiIcon.svg";
import DiabetesIcon from "../assets/NewIcons/diabetesIcon.svg";
import HeartIcon from "../assets/NewIcons/heartIcon.svg";
import MenuIcon from "../assets/NewIcons/MenuIcon.svg";
import Logo from "../assets/NewIcons/Logo.svg";

class DoctorDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.setActivePatient = this.setActivePatient.bind(this);
    this.toogleSidebar = this.tooglePatientsListDesktop.bind(this);
    // this.toogleAddPatientForm = this.toogleAddPatientForm.bind(this);
    this.onSubmitPatientForm = this.onSubmitPatientForm.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.toogleAddPatientsDesktop = this.toogleAddPatientsDesktop.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.toogleDesktopAi = this.toogleDesktopAi.bind(this);

    /** Mobile **/
    this.toogleDashboard = this.toogleDashboard.bind(this);
    this.tooglePatientsList = this.tooglePatientsList.bind(this);
    this.toogleAddPatients = this.toogleAddPatients.bind(this);
    this.toogleAi = this.toogleAi.bind(this);

    this.state = {
      UserData: {},
      Email: "",
      redirect: null,
      patients: [],
      medicalData: "loading",
      dosageData: {},
      loading: false,
      SelectedPatientId: null,
      SidebarOn: true,
      ActiveUserData: "loading",
      chartsLoading: true,
      ActiveUserName: undefined,
      EmailNotExist: false,
      PatientSubbed: false,
      RequestSent: false,

      /** Charts Data **/
      bmiChartData: undefined,
      glucoseCharData: undefined,

      /** AI Data **/
      heartAttackResult: undefined,
      diabetesResult: undefined,

      /** Toggles **/
      patientListToggle: false,
      addPatientsToogle: false,
      aiToggle: false,
      sidebarToogle: true,
      desktopAddPatientToogle: false,
    };
  }

  componentDidMount() {
    var UserData = JSON.parse(localStorage.getItem("UserData"));
    this.setState({ UserData: UserData });
    const token = cookie.get("jwt-token");

    this.setState({ loading: true });
    this.setState({ chartsLoading: true });

    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/doctor/mypatients`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success === true) {
          this.setState({ loading: false });
          this.setState({ patients: res.data.data }, () => {
            if (this.state.patients.length !== 0) {
              this.setState({ ActiveUserName: this.state.patients[0].name });

              axios
                .get(
                  `${process.env.REACT_APP_SERVER_URL}/patient/medrecord/${this.state.patients[0].medrecord_id}`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                )
                .then((res) => {
                  if (res.data.success === true) {
                    this.setState({ loading: false });
                    this.setState({ ActiveUserData: res.data.data }, () => {
                      // Predict Ai Data

                      // Heart Attack
                      var data = {
                        age: { value: this.state.ActiveUserData.age },
                        bmi: { value: this.state.ActiveUserData.bmi },
                        cholestrol:
                          this.state.ActiveUserData.cholestrol[
                            this.state.ActiveUserData.cholestrol.length - 1
                          ],
                        diastolicPressure:
                          this.state.ActiveUserData.diastolicPressure[
                            this.state.ActiveUserData.diastolicPressure.length -
                              1
                          ],
                        heartRate:
                          this.state.ActiveUserData.heartRate[
                            this.state.ActiveUserData.heartRate.length - 1
                          ],
                        systolicPressure:
                          this.state.ActiveUserData.systolicPressure[
                            this.state.ActiveUserData.systolicPressure.length -
                              1
                          ],
                        glucoseConc:
                          this.state.ActiveUserData.glucoseConc[
                            this.state.ActiveUserData.glucoseConc.length - 1
                          ],
                      };

                      axios
                        .post(
                          "https://heart-attack-prediction-api.herokuapp.com/predict-heart-attack",
                          data
                        )
                        .then((res) => {
                          this.setState({
                            heartAttackResult: res.data.prediction_result,
                          });
                          console.log(res.data.prediction_result);
                        })
                        .catch((err) => console.log(err));

                      // Diabetes
                      var data2 = {
                        age: { value: this.state.ActiveUserData.age },
                        num_preg:
                          this.state.ActiveUserData.numPreg[
                            this.state.ActiveUserData.numPreg.length - 1
                          ],
                        glucose_conc:
                          this.state.ActiveUserData.glucoseConc[
                            this.state.ActiveUserData.glucoseConc.length - 1
                          ],
                        diastolic_bp:
                          this.state.ActiveUserData.diastolicBp[
                            this.state.ActiveUserData.diastolicBp.length - 1
                          ],
                        thickness: { value: "22" },
                        insulin:
                          this.state.ActiveUserData.insulin[
                            this.state.ActiveUserData.insulin.length - 1
                          ],
                        bmi: { value: this.state.ActiveUserData.bmi },
                        dpf: this.state.ActiveUserData.dfs[
                          this.state.ActiveUserData.dfs.length - 1
                        ],
                      };

                      axios
                        .post(
                          "https://predict-x-diabetes-pred-api.herokuapp.com/predict-diabetes",
                          data2
                        )
                        .then((res) => {
                          this.setState({
                            diabetesResult: res.data.prediction_result,
                          });
                          console.log(res);
                        })
                        .catch((err) => console.log(err));
                    });
                  }
                });
            }
          });
        }
      });
  }

  setActivePatient(event) {
    this.setState({ ActiveUserName: event.target.innerText });

    var currentId = event.target.id;

    var currentPatient = document.getElementById(currentId);

    var allPatients = document.querySelectorAll(".patients--name");

    for (var i = 0; i < allPatients.length; i++) {
      if (allPatients[i].id !== currentId) {
        var nameEle = document.getElementById(allPatients[i].id);
        nameEle.style.backgroundColor = "white";
        nameEle.style.color = "black";
      }
    }

    currentPatient.style.backgroundColor = "var(--primary-color)";
    currentPatient.style.color = "white";
    currentPatient.style.margin = "10px";

    this.setState(
      { SelectedPatientId: event.target.childNodes[0].innerHTML },
      () => {
        const token = cookie.get("jwt-token");
        var Allli = document.querySelectorAll("li");
        console.log(Allli);
        Allli.forEach((item) => (item.style.borderRight = "none"));
        axios
          .get(
            `${process.env.REACT_APP_SERVER_URL}/patient/medrecord/${this.state.SelectedPatientId}`,
            {
              headers: { authorization: `Bearer ${token}` },
            }
          )
          .then((res) => {
            if (res.data.success === true) {
              this.setState({ ActiveUserData: res.data.data, loading: false });

              // Heart Attack
              var data = {
                age: { value: this.state.ActiveUserData.age },
                bmi: { value: this.state.ActiveUserData.bmi },
                cholestrol:
                  this.state.ActiveUserData.cholestrol[
                    this.state.ActiveUserData.cholestrol.length - 1
                  ],
                diastolicPressure:
                  this.state.ActiveUserData.diastolicPressure[
                    this.state.ActiveUserData.diastolicPressure.length - 1
                  ],
                heartRate:
                  this.state.ActiveUserData.heartRate[
                    this.state.ActiveUserData.heartRate.length - 1
                  ],
                systolicPressure:
                  this.state.ActiveUserData.systolicPressure[
                    this.state.ActiveUserData.systolicPressure.length - 1
                  ],
                glucoseConc:
                  this.state.ActiveUserData.glucoseConc[
                    this.state.ActiveUserData.glucoseConc.length - 1
                  ],
              };

              axios
                .post(
                  "https://heart-attack-prediction-api.herokuapp.com/predict-heart-attack",
                  data
                )
                .then((res) => {
                  this.setState({
                    heartAttackResult: res.data.prediction_result,
                  });
                  console.log(res.data.prediction_result);
                })
                .catch((err) => console.log(err));
            }
          })
          .catch((err) => console.log(err));

        // Diabetes
        var data2 = {
          age: { value: this.state.ActiveUserData.age },
          num_preg:
            this.state.ActiveUserData.numPreg[
              this.state.ActiveUserData.numPreg.length - 1
            ],
          glucose_conc:
            this.state.ActiveUserData.glucoseConc[
              this.state.ActiveUserData.glucoseConc.length - 1
            ],
          diastolic_bp:
            this.state.ActiveUserData.diastolicBp[
              this.state.ActiveUserData.diastolicBp.length - 1
            ],
          thickness: { value: "22" },
          insulin:
            this.state.ActiveUserData.insulin[
              this.state.ActiveUserData.insulin.length - 1
            ],
          bmi: { value: this.state.ActiveUserData.bmi },
          dpf: this.state.ActiveUserData.dfs[
            this.state.ActiveUserData.dfs.length - 1
          ],
        };

        axios
          .post(
            "https://predict-x-diabetes-pred-api.herokuapp.com/predict-diabetes",
            data2
          )
          .then((res) => {
            this.setState({
              diabetesResult: res.data.prediction_result,
            });
            console.log(res);
          })
          .catch((err) => console.log(err));
      }
    );
  }

  addPatients;

  toogleDashboard() {
    if (
      this.state.patientListToggle ||
      this.state.aiToggle ||
      this.state.addPatientsToogle
    ) {
 
      var list = document.getElementById("mobile-patientsList");
      var dashboard = document.getElementById("doctorDashboard");
      var addPatients = document.getElementById("addpatients");
      var ai = document.getElementById("ai");
      var aiOverlay = document.getElementById("ai-overlay");

      list.style.left = "-400px";
      dashboard.style.overflowY = "auto";
      this.setState({ patientListToggle: false });

      list.style.left = "-900px";
      dashboard.style.overflowY = "auto";
      this.setState({ patientListToggle: false });

      addPatients.style.left = "-770px";
      this.setState({ addPatientsToogle: false });

      aiOverlay.style.opacity = 0;
      aiOverlay.style.zIndex = "-1";
      this.setState({ aiToggle: false });
    }
  }

  tooglePatientsList() {
    var list = document.getElementById("mobile-patientsList");
    var dashboard = document.getElementById("doctorDashboard");
    var addPatients = document.getElementById("addpatients");
    var ai = document.getElementById("ai");
    var aiOverlay = document.getElementById("ai-overlay");

    if (this.state.addPatientsToogle) {
      addPatients.style.left = "-770px";
      aiOverlay.style.opacity = 0;
      aiOverlay.style.zIndex = "-1";
      this.setState({ addPatientsToogle: false });
    }

    if (this.state.aiToggle) {
      this.setState({ aiToggle: false });
      aiOverlay.style.opacity = 0;
      aiOverlay.style.zIndex = "-1";
    }

    if (!this.state.patientListToggle) {
      list.style.left = "0";
      dashboard.style.overflowY = "hidden";
      aiOverlay.style.opacity = 0;
      aiOverlay.style.zIndex = "-1";
      this.setState({ patientListToggle: true });
    } else {
      list.style.left = "-900px";
      dashboard.style.overflowY = "auto";
      aiOverlay.style.opacity = 0;
      aiOverlay.style.zIndex = "-1";
      this.setState({ patientListToggle: false });
    }
  }

  toogleAddPatients() {
    var addPatients = document.getElementById("addpatients");
    var list = document.getElementById("mobile-patientsList");
    var dashboard = document.getElementById("doctorDashboard");
    var ai = document.getElementById("ai");
    var aiOverlay = document.getElementById("ai-overlay");

    if (this.state.patientListToggle) {
      list.style.left = "-900px";
      dashboard.style.overflowY = "auto";
      aiOverlay.style.opacity = 0;
      aiOverlay.style.zIndex = "-1";
      this.setState({ patientListToggle: false });
    }

    if (this.state.aiToggle) {
      aiOverlay.style.opacity = 0;
      aiOverlay.style.zIndex = "-1";
      this.setState({ aiToggle: false });
    }

    if (!this.state.addPatientsToogle) {
      addPatients.style.left = "0px";
      aiOverlay.style.opacity = 0;
      aiOverlay.style.zIndex = "-1";
      this.setState({ addPatientsToogle: true });
    } else {
      addPatients.style.left = "-770px";
      aiOverlay.style.opacity = 0;
      aiOverlay.style.zIndex = "-1";
      this.setState({ addPatientsToogle: false });
    }
  }

  toogleAi() {
    var ai = document.getElementById("ai");
    var addPatients = document.getElementById("addpatients");
    var list = document.getElementById("mobile-patientsList");
    var dashboard = document.getElementById("doctorDashboard");
    var aiOverlay = document.getElementById("ai-overlay");

    if (this.state.patientListToggle) {
      list.style.left = "-900px";
      dashboard.style.overflowY = "auto";
      aiOverlay.style.opacity = 0;
      aiOverlay.style.zIndex = "-1";
      this.setState({ patientListToggle: false });
    }

    if (this.state.addPatientsToogle) {
      addPatients.style.left = "-770px";
      aiOverlay.style.opacity = 0;
      aiOverlay.style.zIndex = "-1";
      this.setState({ addPatientsToogle: false });
    }

    if (!this.state.aiToggle) {
      aiOverlay.style.opacity = 1;
      aiOverlay.style.zIndex = 4;
      this.setState({ aiToggle: true });
    } else {
      aiOverlay.style.opacity = 0;
      aiOverlay.style.zIndex = "-19";
      this.setState({ aiToggle: false });
    }
  }

  onSubmitPatientForm(event) {
    event.preventDefault();

    const token = cookie.get("jwt-token");
    let data = { email: this.state.Email };
    let result = document.getElementById("result");
    let resultDesktop = document.getElementById("result-desktop");
    let email = document.getElementById("patient-email");
    console.log(email);

    console.log("submitted");
    axios
      .post(
        `${process.env.REACT_APP_SERVER_URL}/doctor/addpatientnotifiaction`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (res.data.success === true) {
          this.setState({ EmailNotExist: false });
          this.setState({ RequestSent: true });
          console.log(res);
          result.innerHTML = " Notification sent to the patient.";
          resultDesktop.innerHTML = " Notification sent to the patient.";
          result.style.color = "var(--primary-color)";
          resultDesktop.style.color = "var(--primary-color)";
          console.log("notification sent");
        } else {
          this.setState({ EmailNotExist: true });
          this.setState({ PatientSubbed: false });
          this.setState({ RequestSent: false });
          console.log(res);
          result.innerHTML = " Entered email does not exist.";
          resultDesktop.innerHTML = " Entered email does not exist.";
          result.style.color = "red";
          resultDesktop.style.color = "red";
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ EmailNotExist: false });
        this.setState({ PatientSubbed: false });
        this.setState({ RequestSent: false });
        result.innerHTML = " Email already sent or user subscribed.";
        resultDesktop.innerHTML = " Email already sent or user subscribed.";
        result.style.color = "red";
        resultDesktop.style.color = "red";
        result.style.fontSize = "12px";
        resultDesktop.style.fontSize = "12px";
      });
  }

  onChangeEmail(event) {
    this.setState({ Email: event.target.value });
  }

  tooglePatientsListDesktop() {
    var sidebar = document.getElementById("patientsList");
    var button = document.getElementById("nav-buttons-pa-list");
    var aiButton = document.getElementById("nav-buttons-ai");
    var aiOverlay = document.getElementById("ai-overlay");

    if (!this.state.sidebarToogle) {
      sidebar.style.transform = "translate3d(-100%, 0%, 0px)";
      aiButton.style.color = "#535353";
      button.style.backgroundColor = "transparent";
      button.style.color = "#535353";
      sidebar.style.marginLeft = "0px";
      this.setState({ sidebarToogle: true });
    } else {
      sidebar.style.transform = "translate3d(0%, 0%, 0px)";
      button.style.backgroundColor = "var(--primary-color)";
      aiButton.style.backgroundColor = "transparent";
      aiButton.style.color = "#535353";
      sidebar.style.marginLeft = "300px";
      button.style.color = "white";
      aiOverlay.style.opacity = "0";
      aiOverlay.style.zIndex = "-19";
      this.setState({ sidebarToogle: false });
    }
  }

  toogleAddPatientsDesktop() {
    var card = document.getElementById("add-patient-desktop");

    if (!this.state.desktopAddPatientToogle) {
      card.style.top = "60px";
      this.setState({ desktopAddPatientToogle: true });
    } else {
      card.style.top = "-250px";
      this.setState({ desktopAddPatientToogle: false });
    }
  }

  toogleDesktopAi() {
    var aiOverlay = document.getElementById("ai-overlay");
    var button = document.getElementById("nav-buttons-ai");
    var paButton = document.getElementById("nav-buttons-pa-list");
    var sidebar = document.getElementById("patientsList");

    if (aiOverlay.style.opacity === "1") {
      aiOverlay.style.opacity = "0";
      aiOverlay.style.zIndex = "-19";
      paButton.style.color = "#535353";
      button.style.color = "#535353";
      button.style.backgroundColor = "transparent";
    } else {
      aiOverlay.style.opacity = "1";
      aiOverlay.style.zIndex = "2";
      button.style.backgroundColor = "var(--primary-color)";
      paButton.style.backgroundColor = "transparent";
      paButton.style.color = "#535353";
      button.style.color = "white";
      sidebar.style.transform = "translate3d(-100%, 0%, 0px)";
      this.setState({ sidebarToogle: true });
    }
  }

  onLogout() {
    cookie.remove("jwt-token");
    this.setState({ redirect: "/" });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    } else {
      return this.state.loading ? (
        <Loading open={this.state.loading} />
      ) : (
        <div className="doctorDashboard" id="doctorDashboard">
          <div className="desktop-navbar">
            <div className="add-patient-logout">
              <div
                className="desktop-add-patient-button"
                onClick={this.toogleAddPatientsDesktop}
              >
                <img
                  src={AddPatientsIcon}
                  alt="add-patients"
                  id="add-patients"
                />
                Add Patient
              </div>
              <div className="desktop-logout-button" onClick={this.onLogout}>
                <img src={LogoutIcon} alt="logout" id="mobile-logout" />
                Logout
              </div>
            </div>
          </div>
          <div className="addpatients" id="addpatients">
            <p>Add Patients</p>
            <p>Enter the email of the patietnt to be added.</p>
            <div className="addpatient__form">
              <form onSubmit={this.onSubmitPatientForm}>
                <div className="formInput">
                  <label required>
                    Email*<span id="result"></span>
                  </label>
                  <input
                    placeholder="xyz@example.com"
                    required
                    onChange={this.onChangeEmail}
                    id="patient-email"
                  />
                </div>
                <button type="submit">Submit</button>
              </form>
            </div>
          </div>{" "}
          <div className="sidebar">
            <div className="backdrop">
              <img src={Logo} alt="logo" id="logo" />
              <div
                className="sidebar--item"
                style={{ margin: "20px 0px 0px 20px" }}
                id="nav-buttons-pa-list"
                onClick={this.toogleSidebar}
              >
                <img
                  src={MobilePatientsIcon}
                  alt="patients"
                  id="patients-icon"
                />
                My Patients
              </div>
              <div
                className="sidebar--item"
                style={{ margin: "20px 0px 0px 20px" }}
                id="nav-buttons-ai"
                onClick={this.toogleDesktopAi}
              >
                <img src={AiIcon} alt="ai-icon" id="ai-icon" />
                Ai Predictions
              </div>
            </div>
          </div>
          <div className="patientsList" id="mobile-patientsList">
            <div className="sidebar--item" style={{ backgroundColor: "white" }}>
              {this.state.patients
                ? Object.keys(this.state.patients).map((item) => {
                    return (
                      <div
                        className="patients--name"
                        id={this.state.patients[item].medrecord_id}
                      >
                        <img src={ProfileIcon} alt="profile" />
                        <li
                          onClick={this.setActivePatient}
                          key={this.state.patients[item]._id}
                          id={this.state.patients[item].medrecord_id}
                        >
                          <span style={{ display: "none" }}>
                            {this.state.patients[item].medrecord_id}
                          </span>
                          {this.state.patients[item].name}
                        </li>
                      </div>
                    );
                  })
                : "Empty"}
            </div>
          </div>
          <div className="patientsList" id="patientsList">
            <div className="sidebar--item" style={{ backgroundColor: "white" }}>
              {this.state.patients
                ? Object.keys(this.state.patients).map((item) => {
                    return (
                      <div
                        className="patients--name"
                        id={this.state.patients[item].medrecord_id}
                      >
                        <img src={ProfileIcon} alt="profile" />
                        <li
                          onClick={this.setActivePatient}
                          key={this.state.patients[item]._id}
                          id={this.state.patients[item].medrecord_id}
                        >
                          <span style={{ display: "none" }}>
                            {this.state.patients[item].medrecord_id}
                          </span>
                          {this.state.patients[item].name}
                        </li>
                      </div>
                    );
                  })
                : "Empty"}
            </div>
          </div>
          <main id="main">
            <div className="doctorDashboard__main" id="main-desktop">
              <div className="patientsName__grid">
                <div className="patientsName--item">
                  <h2>Dashboard</h2>
                </div>
                <div className="patientsName--item" id="notifi-bell">
                  <img src={NotifiBell} alt="notifibell" />
                </div>
                <div className="patientsName--item">
                  {this.state.ActiveUserData === "loading"
                    ? "Patient not added"
                    : `${this.state.ActiveUserName}'s Medical Records`}
                </div>
              </div>

              <div className="recordCards__grid">
                <div className="recordsCard--item" id="age">
                  <div className="record">
                    <img src={AgeIcon} alt="age" />
                    {this.state.ActiveUserData.age === undefined ? (
                      <p
                        style={{
                          fontWeight: "500",
                          fontSize: "0.8em",
                          padding: "10px",
                        }}
                      >
                        Patient not added
                      </p>
                    ) : (
                      `${this.state.ActiveUserData.age}`
                    )}{" "}
                    y/o
                  </div>
                  Age
                </div>
                <div className="recordsCard--item" id="weight">
                  <div className="record">
                    <img src={WeightIcon} alt="age" />
                    {this.state.ActiveUserData.weight === undefined ? (
                      <p
                        style={{
                          fontWeight: "500",
                          fontSize: "0.8em",
                          padding: "10px",
                        }}
                      >
                        Patient not added
                      </p>
                    ) : (
                      `${
                        this.state.ActiveUserData.weight[
                          this.state.ActiveUserData.weight.length - 1
                        ].value
                      }`
                    )}{" "}
                    Kg
                  </div>
                  Weight
                </div>
                <div className="recordsCard--item" id="height">
                  <div className="record">
                    <img src={HeightIcon} alt="age" />
                    {this.state.ActiveUserData.height === undefined ? (
                      <p
                        style={{
                          fontWeight: "500",
                          fontSize: "0.8em",
                          padding: "10px",
                        }}
                      >
                        Patient not added
                      </p>
                    ) : (
                      `${
                        this.state.ActiveUserData.height[
                          this.state.ActiveUserData.height.length - 1
                        ].value
                      }`
                    )}{" "}
                    Cm
                  </div>
                  Height
                </div>
                <div className="recordsCard--item" id="bmi">
                  <div className="record">
                    <img src={BmiIcon} alt="age" />
                    {this.state.ActiveUserData.bmi === undefined ? (
                      <p
                        style={{
                          fontWeight: "500",
                          fontSize: "0.8em",
                          padding: "10px",
                        }}
                      >
                        Patient not added
                      </p>
                    ) : (
                      `${Math.floor(this.state.ActiveUserData.bmi)}`
                    )}
                  </div>
                  BMI
                </div>
              </div>
              {/* Height weight heatrate spo2 insulin cholesterol */}
              <div className="graphs__grid">
                <div className="graphs--item" id="graph1">
                  <div className="graph--flex">
                    {this.state.ActiveUserData.weight !== undefined ? (
                      <MyResponsiveGraph
                        data={{
                          records: this.state.ActiveUserData,
                          type: "cholestrol",
                          graphType: "line",
                          backgroundColor: "rgba(0, 164, 89, 0.2)",
                          borderColor: "rgba(0, 164, 89, 1)",
                        }}
                      />
                    ) : (
                      `Data Not Entered`
                    )}
                  </div>
                </div>
                <div className="graphs--item" id="graph2">
                  <div className="graph--flex">
                    {this.state.ActiveUserData.weight !== undefined ? (
                      <MyResponsiveGraph
                        data={{
                          records: this.state.ActiveUserData,
                          type: "weight",
                          graphType: "bar",
                          backgroundColor: "rgba(116, 192, 255, 0.23)",
                          borderColor: "#74c0ff",
                        }}
                      />
                    ) : (
                      `Data Not Entered`
                    )}
                  </div>
                </div>
                <div className="graphs--item" id="graph3">
                  <div className="graph--flex">
                    {this.state.ActiveUserData.weight !== undefined ? (
                      <MyResponsiveGraph
                        data={{
                          records: this.state.ActiveUserData,
                          type: "heartRate",
                          graphType: "bar",
                          backgroundColor: "rgba(255, 212, 204, 0.3)",
                          borderColor: "rgb(255, 97, 97)",
                        }}
                      />
                    ) : (
                      `Data Not Entered`
                    )}
                  </div>
                </div>
                <div className="graphs--item" id="graph4">
                  <div className="graph--flex">
                    {this.state.ActiveUserData.weight !== undefined ? (
                      <MyResponsiveGraph
                        data={{
                          records: this.state.ActiveUserData,
                          type: "spo2",
                          graphType: "line",
                          backgroundColor: "rgba(9, 158, 176, 0.2)",
                          borderColor: "rgba(9, 158, 176, 1)",
                        }}
                      />
                    ) : (
                      `Data Not Entered`
                    )}
                  </div>
                </div>
                <div className="graphs--item" id="graph5">
                  <div className="graph--flex">
                    {this.state.ActiveUserData.weight !== undefined ? (
                      <MyResponsiveGraph
                        data={{
                          records: this.state.ActiveUserData,
                          type: "diastolicBp",
                          graphType: "bar",
                          backgroundColor: "rgba(0, 164, 89, 0.2)",
                          borderColor: "rgba(0, 164, 89, 1)",
                        }}
                      />
                    ) : (
                      `Data Not Entered`
                    )}
                  </div>
                </div>
                <div className="graphs--item" id="graph6">
                  <div className="graph--flex">
                    {this.state.ActiveUserData.weight !== undefined ? (
                      <MyResponsiveGraph
                        data={{
                          records: this.state.ActiveUserData,
                          type: "insulin",
                          graphType: "bar",
                          backgroundColor: "rgba(255, 212, 204, 0.3)",
                          borderColor: "rgb(255, 97, 97)",
                        }}
                      />
                    ) : (
                      `Data Not Entered`
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
          <div className="grid-popup-overlay" id="ai-overlay">
            <div className="ai desktop-ai-popup" id="ai">
              <h6>Health Predictions</h6>
              <div className="ai__grid">
                <div className="ai__grid--item" id="heart">
                  <p>Heart Attack Prediction</p>
                  <div className="prediction--grid">
                    <img src={HeartIcon} alt="heart-icon" />
                    {this.state.heartAttackResult !== undefined ? (
                      <p>
                        {/* Heart Attack Prediction{" "} */}
                        {`${this.state.heartAttackResult}`}
                      </p>
                    ) : (
                      <p>Data not yet entered</p>
                    )}
                  </div>
                </div>
                <div className="ai__grid--item" id="diabetes">
                  <p>Diabetes Prediction</p>
                  <div className="prediction--grid">
                    <img src={DiabetesIcon} alt="diabetes-icon" />
                    {this.state.diabetesResult !== undefined ? (
                      <p>
                        {/* Diabetes Prediction{" "} */}
                        <span>{`${this.state.diabetesResult}`}</span>
                      </p>
                    ) : (
                      <p>Data not yet entered</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="add__patient__grid--item" id="add-patient-desktop">
            <p>Enter the email of the patietnt to be added.</p>
            <div className="addpatient__form">
              <form onSubmit={this.onSubmitPatientForm}>
                <div className="formInput">
                  <label required>
                    Email*<span id="result-desktop"></span>
                  </label>
                  <input
                    placeholder="xyz@example.com"
                    required
                    onChange={this.onChangeEmail}
                  />
                </div>
                <button type="submit">Submit</button>
              </form>
            </div>
          </div>
          <nav>
            <div className="doctorDashboard__floatNav">
              <div className="doctorDashboard__navgrid">
                <Link to="/">
                  <div className="doctorDashboard__navgrid--item">
                    <img src={MobileNavLogo} alt="logo" id="mobile-logo" />
                  </div>
                </Link>
                <div
                  className="doctorDashboard__navgrid--item"
                  onClick={this.toogleDashboard}
                >
                  <img
                    src={MobileDashboardIcon}
                    alt="dashboard"
                    id="mobile-dashboard"
                  />
                </div>
                <div
                  className="doctorDashboard__navgrid--item"
                  onClick={this.tooglePatientsList}
                >
                  <img
                    src={MobilePatientsIcon}
                    alt="patients"
                    id="patients-icon"
                  />
                </div>
                <div
                  className="doctorDashboard__navgrid--item"
                  onClick={this.toogleAddPatients}
                >
                  <img
                    src={AddPatientsIcon}
                    alt="add-patients"
                    id="add-patients"
                  />
                </div>

                <div
                  className="doctorDashboard__navgrid--item"
                  onClick={this.toogleAi}
                >
                  <img src={AiIcon} alt="ai-icon" id="ai-icon" />
                </div>
                <div className="doctorDashboard__navgrid--item">
                  <img
                    src={LogoutIcon}
                    alt="logout"
                    id="mobile-logout"
                    onClick={this.onLogout}
                  />
                </div>
              </div>
            </div>
          </nav>
        </div>
      );
    }
  }
}

export default DoctorDashboard;
