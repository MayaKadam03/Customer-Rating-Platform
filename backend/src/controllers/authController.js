const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validateName, validateEmail, validatePassword, validateAddress } = require('../utils/validation');
const { JWT_SECRET } = require('../middleware/auth');

const prisma = new PrismaClient();

// Register User (Supports NORMAL_USER, STORE_OWNER, and SYSTEM_ADMIN)
async function register(req, res) {
  try {
    const { name, email, password, address, role, storeName, storeAddress, storeEmail } = req.body;

    const nameErr = validateName(name);
    if (nameErr) return res.status(400).json({ error: nameErr });

    const emailErr = validateEmail(email);
    if (emailErr) return res.status(400).json({ error: emailErr });

    const passwordErr = validatePassword(password);
    if (passwordErr) return res.status(400).json({ error: passwordErr });

    const addressErr = validateAddress(address);
    if (addressErr) return res.status(400).json({ error: addressErr });

    const allowedRoles = ['NORMAL_USER', 'STORE_OWNER', 'SYSTEM_ADMIN'];
    const userRole = role && allowedRoles.includes(role) ? role : 'NORMAL_USER';

    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        address: address.trim(),
        role: userRole
      }
    });

    let createdStore = null;

    // If registering as Store Owner, create their store
    if (userRole === 'STORE_OWNER') {
      const sName = storeName && storeName.trim() ? storeName.trim() : `${user.name.split(' ')[0]}'s Retail Store`;
      const sAddress = storeAddress && storeAddress.trim() ? storeAddress.trim() : address.trim();
      const sEmail = storeEmail && storeEmail.trim() ? storeEmail.trim().toLowerCase() : `store_${Date.now()}@domain.com`;

      createdStore = await prisma.store.create({
        data: {
          name: sName,
          email: sEmail,
          address: sAddress,
          ownerId: user.id
        }
      });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      message: 'Registration successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        ownedStore: createdStore
      }
    });
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({ error: 'Server error during registration.' });
  }
}

// Login (Single login system for all user roles)
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      include: {
        ownedStore: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        ownedStore: user.ownedStore
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ error: 'Server error during login.' });
  }
}

// Get current logged-in user profile
async function getMe(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        ownedStore: {
          include: {
            ratings: true
          }
        }
      }
    });

    return res.json({ user });
  } catch (error) {
    console.error('GetMe Error:', error);
    return res.status(500).json({ error: 'Server error fetching user profile.' });
  }
}

// Update password (for logged-in user)
async function updatePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both current password and new password are required.' });
    }

    const passwordErr = validatePassword(newPassword);
    if (passwordErr) return res.status(400).json({ error: passwordErr });

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    });

    return res.json({ message: 'Password updated successfully!' });
  } catch (error) {
    console.error('UpdatePassword Error:', error);
    return res.status(500).json({ error: 'Server error updating password.' });
  }
}

module.exports = {
  register,
  login,
  getMe,
  updatePassword
};
