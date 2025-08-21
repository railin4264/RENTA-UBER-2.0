const bcrypt = require('bcryptjs');

async function createDefaultUser() {
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 12);
  
  console.log('Password hash:', hashedPassword);
  console.log('Use this hash to insert a user in the database');
  console.log('Email: admin@renta-uber.com');
  console.log('Password: admin123');
}

createDefaultUser().catch(console.error); 