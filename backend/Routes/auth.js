const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const VerifyToken = require("../Middleware/Middleware");
const DosageBox = require("../Models/dosageBox.model");
const MedRecord = require("../Models/medrecord.model");
require("dotenv").config();
const nodemailer = require("nodemailer")

//Import patient and doctor models here
const Patient = require("../Models/patient.model");
const Doctor = require("../Models/doctor.model");

// Mailgun Configs.
const DOMAIN = "sandbox4ea677033b02482abf4b7fb4b4a12baf.mailgun.org";
const mailgun = require("mailgun-js");
mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });

// Signup route.
router.route("/signup").post((req, res) => {
  const { name, email, password, userType } = req.body;

  const token = jwt.sign(
    { name, password, email, userType },
    process.env.JWT_ACC_KEY,
    {
      expiresIn: "24h",
    }
  );
  // Checks if email already present as a patient.
  if (userType === "doctor") {
    Doctor.findOne({ email })
      .then((doctor) => {
        // return already present.
        if (doctor) {
          return res.json({
            success: false,
            message: "User already exists!",
            status: 404,
          });
        } else {
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "predictxnoreply@gmail.com",
              pass: process.env.SOMETHING,
            },
          });

          var mailOptions = {
            from: "predictxnoreply@gmail.com",
            to: email,
            subject: "Email Account Verification",
            html: `<h2>Please click on the link to activate:</h2>
                  <form name="submitForm" action="${process.env.CLIENT_URL}/email-verified/${token}">
                    <input type="hidden" name="token" value='value'>
                    <button type='submit' id="submit" name='activate' value='activate'>Activate</button>
                  </form>
                  <script>
                    document.getElementById("submit").addEventListener("click", function(event){
                      event.preventDefault()
                    });
                  </script>`,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              return res.status(500).json({
                success: false,
                message: `Error: ${error}, Internal server error`,
                status: 500,
              });
            } else {
              console.log("Email sent: " + info.response);
              return res.json({
                success: true,
                message: "Email Sent Successfully",
                status: 200,
              });
            }
          });
        }
      })
      .catch((err) =>
        res
          .status(500)
          .json({ success: false, message: `Error: ${err}`, status: 500 })
      );
  } else {
    console.log("patient");
    Patient.findOne({ email })
      .then((user) => {
        if (user) {
          return res.json({
            success: false,
            message: "User already exist!",
            status: 404,
          });
        } else {
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "predictxnoreply@gmail.com",
              pass: process.env.SOMETHING,
            },
          });

          var mailOptions = {
            from: "predictxnoreply@gmail.com",
            to: email,
            subject: "Email Account Verification",
            html: `<h2>Please click on the link to activate:</h2>
                  <form name="submitForm" action="${process.env.CLIENT_URL}/email-verified/${token}">
                    <input type="hidden" name="token" value='value'>
                    <button type='submit' id="submit" name='activate' value='activate'>Activate</button>
                  </form>
                  <script>
                    document.getElementById("submit").addEventListener("click", function(event){
                      event.preventDefault()
                    });
                  </script>`,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              return res.status(500).json({
                success: false,
                message: `Error: ${error}, Internal server error`,
                status: 500,
              });
            } else {
              console.log("Email sent: " + info.response);
              return res.json({
                success: true,
                message: "Email Sent Successfully",
                status: 200,
              });
            }
          });
        } // jwt token generation.
      })
      .catch((err) =>
        res.json({ success: false, message: `Error: ${err}`, status: 500 })
      );
  }
});

