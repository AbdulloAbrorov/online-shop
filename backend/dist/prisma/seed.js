"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
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
            role: client_1.Role.ADMIN,
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
            role: client_1.Role.USER,
        },
    });
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
        }
        else {
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
//# sourceMappingURL=seed.js.map