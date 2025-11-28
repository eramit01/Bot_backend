import mongoose from 'mongoose';
import Spa from './models/Spa.js';

async function checkSpas() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/spa-bot';
    await mongoose.connect(mongoUri);

    console.log('Connected to MongoDB:', mongoUri);

    // List all spas
    const spas = await Spa.find().select('spaId name isActive botName');
    console.log('All spas in database:');
    console.log(JSON.stringify(spas, null, 2));

    // Find demo-spa specifically
    const demoSpa = await Spa.findOne({ spaId: 'demo-spa' });
    console.log('\nDemo spa found:', !!demoSpa);
    if (demoSpa) {
      console.log('Demo spa details:', JSON.stringify(demoSpa.toObject(), null, 2));
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkSpas();




