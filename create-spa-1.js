import mongoose from 'mongoose';
import Spa from './models/Spa.js';

async function createSpa1() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/spa-bot';
    await mongoose.connect(mongoUri);

    console.log('Connected to MongoDB');

    // Check if spa_1 already exists
    const existingSpa = await Spa.findOne({ spaId: 'spa_1' });

    const spa1Data = {
      spaId: 'spa_1',
      spaName: 'Test Spa 1',
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
        },
        {
          id: '2',
          title: 'Deep Tissue Massage',
          priceRange: '₹1,800 - ₹2,800',
          duration: '60 mins',
          popular: true
        },
        {
          id: '3',
          title: 'Facial Treatment',
          priceRange: '₹1,200 - ₹2,000',
          duration: '45 mins',
          popular: false
        },
        {
          id: '4',
          title: 'Hot Stone Massage',
          priceRange: '₹2,000 - ₹3,000',
          duration: '75 mins',
          popular: true
        }
      ],
      workingHours: {
        monday: { open: '09:00', close: '18:00', isOpen: true },
        tuesday: { open: '09:00', close: '18:00', isOpen: true },
        wednesday: { open: '09:00', close: '18:00', isOpen: true },
        thursday: { open: '09:00', close: '18:00', isOpen: true },
        friday: { open: '09:00', close: '18:00', isOpen: true },
        saturday: { open: '10:00', close: '16:00', isOpen: true },
        sunday: { open: '10:00', close: '14:00', isOpen: true }
      },
      botName: 'Priya',
      botImage: null,
      offer: '20% OFF on all services!',
      isActive: true
    };

    if (existingSpa) {
      console.log('spa_1 already exists, updating...');
      await Spa.findByIdAndUpdate(existingSpa._id, spa1Data, { new: true });
      console.log('spa_1 updated successfully!');
    } else {
      console.log('Creating spa_1...');
      await Spa.create(spa1Data);
      console.log('spa_1 created successfully!');
    }

    console.log('\nspa_1 details:');
    console.log('- spaId: spa_1');
    console.log('- Name: Test Spa 1');
    console.log('- Bot Name: Priya');
    console.log('- Services: 4 services');
    console.log('- Active: true');

    console.log('\nYou can now test the chatbot at:');
    console.log('http://localhost:5173/?spa=spa_1');

  } catch (error) {
    console.error('Error creating spa_1:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createSpa1();
