import { Router } from "express";
import {
  createSpa,
  debugSpa,
  deleteSpa,
  getSpaConfig,
  getSpas,
  updateSpa,
} from "../controllers/spaController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// Debug endpoint (no auth required)
router.get("/debug", debugSpa);

router.get("/config/:spaId", getSpaConfig);

router.use(authenticate);
router.get("/", getSpas);
router.post("/", createSpa);
router.put("/:id", updateSpa);
router.delete("/:id", deleteSpa);

export default router;

