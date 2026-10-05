import { Router, type IRouter } from "express";
import healthRouter from "./health";
import blogRouter from "./blog";
import enquiriesRouter from "./enquiries";

const router: IRouter = Router();

router.use(healthRouter);
router.use(blogRouter);
router.use(enquiriesRouter);

export default router;
