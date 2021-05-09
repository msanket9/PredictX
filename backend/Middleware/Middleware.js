const jwt = require("jsonwebtoken");
//the token which we passed through headers is store in req.headers.authorization
module.exports = (req, res, next) => {
  try {
    //we split it because req.headers.authorization gives us string "bearer <token>"
    //we remove only the token part by spliting them and get token
    //token is now stored in token var
    const token = req.headers.authorization.split(" ")[1];

    //here we check if tokenn is correct or not
    const decode = jwt.verify(token, process.env.JWT_ACC_KEY);
    req.userData = decode;
    //if token is valid middleware return backs true to app.get("/users") route

    //and respose from app.get('/users') route gets printted
    //check back server.js app.get('/users')  for further comments
    next();
  } catch (error) {

    return res.status(403).json({
      //if token is false we return this reponse
      message: "Auth Failed",
    });
  }
};
