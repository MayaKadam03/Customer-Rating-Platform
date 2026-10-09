const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get Store Owner Dashboard
async function getOwnerDashboard(req, res) {
  try {
    const userId = req.user.id;
    const { sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Find the store owned by this store owner user
    const store = await prisma.store.findUnique({
      where: { ownerId: userId },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                address: true
              }
            }
          }
        }
      }
    });

    if (!store) {
      return res.status(404).json({
        error: 'No store found assigned to your Store Owner account.'
      });
    }

    const ratingsList = store.ratings || [];
    const totalScore = ratingsList.reduce((acc, r) => acc + r.value, 0);
    const averageRating = ratingsList.length > 0 ? Number((totalScore / ratingsList.length).toFixed(1)) : 0;

    let userRatings = ratingsList.map(r => ({
      ratingId: r.id,
      userId: r.user.id,
      userName: r.user.name,
      userEmail: r.user.email,
      userAddress: r.user.address,
      ratingValue: r.value,
      submittedAt: r.updatedAt || r.createdAt
    }));

    // Sorting implementation for Store Owner user ratings table
    userRatings.sort((a, b) => {
      let valA = a[sortBy] || a.userName;
      let valB = b[sortBy] || b.userName;

      if (sortBy === 'rating' || sortBy === 'ratingValue') {
        valA = a.ratingValue;
        valB = b.ratingValue;
      } else if (sortBy === 'name' || sortBy === 'userName') {
        valA = a.userName.toLowerCase();
        valB = b.userName.toLowerCase();
      } else if (sortBy === 'email' || sortBy === 'userEmail') {
        valA = a.userEmail.toLowerCase();
        valB = b.userEmail.toLowerCase();
      } else if (sortBy === 'date' || sortBy === 'createdAt' || sortBy === 'submittedAt') {
        valA = new Date(a.submittedAt).getTime();
        valB = new Date(b.submittedAt).getTime();
      }

      if (valA < valB) return sortOrder.toLowerCase() === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder.toLowerCase() === 'asc' ? 1 : -1;
      return 0;
    });

    return res.json({
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating,
        totalRatingsCount: ratingsList.length
      },
      userRatings
    });
  } catch (error) {
    console.error('Owner Dashboard Error:', error);
    return res.status(500).json({ error: 'Failed to fetch store owner dashboard.' });
  }
}

module.exports = {
  getOwnerDashboard
};
