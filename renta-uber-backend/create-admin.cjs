const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('🔧 Creando usuario administrador...');
    
    // Verificar si ya existe un admin
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (existingAdmin) {
      console.log('⚠️  Ya existe un usuario administrador');
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@rentauber.com',
        password: hashedPassword,
        firstName: 'Administrador',
        lastName: 'Sistema',
        role: 'admin'
      }
    });

    console.log('✅ Usuario administrador creado exitosamente!');
    console.log('📧 Email: admin@rentauber.com');
    console.log('🔑 Contraseña: admin123');
    console.log('👤 Nombre: Administrador Sistema');
    console.log('🔐 Rol: admin');

  } catch (error) {
    console.error('❌ Error creando usuario administrador:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser(); 