import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { shouldBeAdmin, shouldBeLoggedIn } from "../controllers/test.controller.js";

const testRouter = express.Router();

testRouter.get('/should-be-logged-in', verifyToken, shouldBeLoggedIn);

testRouter.get('/should-be-admin', shouldBeAdmin);

export default testRouter;