// Email Activation Route
router.route("/activate/:token").post((req, res) => {
  const token = req.params.token;

  console.log(`Token is ${token}`);

  if (token) {
    // Verify the token.
    jwt.verify(token, process.env.JWT_ACC_KEY, (err, decodedToken) => {
      if (err) {
        console.log(err);
        return res.json("Error: " + err);
      }
      const { name, email, userType } = decodedToken;
      let { password } = decodedToken;
      const saltRounds = 10; // Password encryption rounds.

      bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
          return res.json({
            success: false,
            message: `Error: ${error}, Internal server error`,
            status: 500,
          });
        }
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
            return res.json({
              success: false,
              message: `Error: ${error}, Internal server error`,
              status: 500,
            });
          }
          // Checks if user is a doctor.
          if (userType === "doctor") {
            Doctor.findOne({ email }).then((user) => {
              if (user) {
                return res.json({
                  success: false,
                  message: "User already exist!",
                  status: 400,
                });
              }

              password = hash;
              // Create a new user.
              const newDoctor = new Doctor({
                name,
                email,
                password,
                userType,
              });

              // Save the new user.
              newDoctor
                .save()
                .then(() => {
                  res.json({
                    success: true,
                    message: "user added!",
                    status: 201,
                  });
                })
                .catch((err) =>
                  res.json({
                    success: false,
                    message: `Error: ${err}`,
                    status: 500,
                  })
                );
            });
          } else {
            Patient.findOne({ email }).then((user) => {
              if (user) {
                return res.json({
                  success: false,
                  message: "User already exist!",
                  status: 400,
                });
              }

              // User is a patient.
              password = hash;

              // Create new user
              const newPatient = new Patient({
                name,
                email,
                password,
                userType,
                dosagebox_id: null,
                medrecord_id: null,
              });

              // Save the new user.
              newPatient
                .save()
                .then(() => {
                  const newMedicalRecord = new MedRecord({});

                  const newDosageBox = new DosageBox({
                    userId: newPatient._id,
                  });
                  // Before saving assign a dosage box to the patient.
                  newMedicalRecord.save().then(() => {
                    console.log(newMedicalRecord);
                    newDosageBox
                      .save()
                      .then(() => {
                        // get the just now created patient and update it.
                        Patient.findByIdAndUpdate(newPatient._id, {
                          dosagebox_id: newDosageBox._id,
                          medrecord_id: newMedicalRecord._id,
                        })
                          .then(() =>
                            console.log("Added dosage box and medrecord id to user's model")
                          )
                          .catch((err) => console.log({ Error: err }));
                        console.log("Dosage Box assigned for the user!");
                      })
                      .catch((err) =>
                        res.json({
                          success: false,
                          message: `Error: ${err}`,
                          status: 500,
                        })
                      );
                  });

                  res.json({
                    success: true,
                    message: "user added!",
                    status: 201,
                  });
                })
                .catch((err) =>
                  res.json({
                    success: false,
                    message: `Error: ${err}`,
                    status: 500,
                  })
                );
            });
          }
        });
      });
    });
  }
});

//Login route
router.route("/signin").post((req, res) => {
  const { email, password, userType } = req.body;
  const token = jwt.sign({ email, userType }, process.env.JWT_ACC_KEY);
  console.log(token);
  if (userType === "doctor") {
    Doctor.findOne({ email }).then((userData) => {
      if (!userData) {
        return res.json({
          success: false,
          message: "User Doesnt exit",
          status: 404,
        });
      }
      //comapare password
      bcrypt.compare(password, userData.password, (err, result) => {
        if (err) {
          return res.json({
            success: false,
            message: "Something went wrong....",
            status: 500,
          });
        } else if (result) {
          res.cookie("jwt-token", token);
          userData.password = "";
          return res.json({
            success: true,
            message: "Doctor authenticated",
            data: userData,
            token: token,
            status: 201,
          });
        } else {
          return res.json({
            success: false,
            message: "Wrong Password",
            status: 401,
          });
        }
      });
    });
  } else {
    Patient.findOne({ email }).then((userData) => {
      if (!userData) {
        return res.json({
          success: false,
          message: "User Doesnt exit",
          status: 404,
        });
      }
      bcrypt.compare(password, userData.password, (err, result) => {
        if (err) {
          return res.json({
            success: false,
            message: "Something went wrong....",
            status: 500,
          });
        } else if (result) {
          userData.password = "";
          return res.json({
            success: true,
            message: "Patient authenticated",
            data: userData,
            token: token,
            status: 201,
          });
        } else {
          return res.json({
            success: false,
            message: "Wrong Password",
            status: 401,
          });
        }
      });
    });
  }
});

// Signout Route.
router.route("/singout").post((req, res) => {
  res.clearCookie("jwt-token");
  return res.json({
    success: true,
    message: "User Signed Out!",
    status: 200,
  });
});

