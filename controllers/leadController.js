import Lead from "../models/Lead.js";
import Spa from "../models/Spa.js";

const normalizeSpaId = (spaId = "") =>
  spaId
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-");

const normalizeServices = (services) => {
  if (Array.isArray(services)) {
    return services.map((svc) => (svc || "").toString().trim()).filter(Boolean);
  }

  if (typeof services === "string" && services.trim()) {
    return services
      .split(",")
      .map((svc) => svc.trim())
      .filter(Boolean);
  }

  return [];
};

export const createLead = async (req, res, next) => {
  try {
    const { spaId, name, phone, services, message = "", source = "chatbot" } =
      req.body;

    if (!spaId || !name || !phone) {
      return res.status(400).json({
        code: "LEAD_VALIDATION_ERROR",
        message: "spaId, name, and phone are required",
      });
    }

    const normalizedSpaId = normalizeSpaId(spaId);
    const spa =
      (await Spa.findOne({ spaId })) ||
      (normalizedSpaId !== spaId
        ? await Spa.findOne({ spaId: normalizedSpaId })
        : null);

    if (!spa || !spa.isActive) {
      return res.status(400).json({
        code: "SPA_NOT_AVAILABLE",
        message: "Spa not available or inactive",
      });
    }

    const lead = await Lead.create({
      spa: spa._id,
      spaId: spa.spaId,
      spaName: spa.spaName,
      name: name.trim(),
      phone: phone.trim(),
      services: normalizeServices(services),
      message: message?.toString().trim() || "-",
      source,
    });

    spa.totalLeads += 1;
    await spa.save();

    res.status(201).json(lead);
  } catch (error) {
    next(error);
  }
};

export const getLeads = async (req, res, next) => {
  try {
    const { spaId, from, to } = req.query;
    const query = {};
    if (spaId) {
      const normalizedSpaId = normalizeSpaId(spaId);
      query.spaId =
        normalizedSpaId === spaId
          ? spaId
          : { $in: [spaId, normalizedSpaId].filter(Boolean) };
    }
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }
    const leads = await Lead.find(query).sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    next(error);
  }
};

