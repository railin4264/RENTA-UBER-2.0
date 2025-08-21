const http = require('http');

async function testBackendConnection() {
  console.log('🔍 Testing backend connection...');
  
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Backend Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('📊 Backend Response:', JSON.parse(data));
    });
  });

  req.on('error', (error) => {
    console.error('❌ Backend connection failed:', error.message);
  });

  req.end();
}

testBackendConnection(); 