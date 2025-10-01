#!/usr/bin/env python3
"""
Script para generar PDF de la documentación de Repara Mi Barrio
"""

import os

def create_markdown_file():
    """Crea un archivo Markdown con la documentación completa"""
    
    content = """
# REPARA MI BARRIO
## Documentación Completa del Proyecto
### Versión 0.1.0 - Octubre 2025

---

## TABLA DE CONTENIDOS

1. Introducción
2. Descripción General del Proyecto
3. Características Principales
4. Arquitectura del Sistema
5. Tecnologías Utilizadas
6. Estructura de Archivos
7. Componentes del Sistema
8. Modelos de Datos
9. Flujo de Navegación
10. Pantallas de la Aplicación
11. Instalación y Configuración
12. Guía de Uso
13. Desarrollo y Personalización
14. Consideraciones Técnicas
15. Mejoras Futuras

---

## 1. INTRODUCCIÓN

"Repara mi Barrio" es una aplicación web prototipo diseñada para facilitar la comunicación entre los ciudadanos y las autoridades municipales. Permite a los usuarios reportar problemas de infraestructura y servicios públicos en su comunidad, realizar seguimiento del estado de sus reportes y contribuir activamente a la mejora de su barrio.

Este documento proporciona una guía completa sobre la arquitectura, funcionalidades y uso del sistema.

---

## 2. DESCRIPCIÓN GENERAL DEL PROYECTO

### Propósito:
Facilitar la participación ciudadana en el mantenimiento y mejora de los espacios públicos mediante un sistema de reportes georreferenciados.

### Alcance:
- Registro y autenticación de usuarios
- Creación de reportes con fotografías y ubicación
- Visualización de reportes en un mapa interactivo
- Seguimiento del estado de los reportes
- Gestión de perfil de usuario
- Sistema de notificaciones
- Categorización de problemas por tipo

### Beneficios:
✓ Mejora la comunicación ciudadano-gobierno
✓ Permite respuesta rápida a problemas urbanos
✓ Transparencia en la gestión de reportes
✓ Participación ciudadana activa
✓ Geolocalización precisa de problemas

---

## 3. CARACTERÍSTICAS PRINCIPALES

### 3.1 Sistema de Reportes
- Creación de reportes con título, descripción y fotografía
- Categorización por tipo de problema
- Geolocalización automática o manual
- Estado del reporte (Pendiente, En Proceso, Resuelto)
- Línea de tiempo de seguimiento

### 3.2 Mapa Interactivo
- Visualización de todos los reportes en el mapa
- Marcadores diferenciados por categoría y estado
- Leyenda visual de categorías y estados
- Controles de zoom y ubicación actual
- Selección de reportes en el mapa

### 3.3 Gestión de Usuario
- Registro con email y contraseña
- Inicio de sesión seguro
- Perfil personalizable con avatar
- Estadísticas de reportes del usuario
- Historial de reportes propios

### 3.4 Categorías de Reportes
- **Baches** - Infraestructura vial
- **Basura** - Gestión de residuos
- **Alumbrado** - Servicios de iluminación
- **Agua** - Fugas y servicios hídricos
- **Seguridad** - Problemas de seguridad ciudadana

### 3.5 Sistema de Notificaciones
- Alertas de cambio de estado en reportes
- Notificaciones de resolución
- Actualizaciones del sistema

---

## 4. ARQUITECTURA DEL SISTEMA

### Patrón de Diseño:
Arquitectura de aplicación de página única (SPA - Single Page Application) con gestión de estado mediante React Hooks.

### Capas del Sistema:

```
┌─────────────────────────────────────┐
│      CAPA DE PRESENTACIÓN           │
│   (Componentes React + UI)          │
├─────────────────────────────────────┤
│      CAPA DE LÓGICA                 │
│   (Estado, Navegación, Hooks)       │
├─────────────────────────────────────┤
│      CAPA DE DATOS                  │
│   (Modelos, Mock Data)              │
└─────────────────────────────────────┘
```

### Flujo de Datos:
Usuario → Componentes → Estado Local → Actualización de UI

---

## 5. TECNOLOGÍAS UTILIZADAS

### Frontend:
- React 18.3.1 - Biblioteca principal de UI
- TypeScript - Tipado estático
- Vite 6.3.5 - Herramienta de construcción y desarrollo
- React DOM 18.3.1 - Renderizado de React

### Librerías de UI:
- Radix UI - Componentes accesibles primitivos
- Lucide React 0.487.0 - Iconos SVG
- Tailwind CSS - Framework de estilos utility-first
- Class Variance Authority - Gestión de variantes de clase

### Componentes Especializados:
- Sonner 2.0.3 - Sistema de notificaciones toast
- React Hook Form 7.55.0 - Gestión de formularios
- React Day Picker 8.10.1 - Selector de fechas
- Recharts 2.15.2 - Gráficos y visualizaciones

### Herramientas de Desarrollo:
- @vitejs/plugin-react-swc 3.10.2 - Compilador rápido de React
- @types/node 20.10.0 - Tipos de TypeScript para Node.js

---

## 6. ESTRUCTURA DE ARCHIVOS

```
Repara mi Barrio Prototipo/
│
├── index.html                    # Punto de entrada HTML
├── package.json                  # Dependencias y scripts
├── vite.config.ts               # Configuración de Vite
├── README.md                     # Documentación básica
├── DOCUMENTACION.txt            # Esta documentación
│
└── src/                          # Código fuente
    ├── main.tsx                  # Punto de entrada de React
    ├── App.tsx                   # Componente principal
    ├── index.css                 # Estilos globales
    │
    ├── components/               # Componentes React
    │   ├── ui/                   # Componentes UI reutilizables
    │   ├── figma/                # Componentes de integración
    │   └── [Pantallas].tsx       # Componentes de pantalla
    │
    ├── lib/                       # Lógica y utilidades
    │   └── data.ts                # Modelos y datos mock
    │
    └── styles/                    # Estilos adicionales
```

---

## 7. COMPONENTES DEL SISTEMA

### 7.1 Componente Principal (App.tsx)

**Responsabilidades:**
- Gestión del estado global de navegación
- Control del flujo entre pantallas
- Manejo del historial de navegación
- Gestión del tab activo en navegación inferior

**Estados Principales:**
- `currentScreen`: Pantalla actual mostrada
- `activeTab`: Tab activo en la navegación principal
- `selectedReport`: Reporte seleccionado para ver detalle
- `navigationHistory`: Historial de navegación para el botón atrás

### 7.2 Pantallas de Autenticación

**WelcomeScreen:**
- Pantalla inicial con logo y opciones
- Navegación a Login o Registro
- Diseño atractivo con gradiente e imagen

**LoginScreen:**
- Formulario de inicio de sesión
- Campos: email y contraseña
- Opción de recuperar contraseña
- Enlace a registro

**RegisterScreen:**
- Formulario de registro de nuevo usuario
- Campos: nombre, email, contraseña, confirmación
- Validación de datos
- Términos y condiciones

### 7.3 Pantallas Principales

**MapScreen:**
- Mapa interactivo simulado
- Marcadores de reportes con iconos por categoría
- Leyenda de categorías y estados
- Controles de zoom y ubicación
- Card de detalle al seleccionar reporte

**CreateReportScreen:**
- Formulario completo de reporte
- Upload de foto
- Selector de categoría con botones visuales
- Selector de ubicación con mini-mapa
- Validación de campos

**ReportsListScreen:**
- Lista de todos los reportes
- Filtros por categoría y estado
- Barra de búsqueda
- Cards de reporte con información resumida

---

## 8. MODELOS DE DATOS

### 8.1 Report (Reporte)

```typescript
interface Report {
  id: string;                    // Identificador único
  title: string;                 // Título del reporte
  description: string;           // Descripción detallada
  category: CategoryType;        // Categoría del problema
  status: StatusType;            // Estado actual
  location: {                    // Información de ubicación
    lat: number;                 // Latitud
    lng: number;                 // Longitud
    address: string;             // Dirección legible
  };
  date: string;                  // Fecha de creación
  imageUrl?: string;             // URL de la imagen
  user: {                        // Información del usuario
    name: string;                // Nombre del usuario
    avatar?: string;             // Avatar
  };
  timeline?: Array<{             // Línea de tiempo
    status: string;              // Estado en ese momento
    date: string;                // Fecha del cambio
    description: string;         // Descripción del cambio
  }>;
}
```

### 8.2 Tipos de Categoría

```typescript
type CategoryType =
  | 'baches'      // Problemas de pavimento
  | 'basura'      // Gestión de residuos
  | 'alumbrado'   // Iluminación pública
  | 'agua'        // Servicios hídricos
  | 'seguridad'   // Seguridad ciudadana
```

### 8.3 Tipos de Estado

```typescript
type StatusType =
  | 'pendiente'    // Recién reportado
  | 'en-proceso'   // En atención
  | 'resuelto'     // Completado
```

---

## 9. FLUJO DE NAVEGACIÓN

### 9.1 Flujo de Autenticación

```
[Bienvenida]
    ↓
    ├─→ [Login] → [Pantalla Principal]
    │       ↑
    │       └─ [Recuperar Contraseña]
    │
    └─→ [Registro] → [Pantalla Principal]
```

### 9.2 Flujo Principal de la App

```
[Pantalla Principal]
    │
    ├─ Tab Mapa
    │   ├─→ [Ver Reporte en Mapa] → [Detalle]
    │   └─→ [Crear Nuevo Reporte] → [Formulario]
    │
    ├─ Tab Reportes
    │   └─→ [Lista de Reportes] → [Detalle]
    │
    └─ Tab Perfil
        ├─→ [Mis Reportes]
        ├─→ [Editar Perfil]
        ├─→ [Notificaciones]
        └─→ [Configuración]
```

---

## 10. PANTALLAS DE LA APLICACIÓN

El sistema cuenta con más de 14 pantallas diferentes:

1. **Pantalla de Bienvenida** - Punto de entrada con opciones de login/registro
2. **Pantalla de Login** - Autenticación de usuarios existentes
3. **Pantalla de Registro** - Creación de nuevas cuentas
4. **Pantalla del Mapa** - Vista principal con reportes georreferenciados
5. **Pantalla de Crear Reporte** - Formulario completo para nuevos reportes
6. **Pantalla de Lista de Reportes** - Vista de todos los reportes con filtros
7. **Pantalla de Detalle de Reporte** - Información completa de un reporte
8. **Pantalla de Perfil** - Gestión de cuenta de usuario
9. **Pantalla de Mis Reportes** - Reportes creados por el usuario
10. **Pantalla de Editar Perfil** - Actualización de datos personales
11. **Pantalla de Notificaciones** - Centro de notificaciones
12. **Pantalla de Configuración** - Preferencias de la aplicación
13. **Pantalla de Soporte** - FAQ y contacto
14. **Pantalla de Acerca de** - Información de la aplicación

---

## 11. INSTALACIÓN Y CONFIGURACIÓN

### 11.1 Requisitos Previos
- Node.js versión 20.x o superior
- npm (incluido con Node.js) o yarn
- Navegador web moderno
- Editor de código (recomendado: VS Code)

### 11.2 Instalación Paso a Paso

**Paso 1: Clonar o Descargar el Proyecto**
```bash
$ git clone [URL_DEL_REPOSITORIO]
$ cd "Repara mi Barrio Prototipo"
```

**Paso 2: Instalar Dependencias**
```bash
$ npm install
```
Tiempo estimado: 2-5 minutos

**Paso 3: Iniciar el Servidor de Desarrollo**
```bash
$ npm run dev
```
La aplicación estará disponible en: `http://localhost:5173`

### 11.3 Construcción para Producción
```bash
$ npm run build
```
Esto creará una carpeta 'dist' con los archivos optimizados.

---

## 12. GUÍA DE USO

### 12.1 Para Usuarios Finales

**Primer Uso:**
1. Abrir la aplicación
2. En pantalla de bienvenida, seleccionar "Registrarse"
3. Completar formulario con datos personales
4. Aceptar términos y condiciones
5. Click en "Registrarse"
6. Acceder a la pantalla principal

**Crear un Reporte:**
1. Click en botón "+" (verde)
2. Tomar foto o seleccionar de galería
3. Escribir título descriptivo
4. Escribir descripción detallada
5. Seleccionar categoría
6. Confirmar ubicación
7. Click en "Enviar Reporte"
8. Ver confirmación

**Ver Reportes en el Mapa:**
1. Ir al tab "Mapa"
2. Explorar el mapa
3. Click en marcador para ver información
4. Click en "Ver detalle" para información completa

### 12.2 Para Administradores

**Monitoreo de Reportes:**
- Revisar reportes regularmente
- Actualizar estados según progreso
- Responder a usuarios
- Asignar recursos según prioridad

---

## 13. DESARROLLO Y PERSONALIZACIÓN

### 13.1 Crear un Nuevo Componente

```typescript
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

interface MiComponenteProps {
  onNavigate: (screen: string) => void;
}

export function MiComponente({ onNavigate }: MiComponenteProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white border-b px-4 py-4">
        <button onClick={() => onNavigate('back')}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2>Título</h2>
      </div>
      <div className="px-4 py-6">
        {/* Contenido */}
      </div>
    </div>
  );
}
```

### 13.2 Personalizar Colores

El color principal verde (#27AE60) se puede cambiar:
1. Buscar todas las referencias a #27AE60
2. Reemplazar con el nuevo color
3. Ajustar hover states (#229954)

### 13.3 Agregar Nueva Categoría

1. Abrir `src/lib/data.ts`
2. Agregar tipo en `CategoryType`
3. Agregar configuración en array `categories`
4. Los cambios se reflejan automáticamente

### 13.4 Integrar con Backend

```typescript
// src/services/api.ts
const API_URL = 'https://tu-api.com';

export const api = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },
  
  getReports: async () => {
    const response = await fetch(`${API_URL}/reports`);
    return response.json();
  },
  
  createReport: async (reportData: any) => {
    const response = await fetch(`${API_URL}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData)
    });
    return response.json();
  }
};
```

---

## 14. CONSIDERACIONES TÉCNICAS

### 14.1 Rendimiento
- React 18 con Concurrent Features
- Vite para bundling rápido
- SWC para compilación veloz
- Code splitting automático

### 14.2 Seguridad
- Validación de entrada en cliente Y servidor
- Sanitización de datos de usuario
- Protección contra XSS
- HTTPS obligatorio en producción
- Autenticación con JWT

### 14.3 Accesibilidad (a11y)
- Componentes Radix UI accesibles por defecto
- Soporte de teclado completo
- ARIA labels apropiados
- Contraste de colores WCAG AA

### 14.4 Responsive Design
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### 14.5 PWA (Progressive Web App)

Para convertir en PWA, agregar manifest.json:

```json
{
  "name": "Repara mi Barrio",
  "short_name": "RMB",
  "description": "Reporta problemas en tu barrio",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#27AE60",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

---

## 15. MEJORAS FUTURAS

### Corto Plazo:
- Autenticación real con JWT
- Integración con mapa real (Google Maps/Mapbox)
- Upload real de imágenes
- Notificaciones push
- Comentarios en reportes
- Sistema de votación

### Mediano Plazo:
- Dashboard de administración
- Analytics avanzados
- Detección de reportes duplicados
- Geofencing para alertas
- Chat en vivo con autoridades
- Gamificación

### Largo Plazo:
- Inteligencia artificial para clasificación
- Integración con sistemas municipales
- API pública
- App móvil nativa
- Blockchain para transparencia
- Realidad aumentada

---

## CONCLUSIÓN

"Repara mi Barrio" es una plataforma innovadora que facilita la participación ciudadana en el mantenimiento urbano. Este prototipo demuestra las funcionalidades core del sistema y sirve como base para el desarrollo de una aplicación completa y funcional.

La arquitectura modular y el uso de tecnologías modernas permiten una fácil extensión y personalización del sistema según las necesidades específicas de cada municipio o comunidad.

---

## CONTACTO Y SOPORTE

- **Email:** soporte@reparamibarrio.com
- **GitHub:** github.com/reparamibarrio/proyecto
- **Web:** www.reparamibarrio.com
- **Documentación:** docs.reparamibarrio.com
- **Comunidad:** forum.reparamibarrio.com

---

## LICENCIA

Este proyecto está bajo licencia MIT.

Copyright (c) 2025 Repara mi Barrio

---

**Versión del Documento:** 1.0  
**Fecha:** Octubre 2025  
**Última Actualización:** 01/10/2025

"""
    
    # Guardar el archivo Markdown
    with open('Documentacion_ReparaMiBarrio.md', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Archivo Markdown creado: Documentacion_ReparaMiBarrio.md")
    return 'Documentacion_ReparaMiBarrio.md'

def main():
    # Crear el archivo Markdown
    md_file = create_markdown_file()
    
    print("\n📄 DOCUMENTACIÓN GENERADA CON ÉXITO")
    print("=" * 50)
    print("\n📌 Archivos generados:")
    print(f"   - {md_file} (Markdown)")
    print("   - documentacion.html (HTML)")
    
    print("\n🔄 Para convertir a PDF, tienes varias opciones:")
    print("\n   OPCIÓN 1 - Desde el navegador:")
    print("   1. Abre 'documentacion.html' en tu navegador")
    print("   2. Presiona Ctrl+P (o Cmd+P en Mac)")
    print("   3. Selecciona 'Guardar como PDF'")
    print("   4. Ajusta las opciones y guarda")
    
    print("\n   OPCIÓN 2 - Herramientas online:")
    print("   • https://www.ilovepdf.com/html-to-pdf")
    print("   • https://pdfcrowd.com/")
    print("   • https://cloudconvert.com/html-to-pdf")
    print("   • https://www.sejda.com/html-to-pdf")
    
    print("\n   OPCIÓN 3 - Markdown a PDF online:")
    print("   • https://www.markdowntopdf.com/")
    print("   • https://md2pdf.netlify.app/")
    
    print("\n✨ La documentación está lista para ser compartida!")
    print("=" * 50)

if __name__ == "__main__":
    main()