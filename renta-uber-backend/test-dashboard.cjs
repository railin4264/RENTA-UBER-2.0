const http = require('http');

async function testDashboardAPI() {
  console.log('🔍 Testing dashboard API...');
  
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/dashboard',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Dashboard API Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('📊 Dashboard Response:', JSON.stringify(response, null, 2));
      } catch (error) {
        console.log('📄 Raw Response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Dashboard API failed:', error.message);
  });

  req.end();
}

testDashboardAPI(); 