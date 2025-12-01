"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const hashedPassword = await bcryptjs_1.default.hash('password123', 10);
    // Check if organization exists first
    let org = await prisma.organization.findFirst({
        where: { name: 'Default Organization' }
    });
    if (!org) {
        org = await prisma.organization.create({
            data: {
                name: 'Default Organization',
            }
        });
        console.log('Created Organization:', org);
    }
    const superAdmin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            name: 'Super Admin',
            password: hashedPassword,
            role: client_1.UserRole.SUPER_ADMIN,
            organization: {
                connect: { id: org.id }
            }
        },
    });
    console.log({ superAdmin });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map