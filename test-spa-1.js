import mongoose from 'mongoose';
import Spa from './models/Spa.js';

async function testSpa1() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/spa-bot';
    await mongoose.connect(mongoUri);

    console.log('Connected to MongoDB');

    // Test the exact same query as the controller
    const spa = await Spa.findOne({ spaId: 'spa_1' });

    console.log('Spa found:', !!spa);
    if (spa) {
      console.log('Spa data:', JSON.stringify(spa.toObject(), null, 2));

      // Test the same logic as the controller
      if (!spa) {
        console.log('Would return: Spa not found');
      } else if (!spa.isActive) {
        console.log('Would return: Spa is not active');
      } else {
        console.log('Would return spa config');
        console.log('spaId:', spa.spaId);
        console.log('spaName:', spa.spaName);
        console.log('botName:', spa.botName);
        console.log('isActive:', spa.isActive);
        console.log('services count:', spa.services?.length || 0);
      }
    } else {
      console.log('No spa found with spaId: spa_1');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testSpa1();




