# Sistema de Renta Uber - Aplicación Completa y Mejorada

## 🚀 Descripción General

Sistema completo de gestión para empresas de renta de vehículos orientado a conductores de Uber. Esta aplicación ha sido revisada y mejorada exhaustivamente para garantizar seguridad, rendimiento y una excelente experiencia de usuario.

## 🛠️ Stack Tecnológico

### Backend
- **Node.js** con Express.js
- **TypeScript** para type safety
- **Prisma ORM** con PostgreSQL/SQLite
- **JWT** para autenticación
- **Zod** para validación de datos
- **Bcrypt** para encriptación de contraseñas
- **Multer** para manejo de archivos
- **Express Rate Limit** para protección contra ataques

### Frontend
- **React 18** con TypeScript
- **Vite** como build tool
- **React Router** para navegación
- **Tailwind CSS** para estilos
- **React Hook Form** con Zod para formularios
- **React Hot Toast** para notificaciones
- **Lucide React** para iconos

## 📋 Mejoras Implementadas

### 🔒 Seguridad
- ✅ Eliminación de secrets hardcodeados
- ✅ Implementación de variables de entorno (.env)
- ✅ Validación robusta con Zod en todas las rutas
- ✅ Configuración CORS mejorada y restrictiva
- ✅ Rate limiting en endpoints sensibles
- ✅ Middleware de autenticación y autorización
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Tokens JWT con expiración configurable

### 🏗️ Arquitectura
- ✅ Separación clara de responsabilidades
- ✅ Manejo centralizado de errores
- ✅ Logging estructurado
- ✅ Validación de datos en frontend y backend
- ✅ API RESTful bien estructurada
- ✅ Tipos TypeScript completos

### 🎨 UX/UI
- ✅ Interfaz moderna y responsiva
- ✅ Feedback visual para todas las acciones
- ✅ Manejo de estados de carga
- ✅ Mensajes de error claros
- ✅ Navegación intuitiva
- ✅ Formularios con validación en tiempo real

## 🚀 Instalación Rápida

### Prerequisitos
- Node.js 18+
- PostgreSQL 12+ (o usar SQLite para desarrollo)
- Git

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd renta-uber
```

### 2. Configurar el Backend

```bash
cd renta-uber-backend
npm install

# Copiar y configurar variables de entorno
cp env.example .env
# Editar .env con tus credenciales

# Para desarrollo con SQLite (más simple)
npm run setup

# Para producción con PostgreSQL
# Configurar DATABASE_URL en .env
npm run prisma:migrate
npm run prisma:seed
```

### 3. Configurar el Frontend

```bash
cd ../demo-frontend
npm install

# Crear archivo de variables de entorno
echo "VITE_API_URL=http://localhost:3001/api" > .env
```

### 4. Iniciar la aplicación

**Opción 1: Dos terminales separadas**
```bash
# Terminal 1 - Backend
cd renta-uber-backend
npm run dev

# Terminal 2 - Frontend
cd demo-frontend
npm run dev
```

**Opción 2: Script unificado (Windows)**
```bash
cd demo-frontend
./start-all.bat
```

## 📱 Acceso a la Aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Prisma Studio**: `npm run prisma:studio` (http://localhost:5555)

### Credenciales de Demo
- **Admin**: admin@renta-uber.com / admin123
- **Usuario**: user@renta-uber.com / user123

## 📚 Estructura del Proyecto

```
renta-uber/
├── renta-uber-backend/         # Backend API
│   ├── src/
│   │   ├── controllers/        # Controladores de rutas
│   │   ├── routes/            # Definición de rutas
│   │   ├── services/          # Lógica de negocio
│   │   ├── middlewares/       # Middlewares personalizados
│   │   ├── utils/             # Utilidades y helpers
│   │   └── app.ts            # Configuración de Express
│   ├── prisma/
│   │   ├── schema.prisma     # Esquema de base de datos
│   │   └── seed.ts           # Datos de prueba
│   └── uploads/              # Archivos subidos
│
├── demo-frontend/             # Frontend React
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── services/         # Servicios API
│   │   ├── context/          # Context providers
│   │   └── types/            # Tipos TypeScript
│   └── public/               # Archivos estáticos
│
└── docs/                     # Documentación adicional
```

## 🔧 Configuración Avanzada

### Variables de Entorno Backend (.env)

```env
# Base de datos
DATABASE_URL="postgresql://user:password@localhost:5432/renta_uber"

