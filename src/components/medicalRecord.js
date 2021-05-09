import React, { useState } from "react";
import cookie from "js-cookie";
import axios from "axios";
import { MyResponsiveGraph } from "./Graph";
import CakeIcon from "@material-ui/icons/Cake";
import HeightIcon from "../assets/height.svg";
import WeightIcon from "../assets/weight.svg";
import BmiIcon from "../assets/bmi.svg";
import WelcomeImg from "../assets/welcome.svg";
import { Notifications } from "./Patientdashboard";
export default class MedicalRecords extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      medrecord_id: props.medrecord_id,
      ActiveUserData: "loading",
      loading: true,
      notifytoggle: false,
      doctorAddNotifi: props.doctorAddNotifi,
      token: props.token,
      name: props.name,
      setnav: props.setnav,
    };
  }
  componentDidMount() {
    const token = cookie.get("jwt-token");
    axios
      .get(
        `https://predictx-backend.herokuapp.com/patient/medrecord/${this.state.medrecord_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        if (res.data.success === true) {
          this.setState({ ActiveUserData: res.data.data });
          this.setState({ loading: false });
        }
      })
      .catch((err) => console.log(err));
  }
  render() {
    return !this.state.loading ? (
      this.state.ActiveUserData.height.length === 0 ||
      this.state.ActiveUserData.weight.length === 0 ||
      this.state.ActiveUserData.age === undefined ? (
        <div className="no_meddata">
          <img src={WelcomeImg} />
          <h3>Welcome {this.state.name}</h3>
          <p>Get started by adding your Medical Records</p>
          <p>
            Note:Please Add your basic details like Height,weight,age to see
            your dashboard
          </p>

          <a onClick={this.state.setnav}>Get Started</a>
        </div>
      ) : (
        <div className="p_dashboard__dosage">
          <div className="p_dashboard__component_title">
            <div className="title_p">
              <h4>Dashboard</h4>
              <p>Hi, {this.state.name} &#128075;</p>
              <p>Its good to see you keeping track of your medical records</p>
            </div>
            <div>
              <a
                onClick={() =>
                  this.setState({ notifytoggle: !this.state.notifytoggle })
                }
              >
                {" "}
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 34 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="17" cy="17" r="17" fill="#00A459" />
                  <path
                    d="M12.5667 8.62051L11.1324 7.15385C8.72518 9.03077 7.14042 11.9231 7 15.2051H9.00602C9.15647 12.4872 10.5206 10.1077 12.5667 8.62051V8.62051ZM24.994 15.2051H27C26.8495 11.9231 25.2648 9.03077 22.8676 7.15385L21.4433 8.62051C23.4694 10.1077 24.8435 12.4872 24.994 15.2051ZM23.0181 15.7179C23.0181 12.5692 21.3731 9.93333 18.5045 9.2359V8.53846C18.5045 7.68718 17.8325 7 17 7C16.1675 7 15.4955 7.68718 15.4955 8.53846V9.2359C12.6169 9.93333 10.9819 12.559 10.9819 15.7179V20.8462L8.97593 22.8974V23.9231H25.0241V22.8974L23.0181 20.8462V15.7179ZM17 27C17.1404 27 17.2708 26.9897 17.4012 26.959C18.0532 26.8154 18.5848 26.3641 18.8455 25.7487C18.9458 25.5026 18.996 25.2359 18.996 24.9487H14.984C14.994 26.0769 15.8867 27 17 27Z"
                    fill="white"
                  />
                </svg>{" "}
              </a>
              {this.state.notifytoggle ? (
                <Notifications token={this.state.token} />
              ) : (
                ""
              )}
            </div>
          </div>
          {this.state.loading ? (
            <div>loading....</div>
          ) : (
            <div className="p_dashboard__dashboard_section">
              <div className="p_dashboard_basic_cards">
                <div className="p_dash_card p_dash_age">
                  <CakeIcon
                    fontSize="large"
                    style={{ margin: "10px", color: "#FDBA56" }}
                  />{" "}
                  <div>
                    <h3>
                      {this.state.ActiveUserData === "loading"
                        ? "loading"
                        : `${this.state.ActiveUserData.age}`}{" "}
                      y/o
                    </h3>
                    <p>Age</p>
                  </div>
                </div>
                <div className="p_dash_card  p_dash_weight">
                  <img src={WeightIcon} alt="weight" />
                  <div>
                    <h3>
                      {this.state.ActiveUserData === "loading"
                        ? "loading"
                        : `${
                            this.state.ActiveUserData.weight[
                              this.state.ActiveUserData.weight.length - 1
                            ].value
                          }`}
                      Kg
                    </h3>
                    <p>Current Weight</p>
                  </div>
                </div>
                <div className="p_dash_card  p_dash_height">
                  <img src={HeightIcon} alt="weight" />
                  <div>
                    <h3>
                      {(
                        this.state.ActiveUserData === "loading"
                          ? "loading"
                          : this.state.ActiveUserData.height.length == 0
                      )
                        ? "Empty"
                        : `${
                            this.state.ActiveUserData.height[
                              this.state.ActiveUserData.height.length - 1
                            ].value
                          }`}
                      cm
                    </h3>
                    <p>Current Height</p>
                  </div>
                </div>
                <div className="p_dash_card  p_dash_bmi">
                  <img src={BmiIcon} alt="weight" />
                  <div>
                    <h3>
                      {this.state.ActiveUserData === "loading"
                        ? "loading"
                        : `${this.state.ActiveUserData.bmi}`}
                    </h3>
                    <p>Current Bmi</p>
                  </div>
                </div>
              </div>
              <div className="p_dashboard_graphs">
                <div className="p_dashboard_graph">
                  {this.state.ActiveUserData === "loading" ? (
                    <h4>Empty</h4>
                  ) : (
                    <MyResponsiveGraph
                      data={{
                        records: this.state.ActiveUserData,
                        type: "weight",
                        graphType: "bar",
                        backgroundColor: "rgba(130, 163, 208, 0.23)",
                        borderColor: "#82A3D0",
                      }}
                    />
                  )}
                </div>
                <div className="p_dashboard_graph">
                  {this.state.ActiveUserData === "loading" ? (
                    <h4>Empty</h4>
                  ) : (
                    <MyResponsiveGraph
                      data={{
                        records: this.state.ActiveUserData,
                        type: "height",
                        graphType: "bar",
                        backgroundColor: "rgba(116, 192, 255, 0.23)",
                        borderColor: "#74c0ff",
                      }}
                    />
                  )}
                </div>
                <div className="p_dashboard_graph">
                  {this.state.ActiveUserData === "loading" ? (
                    <h4>Empty</h4>
                  ) : (
                    <MyResponsiveGraph
                      data={{
                        records: this.state.ActiveUserData,
                        type: "heartRate",
                        graphType: "line",
                        backgroundColor: "rgba(255, 212, 204, 0.3)",
                        borderColor: "rgb(255, 97, 97)",
                      }}
                    />
                  )}
                </div>
                <div className="p_dashboard_graph">
                  {this.state.ActiveUserData === "loading" ? (
                    <h4>Empty</h4>
                  ) : (
                    <MyResponsiveGraph
                      data={{
                        records: this.state.ActiveUserData,
                        type: "spo2",
                        graphType: "line",
                        backgroundColor: "rgba(9, 158, 176, 0.2)",
                        borderColor: "rgba(9, 158, 176, 1)",
                      }}
                    />
                  )}
                </div>{" "}
                <div className="p_dashboard_graph">
                  {this.state.ActiveUserData === "loading" ? (
                    <h4>Empty</h4>
                  ) : (
                    <MyResponsiveGraph
                      data={{
                        records: this.state.ActiveUserData,
                        type: "insulin",
                        graphType: "bar",
                        backgroundColor: "rgba(0, 164, 89, 0.2)",
                        borderColor: "rgba(0, 164, 89, 1)",
                      }}
                    />
                  )}
                </div>
                <div className="p_dashboard_graph">
                  {this.state.ActiveUserData === "loading" ? (
                    <h4>Empty</h4>
                  ) : (
                    <MyResponsiveGraph
                      data={{
                        records: this.state.ActiveUserData,
                        type: "cholestrol",
                        graphType: "line",

                        backgroundColor: "rgba(253, 186, 86,.2)",
                        borderColor: "rgba(253, 186, 86, 1)",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )
    ) : (
      "loading..."
    );
  }
}
