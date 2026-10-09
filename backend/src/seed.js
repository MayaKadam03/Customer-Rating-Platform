const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with realistic data...');

  // Clear existing data in correct relational order
  await prisma.rating.deleteMany({});
  await prisma.store.deleteMany({});
  await prisma.user.deleteMany({});

  const defaultPassword = await bcrypt.hash('AdminPass123!', 10);

  // 1. System Administrator
  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator Mayank Sharma', // 36 chars (20-60)
      email: 'admin@roxiler.com',
      password: defaultPassword,
      address: 'Tower B, DLF Cyber City, Phase 2, Gurugram, Haryana 122002',
      role: 'SYSTEM_ADMIN'
    }
  });

  // 2. Store Owners
  const owner1 = await prisma.user.create({
    data: {
      name: 'Store Owner Rajesh Kumar Verma', // 32 chars
      email: 'rajesh.verma@store.com',
      password: defaultPassword,
      address: 'FC Road, Deccan Gymkhana, Pune, Maharashtra 411004',
      role: 'STORE_OWNER'
    }
  });

  const owner2 = await prisma.user.create({
    data: {
      name: 'Store Owner Ananya Deshmukh', // 28 chars
      email: 'ananya.deshmukh@store.com',
      password: defaultPassword,
      address: 'Indiranagar 100 Feet Road, Bengaluru, Karnataka 560038',
      role: 'STORE_OWNER'
    }
  });

  // 3. Normal Users
  const user1 = await prisma.user.create({
    data: {
      name: 'Aarav Vikramaditya Singhania', // 29 chars
      email: 'aarav.singhania@gmail.com',
      password: defaultPassword,
      address: 'Flat 402, Sea Crest Apartments, Worli, Mumbai, Maharashtra 400018',
      role: 'NORMAL_USER'
    }
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Priya Suryakant Murthy', // 22 chars
      email: 'priya.murthy@gmail.com',
      password: defaultPassword,
      address: '12th Main Road, Jayanagar 4th Block, Bengaluru, Karnataka 560041',
      role: 'NORMAL_USER'
    }
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Rohan Chandrasekhar Iyer', // 24 chars
      email: 'rohan.iyer@gmail.com',
      password: defaultPassword,
      address: 'B-304, Green Acres Township, Kothrud, Pune, Maharashtra 411038',
      role: 'NORMAL_USER'
    }
  });

  const user4 = await prisma.user.create({
    data: {
      name: 'Sneha Shrikant Kulkarni', // 23 chars
      email: 'sneha.kulkarni@gmail.com',
      password: defaultPassword,
      address: 'H.No. 45, Jubilee Hills, Road No. 36, Hyderabad, Telangana 500033',
      role: 'NORMAL_USER'
    }
  });

  // 4. Stores
  const store1 = await prisma.store.create({
    data: {
      name: 'Reliance Digital Electronics Hub', // 32 chars
      email: 'reliancedigital@store.com',
      address: 'FC Road, Deccan Gymkhana, Pune, Maharashtra 411004',
      ownerId: owner1.id
    }
  });

  const store2 = await prisma.store.create({
    data: {
      name: 'Crossword Bookstore & Cafe', // 26 chars
      email: 'crossword.indiranagar@store.com',
      address: 'Indiranagar 100 Feet Road, Bengaluru, Karnataka 560038',
      ownerId: owner2.id
    }
  });

  const store3 = await prisma.store.create({
    data: {
      name: 'Vijay Sales Appliances Store', // 28 chars
      email: 'vijaysales.connaught@store.com',
      address: 'Block M, Connaught Place, New Delhi 110001'
    }
  });

  const store4 = await prisma.store.create({
    data: {
      name: 'FabIndia Handicrafts Outlet', // 27 chars
      email: 'fabindia.parkstreet@store.com',
      address: 'Park Street, Near Commercial Plaza, Kolkata, West Bengal 700016'
    }
  });

  // 5. Initial Ratings
  await prisma.rating.createMany({
    data: [
      { userId: user1.id, storeId: store1.id, value: 5 },
      { userId: user2.id, storeId: store1.id, value: 4 },
      { userId: user3.id, storeId: store1.id, value: 4 },
      { userId: user1.id, storeId: store2.id, value: 4 },
      { userId: user2.id, storeId: store2.id, value: 5 },
      { userId: user4.id, storeId: store2.id, value: 5 },
      { userId: user3.id, storeId: store3.id, value: 3 },
      { userId: user4.id, storeId: store4.id, value: 5 }
    ]
  });

  console.log('Database seeded successfully with Indian names!');
  console.log('--- DEFAULT DEMO CREDENTIALS ---');
  console.log('Password for all users: AdminPass123!');
  console.log('System Admin: admin@roxiler.com');
  console.log('Store Owner 1: rajesh.verma@store.com');
  console.log('Store Owner 2: ananya.deshmukh@store.com');
  console.log('Normal User 1: aarav.singhania@gmail.com');
  console.log('Normal User 2: priya.murthy@gmail.com');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
