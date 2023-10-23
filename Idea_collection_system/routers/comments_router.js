const commentsController = require("../controllers/comments");
const authMiddleware = require("../middleware/auth_middleware");
const express = require("express");

const router = express.Router();

router.get(
	"/getallcomments",
	authMiddleware.verifyJWT,
	commentsController.getAllcomments,
);
router.get(
	"/getcommentbyid",
	authMiddleware.verifyJWT,
	commentsController.getCommentById,
);
router.post("/newcomment", authMiddleware.verifyJWT, commentsController.newCommentPost);
router.post(
	"/deletecomment",
	authMiddleware.verifyJWT,
	commentsController.deleteCommentById,
);
router.patch(
	"updatecomment",
	authMiddleware.verifyJWT,
	commentsController.updateCommentById,
);

module.exports = router;
