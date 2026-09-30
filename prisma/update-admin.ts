import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter }) as any;

async function main() {
  console.log("Updating admin user to super_admin...");

  const user = await prisma.user.update({
    where: { email: "admin@flexstudioo.dev" },
    data: { role: "super_admin" },
  });

  console.log(`Updated ${user.email} to role: ${user.role}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
