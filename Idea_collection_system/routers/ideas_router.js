const ideaController = require("../controllers/ideas");
const authMiddleware = require("../middleware/auth_middleware");
const express = require("express");

const router = express.Router();

router.get(
	"/getallideas",
	authMiddleware.verifyJWT,
	ideaController.getAllIdeas,
);
router.get(
	"/getideabyid",
	authMiddleware.verifyJWT,
	ideaController.getIdeaById,
);
router.post("/newidea", authMiddleware.verifyJWT, ideaController.newIdeaPost);
router.post(
	"/deleteidea",
	authMiddleware.verifyJWT,
	ideaController.deleteIdeaById,
);
router.patch(
	"updateidea",
	authMiddleware.verifyJWT,
	ideaController.updateIdeaByID,
);

module.exports = router;
