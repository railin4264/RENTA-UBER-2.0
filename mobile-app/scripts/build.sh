#!/bin/bash

# Script de Build para Renta Uber Mobile App
# Uso: ./scripts/build.sh [android|ios] [debug|release]

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${BLUE}[BUILD]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Verificar argumentos
if [ $# -lt 2 ]; then
    error "Uso: $0 [android|ios] [debug|release]"
    echo "Ejemplos:"
    echo "  $0 android release"
    echo "  $0 ios debug"
    exit 1
fi

PLATFORM=$1
BUILD_TYPE=$2

# Validar argumentos
if [[ "$PLATFORM" != "android" && "$PLATFORM" != "ios" ]]; then
    error "Plataforma inválida: $PLATFORM. Debe ser 'android' o 'ios'"
    exit 1
fi

if [[ "$BUILD_TYPE" != "debug" && "$BUILD_TYPE" != "release" ]]; then
    error "Tipo de build inválido: $BUILD_TYPE. Debe ser 'debug' o 'release'"
    exit 1
fi

# Configuración
APP_NAME="RentaUberMobile"
BUILD_DIR="build"
DIST_DIR="dist"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

log "Iniciando build para $PLATFORM ($BUILD_TYPE)"

# Crear directorios de build
mkdir -p $BUILD_DIR
mkdir -p $DIST_DIR

# Limpiar builds anteriores
log "Limpiando builds anteriores..."
if [ "$PLATFORM" = "android" ]; then
    cd android && ./gradlew clean && cd ..
elif [ "$PLATFORM" = "ios" ]; then
    cd ios && xcodebuild clean -workspace $APP_NAME.xcworkspace -scheme $APP_NAME && cd ..
fi

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    log "Instalando dependencias..."
    npm install
fi

# Verificar que Metro esté funcionando
log "Verificando Metro bundler..."
if ! pgrep -f "react-native start" > /dev/null; then
    log "Iniciando Metro bundler en background..."
    npm start &
    METRO_PID=$!
    sleep 10
fi

# Build específico por plataforma
if [ "$PLATFORM" = "android" ]; then
    log "Building para Android..."
    
    if [ "$BUILD_TYPE" = "release" ]; then
        # Build de release
        cd android
        ./gradlew assembleRelease \
            -PversionCode=$TIMESTAMP \
            -PversionName="1.0.0" \
            -PappName="$APP_NAME"
        cd ..
        
        # Copiar APK
        APK_PATH="android/app/build/outputs/apk/release/app-release.apk"
        if [ -f "$APK_PATH" ]; then
            cp "$APK_PATH" "$DIST_DIR/RentaUber_Android_${BUILD_TYPE}_${TIMESTAMP}.apk"
            success "APK generado: $DIST_DIR/RentaUber_Android_${BUILD_TYPE}_${TIMESTAMP}.apk"
        else
            error "APK no encontrado en $APK_PATH"
            exit 1
        fi
    else
        # Build de debug
        cd android
        ./gradlew assembleDebug
        cd ..
        
        APK_PATH="android/app/build/outputs/apk/debug/app-debug.apk"
        if [ -f "$APK_PATH" ]; then
            cp "$APK_PATH" "$DIST_DIR/RentaUber_Android_${BUILD_TYPE}_${TIMESTAMP}.apk"
            success "APK debug generado: $DIST_DIR/RentaUber_Android_${BUILD_TYPE}_${TIMESTAMP}.apk"
        else
            error "APK debug no encontrado en $APK_PATH"
            exit 1
        fi
    fi
    
elif [ "$PLATFORM" = "ios" ]; then
    log "Building para iOS..."
    
    if [ "$BUILD_TYPE" = "release" ]; then
        # Build de release para App Store
        cd ios
        xcodebuild archive \
            -workspace $APP_NAME.xcworkspace \
            -scheme $APP_NAME \
            -configuration Release \
            -archivePath $BUILD_DIR/$APP_NAME.xcarchive \
            -allowProvisioningUpdates
        
        # Generar IPA
        xcodebuild -exportArchive \
            -archivePath $BUILD_DIR/$APP_NAME.xcarchive \
            -exportPath $BUILD_DIR \
            -exportOptionsPlist exportOptions.plist
        cd ..
        
        # Copiar IPA
        IPA_PATH="$BUILD_DIR/$APP_NAME.ipa"
        if [ -f "$IPA_PATH" ]; then
            cp "$IPA_PATH" "$DIST_DIR/RentaUber_iOS_${BUILD_TYPE}_${TIMESTAMP}.ipa"
            success "IPA generado: $DIST_DIR/RentaUber_iOS_${BUILD_TYPE}_${TIMESTAMP}.ipa"
        else
            error "IPA no encontrado en $IPA_PATH"
            exit 1
        fi
    else
        # Build de debug
        cd ios
        xcodebuild build \
            -workspace $APP_NAME.xcworkspace \
            -scheme $APP_NAME \
            -configuration Debug \
            -destination 'generic/platform=iOS'
        cd ..
        
        success "Build de debug completado para iOS"
    fi
fi

# Generar reporte de build
log "Generando reporte de build..."
cat > "$DIST_DIR/build_report_${TIMESTAMP}.txt" << EOF
Renta Uber Mobile App - Build Report
====================================

Plataforma: $PLATFORM
Tipo de Build: $BUILD_TYPE
Timestamp: $TIMESTAMP
Fecha: $(date)

Configuración:
- Node.js: $(node --version)
- npm: $(npm --version)
- React Native: $(npx react-native --version)

Dependencias:
$(npm list --depth=0 --json | jq -r '.dependencies | to_entries[] | "  - \(.key): \(.value.version)"')

Archivos generados:
$(ls -la $DIST_DIR/*$TIMESTAMP* 2>/dev/null || echo "  No se encontraron archivos de build")

Build completado exitosamente!
EOF

# Limpiar proceso de Metro si lo iniciamos
if [ ! -z "$METRO_PID" ]; then
    log "Deteniendo Metro bundler..."
    kill $METRO_PID 2>/dev/null || true
fi

# Mostrar resumen
log "=== RESUMEN DEL BUILD ==="
log "Plataforma: $PLATFORM"
log "Tipo: $BUILD_TYPE"
log "Timestamp: $TIMESTAMP"
log "Archivos generados:"
ls -la "$DIST_DIR"/*"$TIMESTAMP"* 2>/dev/null || echo "  No se encontraron archivos"

success "Build completado exitosamente!"
log "Los archivos están en el directorio: $DIST_DIR"