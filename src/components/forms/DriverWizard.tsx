import React, { useState } from 'react';
import { 
  Users, 
  Car, 
  FileText, 
  Shield, 
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Save,
  X,
  AlertTriangle
} from 'lucide-react';
import { Button, Input, Card, Badge } from '../../design-system/components';
import { useSmartForm } from '../../hooks/useSmartForm';

interface DriverFormData {
  // Información Personal
  firstName: string;
  lastName: string;
  cedula: string;
  phone: string;
  email: string;
  
  // Información de Licencia
  license: string;
  licenseExpiry: string;
  
  // Información de Contacto
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  
  // Información Laboral
  startDate: string;
  salary: number;
  commission: number;
  notes: string;
  
  // Documentos
  photo?: File;
  cedulaPhoto?: File;
  licensePhoto?: File;
  
  // Garantes
  guarantors?: Array<{
    firstName: string;
    lastName: string;
    cedula: string;
    address: string;
    phone: string;
    workplace?: string;
    googleMapsLink?: string;
  }>;
}

interface DriverWizardProps {
  initialData?: Partial<DriverFormData>;
  onSave: (data: DriverFormData) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

const STEPS = [
  {
    id: 'personal',
    title: 'Información Personal',
    icon: Users,
    description: 'Datos básicos del conductor'
  },
  {
    id: 'license',
    title: 'Licencia y Documentos',
    icon: FileText,
    description: 'Información de licencia y documentos'
  },
  {
    id: 'contact',
    title: 'Contacto y Emergencia',
    icon: Shield,
    description: 'Dirección y contactos de emergencia'
  },
  {
    id: 'employment',
    title: 'Información Laboral',
    icon: Car,
    description: 'Salario, comisiones y notas'
  },
  {
    id: 'guarantors',
    title: 'Garantes',
    icon: Shield,
    description: 'Información de garantes'
  },
  {
    id: 'review',
    title: 'Revisar y Guardar',
    icon: CheckCircle,
    description: 'Revisar toda la información'
  }
];

export default function DriverWizard({ 
  initialData = {}, 
  onSave, 
  onCancel, 
  isEditing = false 
}: DriverWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data,
    setData,
    errors,
    isValid,
    isDirty,
    isSaving,
    reset,
    save,
    updateField,
    hasUnsavedChanges
  } = useSmartForm<DriverFormData>({
    initialData: {
      firstName: '',
      lastName: '',
      cedula: '',
      phone: '',
      email: '',
      license: '',
      licenseExpiry: '',
      address: '',
      emergencyContact: '',
      emergencyPhone: '',
      startDate: '',
      salary: 0,
      commission: 0,
      notes: '',
      guarantors: [],
      ...initialData
    },
    storageKey: `driver_form_${isEditing ? 'edit' : 'new'}`,
    autoSaveDelay: 30000,
  });

  const currentStepData = STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === STEPS.length - 1;
  const canProceed = isValid && isDirty;

