const express = require("express");
const router = express.Router();

const {register,login,logout} = require("../controllers/authController")
const {validateSchema} = require("../middleware/validate")
const {registerValidation,loginValidation} = require("../validations/auth")

router.post("/login",validateSchema(loginValidation),login);
router.post("/register",validateSchema(registerValidation),register);
router.get("/logout",logout);

module.exports = router;