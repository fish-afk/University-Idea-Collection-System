const statsController = require("../controllers/stats");
const authMiddleware = require("../middleware/auth_middleware");
const express = require("express");

const router = express.Router();

router.post('/getallstats', authMiddleware.verifyJWT, statsController.getAllStats);

module.exports = router;

