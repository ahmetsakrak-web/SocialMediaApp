const router = require("express").Router();
const User = require("../../models/user");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");

// Token alıp ile sayfaya user bilgilerini yolladık.
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//Login olup, kullanıcı bilgilerini Token halinde yolladık.
router.post(
  "/",
  [
    check("email", "Lütfen geçerli bir email giriniz").isEmail(),
    check("password", "Lütfen parolayı giriniz").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          errors: [
            {
              msg:
                "Şifreniz ve ya emailiniz yanlış.",
            },
          ],});
      }

      const isMatch = await bcrypt.compare(password, user.password);
      console.log(isMatch);
      if (!isMatch) {
        return res.status(400).json({
          errors: [
            {
              msg:
                "Şifreniz ve ya emailiniz yanlış.",
            },
          ],
        });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("SECRET"),
        { expiresIn: 360000 },
        (error, token) => {
          if (error) throw error;
          res.json({ token });
        }
      );
    } catch (error) {
      res.status(500).json("Server Error");
      console.log(error.message);
    }
  }
);

module.exports = router;
