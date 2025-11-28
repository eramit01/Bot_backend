import mongoose from 'mongoose';

// Demo spa data
const demoSpa = {
  spaId: 'demo-spa',
  name: 'Demo Spa',
  description: 'A demo spa for testing the chatbot widget',
  address: '123 Demo Street, Demo City',
  phone: '+1-234-567-8900',
  email: 'info@demo-spa.com',
  services: [
    {
      name: 'Swedish Massage',
      description: 'Relaxing full body massage',
      duration: 60,
      price: 80
    },
    {
      name: 'Deep Tissue Massage',
      description: 'Therapeutic massage for muscle tension',
      duration: 60,
      price: 90
    },
    {
      name: 'Facial Treatment',
      description: 'Rejuvenating facial treatment',
      duration: 45,
      price: 70
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
  botName: 'Spa Assistant',
  botImage: null,
  isActive: true
};

async function createDemoSpa() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/spa-bot';
    await mongoose.connect(mongoUri);

    console.log('Connected to MongoDB');

    // Get Spa model
    const Spa = mongoose.model('Spa', new mongoose.Schema({}, { strict: false }));

    // Check if demo spa already exists
    const existingSpa = await Spa.findOne({ spaId: 'demo-spa' });

    if (existingSpa) {
      console.log('Demo spa already exists, updating...');
      await Spa.findByIdAndUpdate(existingSpa._id, demoSpa, { new: true });
      console.log('Demo spa updated successfully!');
    } else {
      console.log('Creating demo spa...');
      await Spa.create(demoSpa);
      console.log('Demo spa created successfully!');
    }

    console.log('\nDemo spa details:');
    console.log('- spaId: demo-spa');
    console.log('- Name: Demo Spa');
    console.log('- Bot Name: Spa Assistant');
    console.log('- Active: true');

    console.log('\nYou can now test the chatbot at:');
    console.log('http://localhost:5173/?spa=demo-spa');

  } catch (error) {
    console.error('Error creating demo spa:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createDemoSpa();




