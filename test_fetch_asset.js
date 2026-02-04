// Simulate the frontend fetch behavior to reproduce the issue
const fetch = require('node-fetch');

async function testWithFetch() {
  try {
    console.log('Step 1: Testing login to get token with fetch...');

    // First, login to get a token
    const loginRes = await fetch('http://localhost:5002/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'testuser3@example.com',
        password: 'password123'
      })
    });

    const loginData = await loginRes.json();
    console.log('Login successful, got token:', loginData.token.substring(0, 50) + '...');
    console.log('User role:', loginData.user.role);

    const token = loginData.token;

    console.log('\nStep 2: Testing asset creation with fetch and token...');

    // Now try to create an asset using fetch like the frontend does
    const assetRes = await fetch('http://localhost:5002/api/assets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        assetName: 'Test Laptop from Fetch',
        assetType: 'Laptop',
        serialNumber: 'TEST002',
        brand: 'Test Brand',
        model: 'Test Model',
        purchaseDate: '2023-01-01',
        condition: 'Good',
        status: 'Available'
      })
    });

    const assetData = await assetRes.json();

    if (!assetRes.ok) {
      console.log('Asset creation failed:');
      console.log('Status:', assetRes.status);
      console.log('Response:', assetData);
    } else {
      console.log('Asset creation successful:', assetData);
    }
  } catch (error) {
    console.log('Error occurred:', error.message);
  }
}

// Install node-fetch for Node.js environment
const nodeFetch = require('node-fetch');
global.fetch = nodeFetch;

testWithFetch();