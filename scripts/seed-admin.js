const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const email = "admin@gmail.com";
  const rawPassword = "12345678";

  console.log(`Connecting to database and looking for user: ${email}...`);

  // Delete existing admin user if present
  try {
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      await prisma.user.delete({
        where: { email },
      });
      console.log(`Existing admin user with ID ${existing.id} deleted successfully.`);
    } else {
      console.log("No existing admin user found.");
    }

    // Create new admin user with raw password
    const newUser = await prisma.user.create({
      data: {
        email,
        name: "Hospital Admin",
        passwordHash: rawPassword, // stored as raw password
        role: "admin",
      },
    });

    console.log(`New admin user seeded successfully!`);
    console.log(`Email: ${newUser.email}`);
    console.log(`Raw Password: ${newUser.passwordHash}`);
    console.log(`ID: ${newUser.id}`);
  } catch (error) {
    console.error("Error seeding admin user:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
