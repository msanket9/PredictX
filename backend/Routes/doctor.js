const router = require("express").Router();
const Doctor = require("../Models/doctor.model");
const Patient = require("../Models/patient.model");
const VerifyToken = require("../Middleware/Middleware");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Route will sent notifications to the patients.
router.route("/addpatientnotifiaction").post(VerifyToken, (req, res) => {
  // this is patients email
  const { email } = req.body;

  // doctors email from middleware
  const DocEmail = req.userData["email"];

  let notifi = []; // Array that will be updated

  var present = false;

  Patient.findOne({ email }).then((user) => {
    if (!user) {
      return res.json({
        success: false,
        message: "User dosent exist!",
        status: 404,
      });
    }

    // Get all the earlier present notifications.
    for (let item in user.doctorAddNotifi) {
      notifi.push(user.doctorAddNotifi[item]);
    }
    Doctor.findOne({ email: DocEmail }).then((doctor) => {
      // Get the doctor's id and push into the array with the route.

      // Check if the patient has already subscribed.
      doctor.patients.forEach((element) => {
        if (element == user._id) {
          present = true;
        }
      });

      // Checks if the patient has already a notification pending.
      user.doctorAddNotifi.forEach((element) => {
        if (element == `/${doctor._id}`) {
          present = true;
        }
      });

      if (!present) {
        notifi.push(`/adddoctor/${doctor._id}`);
      } else {
        res.status(404).json({
          success: false,
          message:
            "Notification is either already send to the patient or the patient has already subscribed!",
          status: 404,
        });
        return;
      }

      let replacement = {
        doctorAddNotifi: notifi,
      };

      // Update the array in patient model.
      Patient.findOneAndUpdate({ email }, replacement)
        .then(() => {
          res.status(200).json({
            success: true,
            message: "Notification Sent successfully!",
            status: 200,
          });
        })
        .catch((err) =>
          res
            .status(500)
            .json({ success: false, message: `Error: ${err}`, status: 500 })
        ); // 500 is internal server error.
    });
  });
});

//router to get all patients of doctor
router.route("/mypatients").get(VerifyToken, (req, res) => {
  const { email } = req.userData;
  // get the doctor.
  Doctor.findOne({ email })
    .then((doctorData) => {
      // get patients that have subscribed to the doctor.
      let ids = doctorData.patients;
      // gets the patients using the ids.
      Patient.find({ _id: { $in: ids } })
        .then((data) => {
          // remove the password.
          for (item in data) {
            data[item].password = null;
          }
          res.json({
            success: true,
            message: "Patients were successfully found!",
            data: data,
            status: 302,
          }); //status 302 is used when you find something.
        })
        .catch((err) =>
          res
            .status(500)
            .json({ success: false, message: `Error: ${err}`, status: 500 })
        );
    })
    .catch((err) =>
      res
        .status(500)
        .json({ success: false, message: `Error: ${err}`, status: 500 })
    );
});

