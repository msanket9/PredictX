const router = require("express").Router();
const Patient = require("../Models/patient.model");
const Doctor = require("../Models/doctor.model");
const Medrecord = require("../Models/medrecord.model");
const DosageBox = require("../Models/dosageBox.model");
const VerifyToken = require("../Middleware/Middleware");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

function createMed(record) {
  var dateTime = new Date();
  dateTimeString = String(dateTime).split(" ");
  date =
    dateTimeString[2] +
    "/" +
    String(dateTime.getMonth() + 1) +
    "/" +
    dateTimeString[3];
  return {
    //generate new id
    _id: shortid.generate(),
    value: record,
    date: date,
  };
}

//initial route to create medrecords and store medrecord id to patient
router.route("/addmedrecord").post(VerifyToken, (req, res) => {
  var { medname, val } = req.body;
  const { email } = req.userData; //req.userData is the decoded token from middleware we stored in req.userData check middleware

  Patient.findOne({ email })
    .then((data) => {
      Medrecord.findById({ _id: data.medrecord_id })
        .then((medData) => {
          if (medname === "age") {
            medData[medname] = val;
          } else {
            medData[medname].push(createMed(val));
          }

          if (medData.height.length !== 0 && medData.weight.length !== 0) {
            let bmi = (
              (medData.weight[medData.weight.length - 1].value /
                (medData.height[medData.height.length - 1].value *
                  medData.height[medData.height.length - 1].value)) *
              10000
            ).toFixed(2);

            medData["bmi"] = bmi;
          } else {
            medData["bmi"] = 0;
          }

          medData
            .save()
            .then((data) => {
              res.json({ success: true, data: data, status: 200 });
            })
            .catch((err) => {
              res.json({
                success: false,
                message: `Error: ${err}`,
                status: 500,
              });
            });
        })
        .catch((err) => {
          res.json({ success: false, message: `Error: ${err}`, status: 500 });
        });
    })
    .catch((err) => {
      res.json({ success: false, message: `Error: ${err}`, status: 500 });
    });
});

