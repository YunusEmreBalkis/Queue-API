const express = require("express")
const router = express.Router();
const {authenticateUser,authorizePermissions} = require("../middleware/authentication")

const placeController = require("../controllers/placeController")


router.post("/createplacerequest",authenticateUser,placeController.createPlaceRequest)
router.patch("/confirmplacerequest/:id",authenticateUser,authorizePermissions("admin"),placeController.confirmPlaceRequest)

router.get("/",authenticateUser,placeController.getAllPlaces)
router.patch("/updatePlace/:id",authenticateUser,placeController.updatePlace);
router.patch("/banUser/:id",authenticateUser,placeController.banUser);
router.delete("/deletePlace/:id",authenticateUser,placeController.deletePlace);


module.exports = router;