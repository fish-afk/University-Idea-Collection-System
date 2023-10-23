const departmentsController = require("../controllers/departments");
const authMiddleware = require("../middleware/auth_middleware");
const express = require("express");

const router = express.Router();

router.get(
	"/getallcomments",
	authMiddleware.verifyJWT,
	departmentsController.getAllDepartments,
);
router.get(
	"/getcommentbyid",
	authMiddleware.verifyJWT,
	departmentsController.getDepartmentById,
);
router.post(
	"/newcomment",
	authMiddleware.verifyJWT,
	departmentsController.newDepartment,
);
router.post(
	"/deletecomment",
	authMiddleware.verifyJWT,
	departmentsController.deleteDepartmentById,
);
router.patch(
	"updatecomment",
	authMiddleware.verifyJWT,
	departmentsController.updateDepartmentById,
);

module.exports = router;
