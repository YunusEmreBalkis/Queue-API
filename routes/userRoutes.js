const express = require("express")
const router = express.Router();
const {authenticateUser,authorizePermissions} = require("../middleware/authentication")

const userController = require("../controllers/userController")


router.route("/").get(authenticateUser,authorizePermissions("admin"),userController.getAllUsers)

router.route("/showMe").get(authenticateUser,userController.showCurrentUser);
router.route("/updateUser").patch(authenticateUser,userController.updateUser);
router.route("/:id/updateUserRole").patch(authenticateUser,authorizePermissions("admin"),userController.changeUserRole);
router.route("/updateUserPassword").patch(authenticateUser,userController.updateUserPassword);

router.route("/:id").get(authenticateUser,userController.getSingleUser);
router.route("/show/placeOfCurrentQueue").get(authenticateUser,userController.showPlaceOfCurrentQueue);

module.exports = router;