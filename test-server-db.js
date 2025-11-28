import mongoose from 'mongoose';
import Spa from './models/Spa.js';

async function testServerDB() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect('mongodb://localhost:27017/spa-bot');

    console.log('Connected successfully');

    // Check current spas
    const currentSpas = await Spa.find().select('spaId spaName name');
    console.log('Current spas in DB:', currentSpas.length);
    currentSpas.forEach(spa => console.log(' -', spa.spaId, spa.spaName || spa.name));

    // Create or update demo-spa
    const demoData = {
      spaId: 'demo-spa',
      spaName: 'Demo Spa',
      botName: 'Priya',
      botImage: null,
      offer: '20% OFF on all services!',
      isActive: true,
      colors: { primary: "#7c3aed", secondary: "#f5f3ff" },
      services: [
        {
          id: '1',
          title: 'Swedish Massage',
          priceRange: '₹1,500 - ₹2,500',
          duration: '60 mins',
          popular: true
        }
      ]
    };

    const existing = await Spa.findOne({ spaId: 'demo-spa' });
    if (existing) {
      await Spa.findByIdAndUpdate(existing._id, demoData);
      console.log('Updated demo-spa');
    } else {
      await Spa.create(demoData);
      console.log('Created demo-spa');
    }

    // Verify
    const verifySpa = await Spa.findOne({ spaId: 'demo-spa' });
    console.log('Verification - spa found:', !!verifySpa);
    if (verifySpa) {
      console.log('spaId:', verifySpa.spaId);
      console.log('spaName:', verifySpa.spaName);
      console.log('isActive:', verifySpa.isActive);
    }

    console.log('Test completed successfully');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testServerDB();




