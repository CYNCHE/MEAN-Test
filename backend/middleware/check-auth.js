const jwt = require('jsonwebtoken');



module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // verigy token and return a decoded token
    const decodedToken = jwt.verify(token, 'my-secret-hash-string');
    // add additional data and field to our request body
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    // pass the req to next middleware
    next();
  } catch(err) {
    res.status(401).json({ message: "Auth failed!" });
  }
}