  const handleNext = () => {
    if (canProceed && !isLastStep) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    
    setIsSubmitting(true);
    try {
      await onSave(data);
      // Assuming showSuccess and showError are defined elsewhere or will be added
      // For now, we'll just log success
      console.log('Conductor guardado correctamente'); 
    } catch (error) {
      // Assuming showError is defined elsewhere or will be added
      console.error('Error al guardar el conductor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Personal
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nombre"
                value={data.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                error={errors.firstName}
                fullWidth
                required
              />
              
              <Input
                label="Apellido"
                value={data.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                error={errors.lastName}
                fullWidth
                required
              />
              
              <Input
                label="Cédula"
                value={data.cedula}
                onChange={(e) => updateField('cedula', e.target.value)}
                error={errors.cedula}
                fullWidth
                required
              />
              
              <Input
                label="Teléfono"
                type="tel"
                value={data.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                error={errors.phone}
                fullWidth
                required
              />
              
              <Input
                label="Email"
                type="email"
                value={data.email}
                onChange={(e) => updateField('email', e.target.value)}
                error={errors.email}
                fullWidth
                required
              />
            </div>
          </div>
        );

      case 1: // License
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Número de Licencia"
                value={data.license}
                onChange={(e) => updateField('license', e.target.value)}
                error={errors.license}
                fullWidth
                required
              />
              
              <Input
                label="Fecha de Vencimiento"
                type="date"
                value={data.licenseExpiry}
                onChange={(e) => updateField('licenseExpiry', e.target.value)}
                error={errors.licenseExpiry}
                fullWidth
                required
              />
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Documentos</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto del Conductor
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => updateField('photo', e.target.files?.[0])}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Subir Foto
                  </label>
                </div>
                
                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto de Cédula
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => updateField('cedulaPhoto', e.target.files?.[0])}
                    className="hidden"
                    id="cedula-upload"
                  />
                  <label
                    htmlFor="cedula-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Subir Cédula
                  </label>
                </div>
                
                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto de Licencia
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => updateField('licensePhoto', e.target.files?.[0])}
                    className="hidden"
                    id="license-upload"
                  />
                  <label
                    htmlFor="license-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Subir Licencia
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Contact
        return (
          <div className="space-y-6">
            <Input
              label="Dirección"
              value={data.address}
              onChange={(e) => updateField('address', e.target.value)}
              error={errors.address}
              fullWidth
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Contacto de Emergencia"
                value={data.emergencyContact}
                onChange={(e) => updateField('emergencyContact', e.target.value)}
                error={errors.emergencyContact}
                fullWidth
                required
              />
              
              <Input
                label="Teléfono de Emergencia"
                type="tel"
                value={data.emergencyPhone}
                onChange={(e) => updateField('emergencyPhone', e.target.value)}
                error={errors.emergencyPhone}
                fullWidth
                required
              />
            </div>
          </div>
        );

      case 3: // Employment
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Fecha de Inicio"
                type="date"
                value={data.startDate}
                onChange={(e) => updateField('startDate', e.target.value)}
                error={errors.startDate}
                fullWidth
                required
              />
              
              <Input
                label="Salario Base"
                type="number"
                value={data.salary}
                onChange={(e) => updateField('salary', parseFloat(e.target.value) || 0)}
                error={errors.salary}
                fullWidth
                required
              />
              
              <Input
                label="Comisión (%)"
                type="number"
                value={data.commission}
                onChange={(e) => updateField('commission', parseFloat(e.target.value) || 0)}
                error={errors.commission}
                fullWidth
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas Adicionales
              </label>
              <textarea
                value={data.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Información adicional sobre el conductor..."
              />
            </div>
          </div>
        );

      case 4: // Guarantors
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-gray-900">Garantes</h4>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const newGuarantor = {
                    firstName: '',
                    lastName: '',
                    cedula: '',
                    address: '',
                    phone: '',
                    workplace: '',
                    googleMapsLink: ''
                  };
                  updateField('guarantors', [...(data.guarantors || []), newGuarantor]);
                }}
              >
                Agregar Garante
              </Button>
            </div>
            
            <div className="space-y-4">
              {(data.guarantors || []).map((guarantor, index) => (
                <Card key={index} padding="md" className="border-2 border-dashed border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-md font-medium text-gray-900">Garante {index + 1}</h5>
                    <Button
                      variant="error"
                      size="sm"
                      onClick={() => {
                        const newGuarantors = data.guarantors?.filter((_, i) => i !== index);
                        updateField('guarantors', newGuarantors);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nombre"
                      value={guarantor.firstName}
                      onChange={(e) => {
                        const newGuarantors = [...(data.guarantors || [])];
                        newGuarantors[index].firstName = e.target.value;
                        updateField('guarantors', newGuarantors);
                      }}
                      fullWidth
                    />
                    
                    <Input
                      label="Apellido"
                      value={guarantor.lastName}
                      onChange={(e) => {
                        const newGuarantors = [...(data.guarantors || [])];
                        newGuarantors[index].lastName = e.target.value;
                        updateField('guarantors', newGuarantors);
                      }}
                      fullWidth
                    />
                    
                    <Input
                      label="Cédula"
                      value={guarantor.cedula}
                      onChange={(e) => {
                        const newGuarantors = [...(data.guarantors || [])];
                        newGuarantors[index].cedula = e.target.value;
                        updateField('guarantors', newGuarantors);
                      }}
                      fullWidth
                    />
                    
                    <Input
                      label="Teléfono"
                      type="tel"
                      value={guarantor.phone}
                      onChange={(e) => {
                        const newGuarantors = [...(data.guarantors || [])];
                        newGuarantors[index].phone = e.target.value;
                        updateField('guarantors', newGuarantors);
                      }}
                      fullWidth
                    />
                    
                    <Input
                      label="Dirección"
                      value={guarantor.address}
                      onChange={(e) => {
                        const newGuarantors = [...(data.guarantors || [])];
                        newGuarantors[index].address = e.target.value;
                        updateField('guarantors', newGuarantors);
                      }}
                      fullWidth
                    />
                    
                    <Input
                      label="Lugar de Trabajo"
                      value={guarantor.workplace || ''}
                      onChange={(e) => {
                        const newGuarantors = [...(data.guarantors || [])];
                        newGuarantors[index].workplace = e.target.value;
                        updateField('guarantors', newGuarantors);
                      }}
                      fullWidth
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 5: // Review
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-800">Revisar Información</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Revisa toda la información antes de guardar. Los datos se han guardado automáticamente.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Nombre:</span> {data.firstName} {data.lastName}</p>
                  <p><span className="font-medium">Cédula:</span> {data.cedula}</p>
                  <p><span className="font-medium">Teléfono:</span> {data.phone}</p>
                  <p><span className="font-medium">Email:</span> {data.email}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Información Laboral</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Fecha de Inicio:</span> {data.startDate}</p>
                  <p><span className="font-medium">Salario:</span> ${data.salary.toLocaleString()}</p>
                  <p><span className="font-medium">Comisión:</span> {data.commission}%</p>
                  <p><span className="font-medium">Garantes:</span> {data.guarantors?.length || 0}</p>
                </div>
              </div>
            </div>
            
            {hasUnsavedChanges && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">Cambios sin guardar</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Tienes cambios sin guardar. Haz clic en "Guardar" para confirmar.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header del Wizard */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Editar Conductor' : 'Nuevo Conductor'}
            </h1>
            <p className="text-gray-600">
              {currentStepData.description}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {hasUnsavedChanges && (
              <Badge variant="warning" size="sm">
                Cambios sin guardar
              </Badge>
            )}
            
            <Button
              variant="secondary"
              size="sm"
              onClick={onCancel}
            >
              Cancelar
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              const Icon = step.icon;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isActive 
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  
                  {index < STEPS.length - 1 && (
                    <div className={`w-16 h-0.5 mx-2 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 text-center">
            <h3 className="text-lg font-medium text-gray-900">
              {currentStepData.title}
            </h3>
            <p className="text-sm text-gray-500">
              Paso {currentStep + 1} de {STEPS.length}
            </p>
          </div>
        </div>
      </div>

      {/* Contenido del Paso */}
      <Card padding="lg">
        {renderStepContent()}
      </Card>

      {/* Navegación */}
      <div className="flex items-center justify-between mt-8">
        <div className="flex items-center space-x-3">
          {!isFirstStep && (
            <Button
              variant="secondary"
              onClick={handlePrevious}
              icon={<ArrowLeft className="h-4 w-4" />}
            >
              Anterior
            </Button>
          )}
          
          <Button
            variant="secondary"
            onClick={reset}
            disabled={!isDirty}
          >
            Resetear
          </Button>
        </div>
        
        <div className="flex items-center space-x-3">
          {!isLastStep ? (
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!canProceed}
              icon={<ArrowRight className="h-4 w-4" />}
              iconPosition="right"
            >
              Siguiente
            </Button>
          ) : (
            <Button
              variant="success"
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              loading={isSubmitting}
              icon={<Save className="h-4 w-4" />}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Conductor'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}