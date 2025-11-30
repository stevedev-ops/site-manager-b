import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);

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
            role: UserRole.SUPER_ADMIN,
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
