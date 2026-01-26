const mongoose = require('mongoose');
require('dotenv').config();
const AccessCode = require('../src/models/accessCode');


const seedAccessCodes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Fixed 20 access codes
    const fixedCodes = [
      'ABC123', 'DEF456', 'GHI789', 'JKL012', 'MNO345',
      'PQR678', 'STU901', 'VWX234', 'YZA567', 'BCD890',
      'EFG123', 'HIJ456', 'KLM789', 'NOP012', 'QRS345',
      'TUV678', 'WXY901', 'ZAB234', 'CDE567', 'FGH890', 'MRK098'
    ];

    // Insert only codes that don't exist
    for (const code of fixedCodes) {
      const exists = await AccessCode.findOne({ code });
      if (!exists) {
        await AccessCode.create({ code });
        console.log(`Added: ${code}`);
      } else {
        console.log(`Exists: ${code}`);
      }
    }

    const totalCount = await AccessCode.countDocuments();
    console.log(`Total access codes in database: ${totalCount}`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedAccessCodes();