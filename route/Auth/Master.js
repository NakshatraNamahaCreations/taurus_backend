const express = require("express");
const router = express.Router();
const TeamController = require("../../controller/Auth/Master");

router.post("/addteammember", TeamController.addTeamMember);
router.post("/loginteammember", TeamController.loginTeamMember);
router.get("/getteammember/:id", TeamController.getTeammember);
router.get("/getallteammembers", TeamController.getAllTeammember);

router.put("/updateteammember/:id", TeamController.updateMember);
router.delete("/deleteteammember/:id", TeamController.deleteTeammember);

module.exports = router;
