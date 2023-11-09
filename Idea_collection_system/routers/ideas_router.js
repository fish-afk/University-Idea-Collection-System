const ideaController = require("../controllers/ideas");
const authMiddleware = require("../middleware/auth_middleware");
const multerMiddleware = require("../middleware/multer_middleware");
const express = require("express");

const router = express.Router();

router.post(
	"/getallideas",
	authMiddleware.verifyJWT,
	ideaController.getAllIdeas,
);
router.put(
	"/uploadideadocument",
	multerMiddleware.upload.single("file"),
	ideaController.uploadIdeaDocument,
);
router.post(
	"/getideadocuments",
	authMiddleware.verifyJWT,
	ideaController.getIdeaDocuments,
);
router.get(
	"/getdocumentfile",
	ideaController.getDocumentFile,
);
router.post(
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

router.patch("/likepost", authMiddleware.verifyJWT, ideaController.likePost);

router.patch(
	"/dislikepost",
	authMiddleware.verifyJWT,
	ideaController.dislikePost,
);

router.patch(
	"/setclosuredates",
	authMiddleware.verifyJWT,
	ideaController.setNewClosureDates,
);

router.post('/getclosuredates', authMiddleware.verifyJWT, ideaController.getClosureDates)

module.exports = router;
