import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "../database";
import { users } from "../database/schema";
import { eq } from "drizzle-orm";

export async function ensureAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@accessvirtualjobs.com";
  const adminPass = process.env.ADMIN_PASSWORD || "admin123!";

  const existing = await db.query.users.findFirst({
    where: eq(users.email, adminEmail),
  });

  if (!existing) {
    const hashed = await bcrypt.hash(adminPass, 10);
    await db.insert(users).values({
      email: adminEmail,
      name: "Admin User",
      password: hashed,
      role: "admin",
    });
    console.log(`✅ Admin user created: ${adminEmail}`);
  } else {
    console.log(`⚠️ Admin user already exists: ${adminEmail}`);
  }
}

if (require.main === module) {
  ensureAdminUser().then(() => process.exit(0));
}
