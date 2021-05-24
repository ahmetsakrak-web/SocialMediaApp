const router = require("express").Router();
const User = require("../../models/user");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const config = require("config");

//Üye olup, kullanıcı bilgilerini Token halinde yolladık.
router.post(
  "/",
  [
    check("name", "Boş bırakılamaz").not().isEmpty(),
    check("email", "Lütfen geçerli bir email giriniz").isEmail(),
    check("password", "Şifre 6 karakterden küçük olamaz").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Bu emaile ait bir üyelik bulunmakta" }] });
      }

      const avatar = gravatar.url({
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new User({ name, email, password, avatar });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

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
