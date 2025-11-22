import User from "../models/User.js";

export const ensureDefaultAdmin = async () => {
  const email = process.env.ADMIN_EMAIL || "admin@spa.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const existing = await User.findOne({ email });
  if (existing) {
    return existing;
  }
  const user = new User({
    name: "Super Admin",
    email,
    password,
    role: "admin",
  });
  await user.save();
  console.log(`Seeded default admin (${email})`);
  return user;
};




