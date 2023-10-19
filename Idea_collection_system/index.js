const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const {connection}= require('./models/_mysql')

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
server.use(cors({origin: "*"}));

server.set("trust proxy", 1); // to trust loadbalancers like nginx so that, that ip doesn`t get limited.


const usersRouter = require("./routers/users_router")

server.use('/user', limiter, usersRouter)


server.get("/apiversion", limiter, (req, res) => {
	return res.send({
		status: "SUCCESS",
		data: process.env.API_VERSION ? "v" + process.env.API_VERSION : "v1.0.0"
	});
});

server.listen(process.env.PORT || 4455, () => {
	console.log("Server listening on port", process.env.PORT || 4455);
});