//adds doctor id to patient
router.route("/adddoctor").post(VerifyToken, (req, res) => {
  let { docid } = req.body;
  const { email } = req.userData;
  Patient.findOne({ email }) //gets patient data
    .then((patientdata) => {
      if (!patientdata)
        return res.json({
          success: false,
          message: "Error getting patient data",
          status: 404,
        });
      var docexist = false;
      //check if doctor id already exists in [doctors] array of patient
      for (let docs of patientdata.doctors) {
        if (docs === docid) docexist = true;
      }
      //if doc id doest exist check if patient id is already exists in [patients] array of doctor
      if (!docexist) {
        Doctor.findById({ _id: docid })
          .then((docData) => {
            if (!docData)
              return res.json({
                success: false,
                message: "No doctor found",
                status: 404,
              });

            var patient_exist = false;
            //check if patient id is already exists in [patients] array of doctor
            for (let pid of docData.patients) {
              if (pid === patientdata._id) patient_exist = true;
            }
            // if patient id doesnt exist in doctor and doctor id doesnt exist in patient we go ahead and store ids
            if (!patient_exist) {
              //appends doctor id
              Patient.findOneAndUpdate(
                { email },
                {
                  $push: { doctors: docid },
                  $pull: { doctorAddNotifi: `/adddoctor/${docid}` },
                },
                { new: true },
                (err, data) => {
                  if (err)
                    return res.json({
                      success: false,
                      message: `Error: ${err}`,
                      status: 500,
                    });
                  data.password = "";

                  //appends patient id
                  Doctor.findByIdAndUpdate(
                    { _id: docid },
                    { $push: { patients: data._id } },
                    (err) => {
                      if (err) return res.json({ Error: err });
                      res.json({
                        success: true,
                        data: data,
                        message:
                          "docid added to patient and patient id added to doc",
                        status: 201,
                      });
                    }
                  );
                }
              );
            } else {
              res.json({
                success: false,
                message: "patient id already exists",
                status: 400,
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
      } else {
        res.json({
          success: false,
          message: "docid already exists",
          status: 400,
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
});
router.route("/clearnotifi").post(VerifyToken, (req, res) => {
  const { id } = req.body;
  const { email } = req.userData;
  if (id) {
    Patient.findOneAndUpdate(
      { email },
      { $pull: { doctorAddNotifi: `/adddoctor/${id}` } },
      { new: true },
      (err, data) => {
        if (err)
          return res.json({
            success: false,
            message: `Error: ${err}`,
            status: 500,
          });
        data.password = "";
        res.json({ success: true, data: data, status: 200 });
      }
    );
  } else {
    res.json({ success: false, data: "invalid id", status: 400 });
  }
});
//delete patient from doc data
router.route("/deletepatient/:id").post(VerifyToken, (req, res) => {
  const _id = req.params.id;
  const { email } = req.userData;
  Doctor.findOne({ email })
    .then((docData) => {
      var patient_id_exist;
      var new_patient_ids = docData.patients.filter((id) => {
        //check if patient id exists in patient array of doctor
        if (id === _id) {
          patient_id_exist = id;
        }
        //returns new array after deleting patient id
        return id !== _id;
      });
      //check if patient id exists
      if (patient_id_exist) {
        Patient.findById({ _id: patient_id_exist })
          .then((patientData) => {
            var doctor_id_exist;
            var new_doctor_ids = patientData.doctors.filter((doc_id) => {
              //check if doctor id exists in doctor array of patient
              if (docData._id == doc_id) {
                doctor_id_exist = doc_id;
              }
              //returns new array after deleting doctor id
              return doc_id != docData._id;
            });
            if (doctor_id_exist) {
              Doctor.findOneAndUpdate(
                { email },
                //updates patient array with new array
                { patients: new_patient_ids }
              )
                .then(() => {
                  Patient.findByIdAndUpdate(
                    { _id: patientData._id },
                    //updates doctors array with new array
                    { doctors: new_doctor_ids }
                  )
                    .then(() => {
                      res.status(200).json({
                        success: true,
                        message: "Patient deleted",
                        status: 200,
                      });
                    })
                    .catch((err) =>
                      res.status(500).json({
                        success: false,
                        message: `Error: ${err}`,
                        status: 500,
                      })
                    );
                })
                .catch((err) =>
                  res.status(500).json({
                    success: false,
                    message: `Error: ${err}`,
                    status: 500,
                  })
                );
            } else {
              res.status(404).json({
                success: false,
                message: "doc id not found",
                status: 404,
              });
            }
          })
          .catch((err) =>
            res.status(500).json({
              success: false,
              message: `Error: ${err}`,
              status: 500,
            })
          );
      } else {
        res.status(404).json({
          success: false,
          message: "Patient id not found",
          status: 404,
        });
      }
    })
    .catch((err) =>
      res.status(500).json({
        success: false,
        message: `Error: ${err}`,
        status: 500,
      })
    );
});
router.route("/:id").get(VerifyToken, (req, res) => {
  const { id } = req.params;
  Doctor.findById({ _id: id }).then((data) => {
    res.json({ success: true, data: { name: data.name } });
  });
});

router.route("/deactivate").post(VerifyToken, (req, res) => {
  const { email } = req.userData;
  const { password } = req.body;

  console.log(req.userData);

  // Find the user.
  if (password) {
    Doctor.findOne({ email })
      .then((doctor) => {
        bcrypt.compare(password, doctor.password, (err, result) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: `Error: ${err}`,
              status: 500,
            });
          }
          // Check if password matches.
          else if (result && doctor) {
            // if yes then delete the user.
            Doctor.findByIdAndDelete(doctor._id)
              .then(() => {
                res.status(200).json({
                  success: true,
                  message: "Doctor Successfully Deleted",
                  status: 200,
                });
              })
              .catch((err) => {
                res.status(500).json({
                  success: false,
                  message: `Error: ${err}`,
                  status: 500,
                });
              });
          } else {
            // wrong password.
            return res.status(404).json({
              success: false,
              message: "Email or Password is Wrong!",
              status: 404,
            });
          }
        });
      })
      .catch((err) =>
        res.status(500).json({
          success: false,
          message: `Error: ${err}`,
          status: 500,
        })
      );
  } else {
    return res.status(404).json({
      success: false,
      message: "Password not found!",
      status: 404,
    });
  }
});

router.route("/check-doctor/:token").get(VerifyToken, (req, res) => {
  const token = req.params.token;

  // Verify the token.
  jwt.verify(token, process.env.JWT_ACC_KEY, (err, decodedToken) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: err, status: 500 });
    }
    const { email } = decodedToken;
    Doctor.findOne({ email }).then((user) => {
      if (user) {
        console.log(user.userType)
        if (user.userType === "doctor") {
          return res.json({
            success: true,
            message: "User is doctor",
            status: 200,
          });
        } else {
          return res.json({
            success: false,
            message: "User is patient",
            status: 404,
          });
        }
      }
    });
  });
});


module.exports = router;
