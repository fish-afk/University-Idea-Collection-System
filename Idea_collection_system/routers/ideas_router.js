const ideaController = require("../controllers/ideas");
const express = require("express");

const router = express.Router();

router.get("/getallideas", ideaController.getAllIdeas);
router.get("/getideabyid", ideaController.getIdeaById);
router.post("/newidea", ideaController.newIdeaPost);
router.post("/deleteidea", ideaController.deleteIdeaById);
router.patch("updateidea", ideaController.updateIdeaByID)


module.exports = router;
