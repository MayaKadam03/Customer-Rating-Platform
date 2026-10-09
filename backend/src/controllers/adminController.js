const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { validateName, validateEmail, validatePassword, validateAddress } = require('../utils/validation');

const prisma = new PrismaClient();

// Get Admin Dashboard Stats
async function getDashboardStats(req, res) {
  try {
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalRatings = await prisma.rating.count();

    return res.json({
      totalUsers,
      totalStores,
      totalRatings
    });
  } catch (error) {
    console.error('Admin Dashboard Stats Error:', error);
    return res.status(500).json({ error: 'Failed to fetch dashboard statistics.' });
  }
}

// Add New User (Admin, Normal, or Store Owner)
async function addUser(req, res) {
  try {
    const { name, email, password, address, role, storeId } = req.body;

    const nameErr = validateName(name);
    if (nameErr) return res.status(400).json({ error: nameErr });

    const emailErr = validateEmail(email);
    if (emailErr) return res.status(400).json({ error: emailErr });

    const passwordErr = validatePassword(password);
    if (passwordErr) return res.status(400).json({ error: passwordErr });

    const addressErr = validateAddress(address);
    if (addressErr) return res.status(400).json({ error: addressErr });

    const allowedRoles = ['SYSTEM_ADMIN', 'NORMAL_USER', 'STORE_OWNER'];
    const userRole = role && allowedRoles.includes(role) ? role : 'NORMAL_USER';

    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email is already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        address: address.trim(),
        role: userRole
      }
    });

    // If assigned to a store as owner
    if (userRole === 'STORE_OWNER' && storeId) {
      await prisma.store.update({
        where: { id: storeId },
        data: { ownerId: newUser.id }
      });
    }

    return res.status(201).json({
      message: 'User created successfully!',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        address: newUser.address,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Add User Error:', error);
    return res.status(500).json({ error: 'Server error creating user.' });
  }
}

// Add New Store
async function addStore(req, res) {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Store name is required.' });
    }
    const emailErr = validateEmail(email);
    if (emailErr) return res.status(400).json({ error: emailErr });

    const addressErr = validateAddress(address);
    if (addressErr) return res.status(400).json({ error: addressErr });

    const existingStore = await prisma.store.findUnique({
      where: { email: email.trim().toLowerCase() }
    });
    if (existingStore) {
      return res.status(400).json({ error: 'Store email is already registered.' });
    }

    // Check if ownerId exists and is a store owner
    if (ownerId) {
      const ownerUser = await prisma.user.findUnique({ where: { id: ownerId } });
      if (!ownerUser) {
        return res.status(400).json({ error: 'Specified store owner user does not exist.' });
      }
    }

    const newStore = await prisma.store.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        address: address.trim(),
        ownerId: ownerId || null
      }
    });

    return res.status(201).json({
      message: 'Store added successfully!',
      store: newStore
    });
  } catch (error) {
    console.error('Add Store Error:', error);
    return res.status(500).json({ error: 'Server error creating store.' });
  }
}

// List all users with filtering, sorting, and rating display for Store Owners
async function getUsers(req, res) {
  try {
    const { name, email, address, role, sortBy = 'name', sortOrder = 'asc' } = req.query;

    const where = {};
    if (name) where.name = { contains: name.trim() };
    if (email) where.email = { contains: email.trim() };
    if (address) where.address = { contains: address.trim() };
    if (role && role !== 'ALL') where.role = role;

    const validSortFields = ['name', 'email', 'address', 'role', 'createdAt'];
    const orderByField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const orderDirection = sortOrder.toLowerCase() === 'desc' ? 'desc' : 'asc';

    const users = await prisma.user.findMany({
      where,
      orderBy: { [orderByField]: orderDirection },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        ownedStore: {
          select: {
            id: true,
            name: true,
            ratings: {
              select: { value: true }
            }
          }
        }
      }
    });

    // Format response to calculate rating if user is a Store Owner
    const formattedUsers = users.map(user => {
      let ratingInfo = null;
      if (user.role === 'STORE_OWNER' && user.ownedStore) {
        const ratings = user.ownedStore.ratings || [];
        const total = ratings.reduce((acc, r) => acc + r.value, 0);
        const avgRating = ratings.length > 0 ? (total / ratings.length).toFixed(1) : 'No ratings';
        ratingInfo = {
          storeName: user.ownedStore.name,
          averageRating: avgRating,
          totalRatingsCount: ratings.length
        };
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
        storeRatingInfo: ratingInfo
      };
    });

    return res.json({ users: formattedUsers });
  } catch (error) {
    console.error('Get Users Error:', error);
    return res.status(500).json({ error: 'Server error listing users.' });
  }
}

// Get single user details (including store owner rating if applicable)
async function getUserDetails(req, res) {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        ownedStore: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            ratings: {
              select: { value: true, createdAt: true }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    let storeRatingInfo = null;
    if (user.role === 'STORE_OWNER' && user.ownedStore) {
      const ratings = user.ownedStore.ratings || [];
      const total = ratings.reduce((acc, r) => acc + r.value, 0);
      const avgRating = ratings.length > 0 ? (total / ratings.length).toFixed(1) : 'No ratings';
      storeRatingInfo = {
        storeId: user.ownedStore.id,
        storeName: user.ownedStore.name,
        storeEmail: user.ownedStore.email,
        storeAddress: user.ownedStore.address,
        averageRating: avgRating,
        totalRatingsCount: ratings.length
      };
    }

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
        storeRatingInfo
      }
    });
  } catch (error) {
    console.error('Get User Details Error:', error);
    return res.status(500).json({ error: 'Server error getting user details.' });
  }
}

// List all stores with ratings, search, and sorting
async function getStores(req, res) {
  try {
    const { search, name, address, sortBy = 'name', sortOrder = 'asc' } = req.query;

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search.trim() } },
        { address: { contains: search.trim() } }
      ];
    } else {
      if (name) where.name = { contains: name.trim() };
      if (address) where.address = { contains: address.trim() };
    }

    const validSortFields = ['name', 'email', 'address', 'createdAt'];
    const orderByField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const orderDirection = sortOrder.toLowerCase() === 'desc' ? 'desc' : 'asc';

    const stores = await prisma.store.findMany({
      where,
      orderBy: { [orderByField]: orderDirection },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        ratings: {
          select: { value: true }
        }
      }
    });

    const formattedStores = stores.map(store => {
      const total = store.ratings.reduce((acc, r) => acc + r.value, 0);
      const count = store.ratings.length;
      const overallRating = count > 0 ? Number((total / count).toFixed(1)) : 0;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        owner: store.owner,
        overallRating,
        totalRatingsCount: count
      };
    });

    // If sorting by rating
    if (sortBy === 'rating') {
      formattedStores.sort((a, b) => {
        return orderDirection === 'desc'
          ? b.overallRating - a.overallRating
          : a.overallRating - b.overallRating;
      });
    }

    return res.json({ stores: formattedStores });
  } catch (error) {
    console.error('Get Stores Error:', error);
    return res.status(500).json({ error: 'Server error fetching stores.' });
  }
}

module.exports = {
  getDashboardStats,
  addUser,
  addStore,
  getUsers,
  getUserDetails,
  getStores
};