# JWT
JWT_SECRET="cambiar-en-produccion"
JWT_REFRESH_SECRET="cambiar-en-produccion"
JWT_EXPIRES_IN="7d"

# Servidor
PORT=3001
NODE_ENV=development

# Frontend URL para CORS
FRONTEND_URL=http://localhost:5173

# Límites de archivos
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### Configuración de Base de Datos

**SQLite (Desarrollo)**
```bash
# Ya configurado en schema.sqlite.prisma
DATABASE_URL="file:./dev.db"
```

**PostgreSQL (Producción)**
```bash
# Crear base de datos
createdb renta_uber_db

# Ejecutar migraciones
npm run prisma:migrate
```

## 🧪 Testing

```bash
# Backend
cd renta-uber-backend
npm test

# Frontend
cd demo-frontend
npm test
```

## 📊 Funcionalidades Principales

### Gestión de Conductores
- CRUD completo con validación
- Subida de fotos y documentos
- Gestión de garantes
- Historial de pagos y deudas
- Estados configurables

### Gestión de Vehículos
- Inventario con fotos múltiples
- Control de mantenimiento
- Seguimiento de documentación
- Estados de disponibilidad
- Historial de gastos

### Sistema de Contratos
- Tipos flexibles (diario, semanal, mensual)
- Control de depósitos
- Seguimiento de pagos
- Gestión de multas
- Estados del contrato

### Reportes y Analytics
- Dashboard con métricas en tiempo real
- Reportes financieros
- Análisis de rendimiento
- Exportación de datos

### Sistema de Pagos
- Registro de pagos múltiples
- Tipos de pago configurables
- Historial completo
- Integración con contratos

## 🔐 Seguridad Implementada

1. **Autenticación JWT**
   - Tokens seguros con expiración
   - Refresh tokens
   - Logout efectivo

2. **Autorización por Roles**
   - Admin: Acceso completo
   - User: Acceso limitado
   - Driver: Solo lectura de su información

3. **Validación de Datos**
   - Esquemas Zod en todas las rutas
   - Validación frontend y backend
   - Sanitización de inputs

4. **Protección de Rutas**
   - Rate limiting adaptativo
   - CORS configurado correctamente
   - Headers de seguridad

## 🚀 Despliegue

### Heroku
```bash
# Backend
heroku create mi-renta-uber-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main

# Frontend
npm run build
# Subir dist/ a Netlify/Vercel
```

### Docker
```dockerfile
# Dockerfile incluido en cada proyecto
docker-compose up -d
```

## 🐛 Solución de Problemas Comunes

### Error de conexión a base de datos
```bash
# Verificar PostgreSQL está corriendo
sudo service postgresql status

# Reiniciar servicio
sudo service postgresql restart
```

### Error de permisos en uploads
```bash
# Crear directorios necesarios
mkdir -p renta-uber-backend/uploads/drivers/photos
mkdir -p renta-uber-backend/uploads/drivers/documents
chmod 755 -R renta-uber-backend/uploads
```

### Problemas con Prisma
```bash
# Regenerar cliente
npm run prisma:generate

# Resetear base de datos
npx prisma db push --force-reset
npm run prisma:seed
```

## 📈 Próximas Mejoras

- [ ] Tests automatizados completos
- [ ] Integración con servicios de pago
- [ ] App móvil con React Native
- [ ] Notificaciones push
- [ ] Integración con WhatsApp Business
- [ ] Sistema de facturación
- [ ] Multi-idioma
- [ ] Modo oscuro

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Desarrollado por

Sistema desarrollado profesionalmente con las mejores prácticas de la industria, enfocado en seguridad, rendimiento y experiencia de usuario.

---

**¿Necesitas ayuda?** Abre un issue en GitHub o contacta al equipo de desarrollo.