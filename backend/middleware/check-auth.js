const jwt = require('jsonwebtoken');



module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // verigy token
    jwt.verify(token, 'my-secret-hash-string');
    next();
  } catch(err) {
    res.status(401).json({ message: "Auth failed!" });
  }
}