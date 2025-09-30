import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create users
  const password = await bcrypt.hash('Password123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password,
      name: 'Admin User',
      firstName: 'Admin',
      lastName: 'User',
      role: Role.ADMIN,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password,
      name: 'Regular User',
      firstName: 'Regular',
      lastName: 'User',
      role: Role.USER,
    },
  });

  // Create products (id autoincrement)
  const productsData = [
    {
      name: 'Wireless Headphones',
      description: 'Comfortable over-ear wireless headphones with noise cancellation.',
      price: 129.99,
      imageUrl: 'https://images.unsplash.com/photo-1518444075436-b59e02fbe8f8?q=80&w=1200&auto=format&fit=crop',
      category: 'Electronics',
    },
    {
      name: 'Smart Watch',
      description: 'Track your fitness and stay connected on the go.',
      price: 199.99,
      imageUrl: 'https://images.unsplash.com/photo-1519245659620-e859806a8d3f?q=80&w=1200&auto=format&fit=crop',
      category: 'Wearables',
    },
    {
      name: 'Coffee Maker',
      description: 'Brew the perfect cup with this compact coffee maker.',
      price: 59.99,
      imageUrl: 'https://images.unsplash.com/photo-1522556189639-b150b01b35a1?q=80&w=1200&auto=format&fit=crop',
      category: 'Home & Kitchen',
    },
  ];

  for (const p of productsData) {
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: p,
      });
    } else {
      await prisma.product.create({ data: p });
    }
  }

  console.log('Seeding done.');
  console.log('Login with:');
  console.log('  admin@example.com / Password123!');
  console.log('  user@example.com  / Password123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
