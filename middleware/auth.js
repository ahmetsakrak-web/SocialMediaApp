const jwt = require("jsonwebtoken");
const config = require("config");

// Token'in varlığını ve geçerliliğini kontrol ediyor.
// Şartlar uygunsa Token'i decode edip requeste user olarak ekliyor.
module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "Jeton yok, Giriş izni reddedildi." });
  }

  try {
    const decoded = jwt.verify(token, config.get("SECRET"));
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Jetonun Geçerli değil." });
  }
};
