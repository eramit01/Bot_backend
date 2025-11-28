import mongoose from 'mongoose';
import Spa from './models/Spa.js';

async function testAPI() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/spa-bot';
    await mongoose.connect(mongoUri);

    console.log('Connected to MongoDB');

    // Test the exact same query as the controller
    const spa = await Spa.findOne({ spaId: 'demo-spa' });

    console.log('Spa found:', !!spa);
    if (spa) {
      console.log('Spa data:', {
        spaId: spa.spaId,
        name: spa.name,
        isActive: spa.isActive,
        botName: spa.botName
      });

      // Test the same logic as the controller
      if (!spa) {
        console.log('Would return: Spa not found');
      } else if (!spa.isActive) {
        console.log('Would return: Spa is not active');
      } else {
        console.log('Would return spa config');
      }
    } else {
      console.log('No spa found with spaId: demo-spa');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testAPI();




