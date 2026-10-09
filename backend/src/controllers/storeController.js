const { PrismaClient } = require('@prisma/client');
const { validateRating } = require('../utils/validation');

const prisma = new PrismaClient();

// Get list of stores for Normal Users (includes overall rating & user's submitted rating)
async function getStoresForUser(req, res) {
  try {
    const { name, address, search, sortBy = 'name', sortOrder = 'asc' } = req.query;
    const currentUserId = req.user ? req.user.id : null;

    const where = {};
    if (search && search.trim()) {
      const searchTerm = search.trim();
      where.OR = [
        { name: { contains: searchTerm } },
        { address: { contains: searchTerm } }
      ];
    } else {
      if (name && name.trim()) where.name = { contains: name.trim() };
      if (address && address.trim()) where.address = { contains: address.trim() };
    }

    const validSortFields = ['name', 'address', 'createdAt'];
    const orderByField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const orderDirection = sortOrder.toLowerCase() === 'desc' ? 'desc' : 'asc';

    const stores = await prisma.store.findMany({
      where,
      orderBy: { [orderByField]: orderDirection },
      include: {
        ratings: true
      }
    });

    const formattedStores = stores.map(store => {
      const ratings = store.ratings || [];
      const total = ratings.reduce((acc, r) => acc + r.value, 0);
      const overallRating = ratings.length > 0 ? Number((total / ratings.length).toFixed(1)) : 0;

      let userSubmittedRating = null;
      if (currentUserId) {
        const userRatingObj = ratings.find(r => r.userId === currentUserId);
        if (userRatingObj) {
          userSubmittedRating = userRatingObj.value;
        }
      }

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        overallRating,
        totalRatingsCount: ratings.length,
        userSubmittedRating
      };
    });

    // Custom sort by rating if specified
    if (sortBy === 'overallRating' || sortBy === 'rating') {
      formattedStores.sort((a, b) => {
        return orderDirection === 'desc'
          ? b.overallRating - a.overallRating
          : a.overallRating - b.overallRating;
      });
    }

    return res.json({ stores: formattedStores });
  } catch (error) {
    console.error('Get Stores For User Error:', error);
    return res.status(500).json({ error: 'Failed to fetch store listings.' });
  }
}

// Submit or modify rating for a store
async function submitOrUpdateRating(req, res) {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    const ratingErr = validateRating(rating);
    if (ratingErr) return res.status(400).json({ error: ratingErr });

    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      return res.status(404).json({ error: 'Store not found.' });
    }

    const ratingValue = Number(rating);

    // Upsert rating (create if not exists, update if exists)
    const updatedRating = await prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId,
          storeId
        }
      },
      update: {
        value: ratingValue
      },
      create: {
        userId,
        storeId,
        value: ratingValue
      }
    });

    // Recalculate store average rating
    const allRatings = await prisma.rating.findMany({
      where: { storeId },
      select: { value: true }
    });

    const total = allRatings.reduce((acc, r) => acc + r.value, 0);
    const overallRating = Number((total / allRatings.length).toFixed(1));

    return res.json({
      message: 'Rating submitted successfully!',
      rating: updatedRating.value,
      overallRating,
      totalRatingsCount: allRatings.length
    });
  } catch (error) {
    console.error('Submit Rating Error:', error);
    return res.status(500).json({ error: 'Failed to submit rating.' });
  }
}

module.exports = {
  getStoresForUser,
  submitOrUpdateRating
};
