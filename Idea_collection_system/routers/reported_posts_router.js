const reportedPostsControlerr = require("../controllers/reported_posts");
const authMiddleware = require("../middleware/auth_middleware");
const express = require("express");

const router = express.Router();

router.post(
	"/getallreports",
	authMiddleware.verifyJWT,
	reportedPostsControlerr.getAllReportedPosts,
);
router.post(
	"/getreportbyid",
	authMiddleware.verifyJWT,
	reportedPostsControlerr.getReportedPostById,
);
router.post(
	"/getreportbyideaid",
	authMiddleware.verifyJWT,
	reportedPostsControlerr.getReportedPostByIdeaId,
);
router.post(
	"/newreport",
	authMiddleware.verifyJWT,
	reportedPostsControlerr.newReportedPost,
);
router.post(
	"/deletereport",
	authMiddleware.verifyJWT,
	reportedPostsControlerr.deleteReportedPostById,
);
router.patch(
	"updatereport",
	authMiddleware.verifyJWT,
	reportedPostsControlerr.updateReportedPostById,
);

module.exports = router;
