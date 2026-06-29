import "dotenv/config";
import { db } from "./connection.js";
import { users, expenses } from "./schema.js";

const seed = async () => {
  console.log("🌱 Starting database seed....");
  try {
    console.log("Clearing old data");

    await db.delete(expenses);
    await db.delete(users);

    console.log("Creating demo user");

    const [demouser] = await db
      .insert(users)
      .values({
        name: "user 1",
        email: "user1@gmail.com",
        password: "user@1",
      })
      .returning();

    if (!demouser) {
      throw new Error("Failed to create demo user");
    }

    await db.insert(expenses).values([
      {
        name: "Blue Tokai Coffee",
        category: "Food & Drinks",
        amount: "240.00",
        userId: demouser.id,
        createdAt: new Date("2026-06-15T10:00:00Z"),
      },
      {
        name: "Subway Meal",
        category: "Food & Drinks",
        amount: "350.00",
        userId: demouser.id,
        createdAt: new Date("2026-06-28T14:30:00Z"),
      },
      {
        name: "Gym Membership",
        category: "Health & Fitness",
        amount: "2500.00",
        userId: demouser.id,
        createdAt: new Date("2026-05-01T09:00:00Z"),
      },
    ]);

    console.log("✅ DB seeded successfully");
    console.log("User Credentials");
    console.log(`email: ${demouser.email}`);
  } catch (e) {
    console.error("❌ Seed failed:", e);
    process.exit(0);
  }
};

export default seed;