//edit medrecord if patient already consisit a medrecord_id
router.route("/editmedrecord").post(VerifyToken, (req, res) => {
  const { email } = req.userData;
  const { medname, val, id } = req.body;

  // Get the patient.
  Patient.findOne({ email })
    .then((data) => {
      // Get the patient's medical records model.
      Medrecord.findById({ _id: data.medrecord_id })
        .then((medData) => {
          if (medname === "age") {
            medData[medname] = val;
          } else {
            medData[medname] = medData[medname].map((data) => {
              if (data._id === id) {
                data.value = val;
              }
              return data;
            });
          }
          if (medData.height.length !== 0 && medData.weight.length !== 0) {
            let bmi = (
              (medData.weight[medData.weight.length - 1].value /
                (medData.height[medData.height.length - 1].value *
                  medData.height[medData.height.length - 1].value)) *
              10000
            ).toFixed(2);

            medData["bmi"] = bmi;
          } else {
            medData["bmi"] = 0;
          }
          Medrecord.findByIdAndUpdate({ _id: data.medrecord_id }, medData)
            .then((data) => {
              res.json({
                success: true,
                message: "Med records data updated",
                status: 200,
              });
            })
            .catch((err) =>
              res.json({ success: false, message: `Error: ${err}`, staus: 500 })
            );
        })
        .catch((err) =>
          res.json({ success: false, message: `Error: ${err}`, staus: 500 })
        );
    })

    .catch((err) =>
      res.json({ success: false, message: `Error: ${err}`, staus: 500 })
    );
});
//delete specific medrecord
//route example /deletemedrecord/specific/hieght/nsYHwsni
router.route("/deletemedrecord/specific").post(VerifyToken, (req, res) => {
  const { specificmed, id } = req.body;
  const { email } = req.userData;
  Patient.findOne({ email })
    .then((data) => {
      //if medrecord_if present
      if (data.medrecord_id) {
        Medrecord.findById({ _id: data.medrecord_id })
          .then((medData) => {
            var idExist = false;
            var newmedData = medData[specificmed].filter((record) => {
              if (record._id === id) idExist = true;
              //returns array of new medDatas
              return record._id != id;
            });
            if (idExist) {
              //sets newarray to specificmed
              //example medData[height]= new height array
              if (medData.height.length !== 0 && medData.weight.length !== 0) {
                let bmi = (
                  (medData.weight[medData.weight.length - 1].value /
                    (medData.height[medData.height.length - 1].value *
                      medData.height[medData.height.length - 1].value)) *
                  10000
                ).toFixed(2);

                medData["bmi"] = bmi;
              } else {
                medData["bmi"] = 0;
              }
              medData[specificmed] = newmedData;
              medData
                .save()
                .then(() => {
                  res.json({ status: true, message: "record Deleted" });
                })
                .catch((err) =>
                  res.status(500).json({
                    success: false,
                    message: `Error: ${err}`,
                  })
                );
            } else {
              return res
                .status(404)
                .json({ status: false, message: "id not found" });
            }
          })
          .catch((err) =>
            res.json({ success: false, message: `Error: ${err}`, staus: 500 })
          );
      }
    })
    .catch((err) =>
      res.json({ success: false, message: `Error: ${err}`, staus: 500 })
    );
});
//gets medrecord of patient.
router.route("/medrecord/:id").get(VerifyToken, (req, res) => {
  const _id = req.params.id;
  if (_id) {
    Medrecord.findById(_id)
      .then((data) => {
        res.json({
          success: true,
          message: "User medical records found!",
          data: data,
          status: 302, // status 302 is used when u find the requested data.
        });
      })
      .catch((err) =>
        res.json({ success: false, message: `Error: ${err}`, status: 500 })
      );
  }
});
//route to delete medrecord
router.route("/deletemedreord").delete(VerifyToken, (req, res) => {
  const { email } = req.userData;
  Patient.findOne({ email })
    .then((patientData) => {
      //medrecord id present in patient
      if (patientData.medrecord_id) {
        //delete medrecord from db
        Medrecord.findByIdAndDelete({ _id: patientData.medrecord_id })
          .then(() => {
            Patient.findOneAndUpdate(
              { email },
              //unset medrecord id in patient
              { $unset: { medrecord_id: "" } }
            )
              .then((data) => {
                res.json({
                  success: true,
                  message: "med record deleted",
                  status: 200,
                });
              })
              .catch((err) =>
                res.json({
                  success: false,
                  message: `Error: ${err}`,
                  status: 500,
                })
              );
          })
          .catch((err) =>
            res.json({ success: false, message: `Error: ${err}`, status: 500 })
          );
      } else {
        return res.json({
          success: false,
          message: "med id not found",
          status: 404,
        });
      }
    })
    .catch((err) =>
      res.json({ success: false, message: `Error: ${err}`, status: 500 })
    );
});
// Adds a new dosage to the dosage box.
router.route("/adddosage").post(VerifyToken, (req, res) => {
  const { med, time } = req.body;
  const { email } = req.userData;

  var dosage = {
    med,
    time,
  };

  // Find the current patient.
  Patient.findOne({ email }).then((patient) => {
    var box_id = patient.dosagebox_id;
    var present = false;

    // Find the assigned dosage box.
    DosageBox.findOne({ _id: box_id })
      .then((box) => {
        var meds = box.meds;
        // Checks if already present.
        for (let item in meds) {
          if (dosage.med === meds[item].med) {
            present = true;
          }
        }
        // if present then don't add! 400 -> bad request.
        !present
          ? meds.push(dosage)
          : res.json({
              success: false,
              message: "Dosage Already Exist!",
              status: 400,
            });

        // Update the dosage box.
        DosageBox.findByIdAndUpdate(box_id, { meds: meds })
          .then(() =>
            res.json({
              success: true,
              message: "Meds were successfully added!",
              status: 201,
            })
          )
          .catch((err) =>
            res.json({ success: false, message: `Error: ${err}`, status: 500 })
          );
      })
      .catch((err) =>
        res.json({ success: false, message: `Error: ${err}`, status: 500 })
      );
  });
});

