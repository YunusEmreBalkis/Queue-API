const express = require("express")
const router = express.Router();
const {authenticateUser,authorizePermissions} = require("../middleware/authentication")

const queueController = require("../controllers/queueController");

router.post("/createqueue",authenticateUser,authorizePermissions("owner","worker"),queueController.createQueue)
router.get("/",authenticateUser,authorizePermissions("admin"),queueController.getAllQueues)
router.get("/:id",authenticateUser,queueController.getSingleQueue);
router.get("/show/currentWaitersCount/:id",authenticateUser,authorizePermissions("owner","worker"),queueController.showWaitersCount)
router.patch("/makeQueueEmpty/:id",authenticateUser,queueController.makeQueueEmpty);
router.delete("/deletePlace/:placeId/:queueId",authenticateUser,queueController.deleteQueue);
router.patch("/addUserToQueue/:id",authenticateUser,authorizePermissions("owner","worker"),queueController.addUserToQueue);
router.patch("/removeUserFromQueue/:id",authenticateUser,authorizePermissions("owner","worker"),queueController.removeUserFromQueue);




module.exports = router;