// forgot password route
router.route("/forgotpassword").post((req, res) => {
  const { email, userType } = req.body;
  console.log(req.body);
  console.log("forgot password reached");
  const token = jwt.sign({ email, userType }, process.env.JWT_ACC_KEY, {
    expiresIn: "20m",
  });
  if (userType === "doctor") {
    Doctor.findOne({ email })
      .then((doctor) => {
        // doctor is available
        if (doctor) {
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "predictxnoreply@gmail.com",
              pass: process.env.SOMETHING,
            },
          });

          var mailOptions = {
            from: "predictxnoreply@gmail.com",
            to: email,
            subject: "Reset PredictX User Account Password",
            html: `<h2>Please click on the link to activate:</h2>
                  <form name="submitForm" method="POST" action="${process.env.CLIENT_URL}/change-password/${token}">
                    <input type="hidden" name="token" value='value'>
                    <button type='submit' id="submit" name='activate' value='activate'>Change Password</button>
                  </form>
                  <script>
                    document.getElementById("submit").addEventListener("click", function(event){
                      event.preventDefault()
                    });
                  </script>`,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              return res.status(500).json({
                success: false,
                message: `Error: ${error}`,
                status: 500,
              });
            } else {
              console.log("Email sent: " + info.response);
              return res.json({
                success: true,
                message: "Email Sent Successfully",
                status: 200,
              });
            }
          });
        } else {
          res.json({
            success: false,
            message: "User with this email id dosent exist!",
            status: 404,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({
          success: false,
          message: `Error: ${err}`,
          status: 500,
        });
      });
  } else {
    Patient.findOne({ email })
      .then((patient) => {
        if (patient) {
          // add the mail data
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "predictxnoreply@gmail.com",
              pass: process.env.SOMETHING,
            },
          });

          var mailOptions = {
            from: "predictxnoreply@gmail.com",
            to: email,
            subject: "Reset PredictX User Account Password",
            html: `<h2>Please click on the link to activate:</h2>
                  <form name="submitForm" method="POST" action="${process.env.CLIENT_URL}/change-password/${token}">
                    <input type="hidden" name="token" value='value'>
                    <button type='submit' id="submit" name='activate' value='activate'>Change Password</button>
                  </form>
                  <script>
                    document.getElementById("submit").addEventListener("click", function(event){
                      event.preventDefault()
                    });
                  </script>`,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              return res.status(500).json({
                success: false,
                message: `Error: ${error}`,
                status: 500,
              });
            } else {
              console.log("Email sent: " + info.response);
              return res.json({
                success: true,
                message: "Email Sent Successfully",
                status: 200,
              });
            }
          });
        } else {
          res.json({
            success: false,
            message: "User with this email id dosent exist!",
            status: 404,
          });
        }
      })
      .catch((err) =>
        res.json({
          success: false,
          message: `Error: ${err}`,
          status: 500,
        })
      );
  }
});

//changepassowrd
router.route("/changepassword/:token").post((req, res) => {
  let token = req.params.token;
  let { password } = req.body;
  console.log(req.body);
  if (token) {
    // verify the token
    jwt.verify(token, process.env.JWT_ACC_KEY, (err, decodedToken) => {
      if (err) {
        return res.json({
          success: false,
          message: `Error: ${err}`,
          status: 500,
        });
      }
      const { email, userType } = decodedToken;
      const saltRounds = 10; // Password encryption rounds.

      // Encrypt the password.
      bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
          return res.json({
            success: false,
            message: "" + err,
            status: 500,
          });
        }
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
            console.log(err);
            return res.json({
              success: false,
              message: "" + err,
              status: 500,
            });
          }
          password = hash;
          // Checks if user is a doctor.
          if (userType === "doctor") {
            Doctor.findOneAndUpdate(
              { email },
              { password },
              null,
              (err, data) => {
                if (err) {
                  return res.json({ error: err });
                } else {
                  return res.json({
                    success: true,
                    message: "password changed",
                    status: 201,
                  });
                }
              }
            );
          } else {
            // else its a patient.
            Patient.findOneAndUpdate(
              { email },
              { password },
              null,
              (err, data) => {
                if (err) {
                  return res.json({
                    success: false,
                    message: `Error: ${err}`,
                    status: 500,
                  });
                } else {
                  return res.json({
                    success: true,
                    message: "password changed",
                    status: 201,
                  });
                }
              }
            );
          }
        });
      });
    });
  }
});



module.exports = router;
