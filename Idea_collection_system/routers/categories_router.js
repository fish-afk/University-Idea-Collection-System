const categoriesController = require("../controllers/categories");
const authMiddleware = require("../middleware/auth_middleware");
const express = require("express");

const router = express.Router();

router.post(
	"/getallcategories",
	authMiddleware.verifyJWT,
	categoriesController.getAllCategories,
);
router.post(
	"/getcategorybyid",
	authMiddleware.verifyJWT,
	categoriesController.getCategoryById,
);
router.post(
	"/newcategory",
	authMiddleware.verifyJWT,
	categoriesController.newCategory,
);
router.delete(
	"/deletecategory",
	authMiddleware.verifyJWT,
	categoriesController.deleteCategoryById,
);
router.patch(
	"/updatecategory",
	authMiddleware.verifyJWT,
	categoriesController.updateCategoryById,
);

module.exports = router;
