const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Test query to get table count
    const statusCount = await prisma.status.count();
    console.log(`📊 Status table has ${statusCount} records`);
    
    const driverCount = await prisma.driver.count();
    console.log(`👥 Driver table has ${driverCount} records`);
    
    const vehicleCount = await prisma.vehicle.count();
    console.log(`🚗 Vehicle table has ${vehicleCount} records`);
    
    const contractCount = await prisma.contract.count();
    console.log(`📄 Contract table has ${contractCount} records`);
    
    const paymentCount = await prisma.payment.count();
    console.log(`💰 Payment table has ${paymentCount} records`);
    
    console.log('🎉 All database tests passed!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection(); 