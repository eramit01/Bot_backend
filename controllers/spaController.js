import mongoose from "mongoose";
import Spa from "../models/Spa.js";

const normalizeSpaId = (spaId = "") =>
  spaId
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-");

const getSpaCollection = () => {
  if (!mongoose.connection?.db) {
    throw new Error("Database connection not ready");
  }
  return mongoose.connection.db.collection("spas");
};

// Debug endpoint - bypass mongoose model issues
export const debugSpa = async (_req, res) => {
  try {
    const collection = getSpaCollection();
    const allSpas = await collection
      .find({}, { projection: { spaId: 1, spaName: 1, name: 1, isActive: 1 } })
      .toArray();
    const demoSpa = await collection.findOne({ spaId: "demo-spa" });

    console.log("[DEBUG] Direct DB query - spas found:", allSpas.length);
    console.log(
      "[DEBUG] Spas:",
      allSpas.map((s) => ({ spaId: s.spaId, spaName: s.spaName || s.name }))
    );

    res.json({
      success: true,
      totalSpas: allSpas.length,
      spas: allSpas,
      demoSpaFound: !!demoSpa,
      demoSpa: demoSpa || null,
      database: mongoose.connection?.db?.databaseName,
    });
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
};

export const getSpaConfig = async (req, res, next) => {
  try {
    const { spaId } = req.params;
    const trimmedSpaId = spaId?.toString().trim();

    console.log("[getSpaConfig] Request for spaId:", trimmedSpaId);

    if (!trimmedSpaId) {
      return res.status(400).json({
        code: "SPA_ID_MISSING",
        message: "Spa ID is required",
      });
    }

    const collection = getSpaCollection();
    const normalizedSpaId = normalizeSpaId(trimmedSpaId);
    const spaIdCandidates = [
      trimmedSpaId,
      normalizedSpaId,
      trimmedSpaId.replace(/_/g, "-"),
      trimmedSpaId.replace(/-/g, "_"),
    ]
      .map((id) => id?.toString().trim())
      .filter(Boolean);
    const uniqueSpaIds = [...new Set(spaIdCandidates)];

    let spa = null;
    for (const candidate of uniqueSpaIds) {
      spa =
        (await collection.findOne({ spaId: candidate })) ||
        (await collection.findOne({ originalSpaId: candidate }));
      if (spa) {
        break;
      }
    }

    console.log("[getSpaConfig] Direct DB query result:", !!spa, {
      requestedSpaId: trimmedSpaId,
      tried: uniqueSpaIds,
    });
    if (spa) {
      console.log("[getSpaConfig] Spa found:", {
        spaId: spa.spaId,
        spaName: spa.spaName || spa.name,
        isActive: spa.isActive,
      });
    }

    if (!spa) {
      console.warn("[getSpaConfig] Spa not found for spaId:", trimmedSpaId);
      return res.status(404).json({
        code: "SPA_NOT_FOUND",
        message: `No spa found for ID "${trimmedSpaId}"`,
        spaId: trimmedSpaId,
        tried: uniqueSpaIds,
      });
    }

    if (!spa.isActive) {
      return res.status(403).json({
        code: "SPA_INACTIVE",
        message: `Spa "${spa.spaId}" is currently inactive`,
        spaId: spa.spaId,
      });
    }

    const config = { ...spa };
    if (!config.botImage || config.botImage === "") {
      config.botImage = null;
    }

    res.json(config);
  } catch (error) {
    console.error("[getSpaConfig] Error:", error);
    next(error);
  }
};

export const getSpas = async (_req, res, next) => {
  try {
    const spas = await Spa.find().sort({ createdAt: -1 });
    res.json(spas);
  } catch (error) {
    next(error);
  }
};

export const createSpa = async (req, res, next) => {
  try {
    const sanitizedBody = { ...req.body };
    const rawSpaId = sanitizedBody.spaId;
    const normalizedSpaId = normalizeSpaId(rawSpaId);

    sanitizedBody.spaId = normalizedSpaId;
    sanitizedBody.originalSpaId = rawSpaId?.toString().trim();

    if (!sanitizedBody.spaId) {
      return res.status(400).json({
        code: "SPA_ID_REQUIRED",
        message: "Spa ID is required",
      });
    }
    if (
      sanitizedBody.botImage === "" ||
      (sanitizedBody.botImage && sanitizedBody.botImage.trim() === "")
    ) {
      sanitizedBody.botImage = null;
    }
    const spa = await Spa.create(sanitizedBody);
    res.status(201).json(spa);
  } catch (error) {
    next(error);
  }
};

export const updateSpa = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.spaId) {
      const normalizedSpaId = normalizeSpaId(sanitizedBody.spaId);
      if (!normalizedSpaId) {
        return res.status(400).json({
          code: "SPA_ID_REQUIRED",
          message: "Spa ID cannot be empty",
        });
      }
      sanitizedBody.originalSpaId =
        sanitizedBody.originalSpaId ||
        sanitizedBody.spaId?.toString().trim() ||
        undefined;
      sanitizedBody.spaId = normalizedSpaId;
    }
    if (
      sanitizedBody.botImage === "" ||
      (sanitizedBody.botImage && sanitizedBody.botImage.trim() === "")
    ) {
      sanitizedBody.botImage = null;
    }
    const spa = await Spa.findByIdAndUpdate(id, sanitizedBody, {
      new: true,
      runValidators: true,
    });
    if (!spa) {
      return res.status(404).json({ message: "Spa not found" });
    }
    res.json(spa);
  } catch (error) {
    next(error);
  }
};

export const deleteSpa = async (req, res, next) => {
  try {
    const { id } = req.params;
    const spa = await Spa.findByIdAndDelete(id);
    if (!spa) {
      return res.status(404).json({ message: "Spa not found" });
    }
    res.json({ message: "Spa deleted" });
  } catch (error) {
    next(error);
  }
};

