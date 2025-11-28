import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

async function createDemoSpa() {
  try {
    // First login as admin
    console.log('Logging in as admin...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@spa.com',
      password: 'admin123'
    });

    const token = loginResponse.data.token;
    console.log('Login successful');

    // Create demo spa
    console.log('Creating demo spa...');
    const spaData = {
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

    const createResponse = await axios.post(`${API_BASE}/spas`, spaData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Demo spa created successfully:', createResponse.data);

    // Test the config endpoint
    console.log('Testing config endpoint...');
    const configResponse = await axios.get(`${API_BASE}/spas/config/demo-spa`);
    console.log('Config endpoint works:', configResponse.data);

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

createDemoSpa();