// Deletes certain dosage added by the patient.
router.route("/deletedosage/:name").post(VerifyToken, (req, res) => {
  // get the med to be removed.
  const med = req.params.name;
  const { email } = req.userData;

  // Find the patient.
  Patient.findOne({ email })
    .then((patient) => {
      // Get the dosage box id.
      const box = patient.dosagebox_id;
      // Delete the med from the dosage box.
      DosageBox.findByIdAndUpdate(box, {
        $pull: { meds: { med: med } },
      })
        .then(() =>
          res.json({
            success: true,
            message: "Dosage Successfully removed",
            status: 200,
          })
        )
        .catch((err) =>
          res.json({ success: false, message: `Error: ${err}`, status: 500 })
        );
    })
    .catch((err) =>
      res.json({ success: false, message: `Error: ${err}`, status: 500 })
    );
});

// gets all the current set dosages in the dosage box.
router.route("/mydosage/:id").get(VerifyToken, (req, res) => {
  const dosagebox_id = req.params.id;

  // Find the patient.
  DosageBox.findById(dosagebox_id)
    .then((data) =>
      res.json({
        success: true,
        message: "User Dosage records found!",
        data: data.meds,
        status: 302,
      })
    )
    .catch((err) =>
      res.json({ success: false, message: `Error: ${err}`, status: 500 })
    );
});
//edit dosage value
router.route("/editdosage").post(VerifyToken, (req, res) => {
  const { email } = req.userData;
  const { med, renameMed, time } = req.body;
  Patient.findOne({ email })
    .then((data) => {
      //gets dosageBox id from patient
      DosageBox.findById({ _id: data.dosagebox_id })
        .then((dosageData) => {
          let newMedsData = []; //new array to stored updated meds
          var doseExist = false;
          dosageData.meds.forEach((medData, index) => {
            //checks if med exist if exist update new data
            if (medData.med === med) {
              //if user wants to rename med name
              if (renameMed) medData.med = renameMed;
              //updates new med data
              medData.time = time;
              doseExist = true;
            }
            //stores all data in new array to pass in findByIdandUpdate parameters
            newMedsData[index] = medData;
          });
          //if does exists update data
          if (doseExist) {
            DosageBox.findByIdAndUpdate(
              { _id: dosageData._id },
              //new med data
              { meds: newMedsData },
              { new: true },
              (err, data) => {
                if (err)
                  return res.json({
                    success: false,
                    message: `Error: ${err}`,
                    status: 404,
                  });
                res.json({
                  success: true,
                  message: "dosage updated",
                  data: data,
                  status: 201,
                });
              }
            );
          } else {
            return res.json({
              success: false,
              message: "Dose Doesnt exist",
              status: 404,
            });
          }
        })
        .catch((err) =>
          res.json({
            success: false,
            message: `Error ${err}`,
            status: 500,
          })
        );
    })
    .catch((err) =>
      res.json({
        success: false,
        message: `Error: ${err}`,
        status: 500,
      })
    );
});
//delete doctor from patient data
router.route("/deletedoctor").post(VerifyToken, (req, res) => {
  const { _id } = req.body;
  const { email } = req.userData;
  Patient.findOne({ email })
    .then((patientData) => {
      var doc_id_exist;
      var new_doc_ids = patientData.doctors.filter((id) => {
        //check if doctor id exists in doctors array of patient
        if (_id == id) {
          doc_id_exist = id;
        }
        //returns new array after deleting doctor id
        return id !== _id;
      });
      //check if doctor id exists
      if (doc_id_exist) {
        Doctor.findById({ _id: doc_id_exist })
          .then((docData) => {
            var patient_id_exist;
            var new_patient_ids = docData.patients.filter((pat_id) => {
              //check if patient id exists in patient array of doctor
              if (patientData._id == pat_id) {
                patient_id_exist = pat_id;
              }
              //returns new array after deleting patient id
              return pat_id != patientData._id;
            });
            if (patient_id_exist) {
              Patient.findOneAndUpdate(
                { email },
                //updates doctors array with new array
                { doctors: new_doc_ids }
              )
                .then(() => {
                  Doctor.findByIdAndUpdate(
                    { _id: docData._id },
                    //updates patient array with new array
                    { patients: new_patient_ids }
                  )
                    .then(() => {
                      res.json({
                        success: true,
                        message: "doctor deleted",
                        status: 200,
                      });
                    })
                    .catch((err) =>
                      res.json({
                        success: false,
                        message: `Error: ${err}`,
                        status: 500,
                      })
                    );
                })
                .catch((err) => {
                  res.json({
                    success: false,
                    message: `Error: ${err}`,
                    status: 500,
                  });
                });
            } else {
              res.json({
                success: false,
                message: "patient id not found",
                status: 404,
              });
            }
          })
          .catch((err) =>
            res.json({ success: false, message: `Error: ${err}`, status: 500 })
          );
      } else {
        res.json({ success: false, message: "doc id not found", status: 500 });
      }
    })
    .catch((err) =>
      res.json({ success: false, message: `Error: ${err}`, status: 500 })
    );
});
//Deactivate User route
router.route("/deactivate").delete(VerifyToken, (req, res) => {
  const { password } = req.body;
  const { email } = req.userData;
  //check is password variable consist any value
  if (password) {
    Patient.findOne({ email })
      .then((data) => {
        //compare password
        bcrypt.compare(password, data.password, (err, result) => {
          if (err) {
            return res.json({
              success: false,
              message: "Something went wrong....",
              status: 500,
            });
            //if passowrd is correct
          } else if (result) {
            Patient.findByIdAndDelete({ _id: data._id })
              .then(() => {
                //check if patient has medrecord_id if present delete the medrecord from db
                if (data.medrecord_id) {
                  //delete the medrecord from db
                  Medrecord.findByIdAndDelete({
                    _id: data.medrecord_id,
                  }).catch((err) =>
                    res.status(400).json({ success: false, Error: err })
                  );
                }
                //check if patient has dosagebox_id if present delete the dosagerecord from db
                if (data.dosagebox_id) {
                  //delete the dosagesrecord from db

                  DosageBox.findByIdAndDelete({
                    _id: data.dosagebox_id,
                  }).catch((err) =>
                    res.status(400).json({ success: false, Error: err })
                  );
                }
                res
                  .status(200)
                  .json({ success: true, message: "Account Deleted" });
              })
              .catch((err) =>
                res.status(400).json({ success: false, Error: err })
              );
          } else {
            return res.status(401).json({
              success: false,
              message: "Wrong Password",
            });
          }
        });
      })
      .catch((err) => res.status(400).json({ success: false, Error: err }));
  } else {
    res.status(400).json({ success: false, message: "Password Field empty" });
  }
});

router.route("/check-patient/:token").get(VerifyToken, (req, res) => {
  const token = req.params.token;

  // Verify the token.
  jwt.verify(token, process.env.JWT_ACC_KEY, (err, decodedToken) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: err, status: 500 });
    }
    const { email } = decodedToken;
    Patient.findOne({ email }).then((user) => {
      if (user) {
        if (user.userType === "patient") {
          return res.json({
            success: true,
            message: "User is patient",
            status: 200,
          });
        } else {
          return res.json({
            success: false,
            message: "User is doctor",
            status: 404,
          });
        }
      }
    });
  });
});

router.route("/getpatient").get(VerifyToken, (req, res) => {
  const { email } = req.userData;
  Patient.findOne({ email })
    .then((data) => {
      data.password = "";
      return res.json({
        success: true,
        data: data,
        status: 200,
      });
    })
    .catch((err) => res.json({ success: false, error: err }));
});
module.exports = router;
