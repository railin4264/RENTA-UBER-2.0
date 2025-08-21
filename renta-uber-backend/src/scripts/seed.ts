import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear usuario admin (password sin hash por ahora)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@renta-uber.com' },
    update: {},
    create: {
      email: 'admin@renta-uber.com',
      password: 'admin123', // En producción esto debería estar hasheado
      firstName: 'Admin',
      lastName: 'Sistema',
      role: 'admin'
    },
  });

  console.log('✅ Usuario admin creado:', adminUser.email);
  console.log('📧 Email: admin@renta-uber.com');
  console.log('🔑 Password: admin123');

  // Crear estados básicos
  const statuses = [
    { name: 'Activo', module: 'driver', color: '#10B981' },
    { name: 'Inactivo', module: 'driver', color: '#EF4444' },
    { name: 'Disponible', module: 'vehicle', color: '#10B981' },
    { name: 'En Mantenimiento', module: 'vehicle', color: '#F59E0B' },
    { name: 'Fuera de Servicio', module: 'vehicle', color: '#EF4444' },
    { name: 'Pagado', module: 'payment', color: '#10B981' },
    { name: 'Pendiente', module: 'payment', color: '#F59E0B' },
    { name: 'Vencido', module: 'payment', color: '#EF4444' },
    { name: 'Vigente', module: 'contract', color: '#10B981' },
    { name: 'Vencido', module: 'contract', color: '#EF4444' },
  ];

  for (const status of statuses) {
    await prisma.status.create({
      data: status,
    });
  }

  console.log('✅ Estados básicos creados');
  console.log('🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 