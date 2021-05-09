const mongoose = require("mongoose");

var MedrecordSchema = new mongoose.Schema({
  age: { type: Number, default: 0 },
  height: [Object],
  weight: [Object],
  bmi: { type: Number, default: 0 },
  heartRate: [Object],
  spo2: [Object],


  /* Diabetes ai stuff */
  insulin: [Object],
  cholestrol: [Object],
  glucoseConc: [Object],
  diastolicBp: [Object],
  dpf:[Object],
  numPreg: [Object],
  dfs: [Object],

  /*Heart ai stuff*/
  systolicPressure: [Object],
  diastolicPressure: [Object],
});

module.exports = mongoose.model("Medrecord", MedrecordSchema);

/*

Diabetes prediction

https://predict-x-diabetes-pred-api.herokuapp.com/6/150/72/20/90/30.0/0.66/55

/<int:num_preg>/<int:glucose_conc>/<int:diastolic_bp>/<int:thickness>/<int:insulin>/<float:bmi>/<float:dpf>/<int:age>

Heart attack prediction

https://heart-attack-prediction-api.herokuapp.com/20/200/123/211/10/300/200

/<int:age>/<int:cholestrol>/<int:systolic_pressure>/<int:diastolic_pressure>/<int:bmi>/<int:heart_rate>/<int:glucose>

*/
