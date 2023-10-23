const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const security = require("./middleware/security_middleware");

require("dotenv").config();
const server = express();

const limiter = rateLimit({
	windowMs: 3 * 60 * 1000, // 3 minutes
	max: 150, // Limit each IP to 150 requests
	message: { message: "Too many requests, please try again later" },
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

server.use(express.json({ limit: "10mb" })); // max request size 10 mb
server.use(cors({ origin: "*" }));
server.use(security.securityMiddleware);

server.set("trust proxy", 1); // to trust loadbalancers like nginx so that, that ip doesn`t get limited.

const usersRouter = require("./routers/users_router");
const ideasRouter = require("./routers/ideas_router");
const commentsRouter = require('./routers/comments_router');
const categoriesRouter = require('./routers/categories_router')
const departmentsRouter = require('./routers/departments_router')

server.use("/users", limiter, usersRouter);
server.use("/ideas", limiter, ideasRouter);
server.use('/comments', limiter, commentsRouter)
server.use("/categories", limiter, categoriesRouter);
server.use("/departments", limiter, departmentsRouter);

server.get("/apiversion", limiter, (req, res) => {
	return res.send({
		status: "SUCCESS",
		data: process.env.API_VERSION ? "v" + process.env.API_VERSION : "v1.0.0",
	});
});

server.listen(process.env.PORT || 4455, () => {
	console.log("Server listening on port", process.env.PORT || 4455);
});
