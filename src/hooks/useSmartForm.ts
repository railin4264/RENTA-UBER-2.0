import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';

interface UseSmartFormOptions<T> {
  initialData: T;
  validationSchema?: any;
  autoSaveDelay?: number;
  storageKey?: string;
  onAutoSave?: (data: T) => void;
  onValidationChange?: (isValid: boolean, errors: Record<string, string>) => void;
}

interface UseSmartFormReturn<T> {
  data: T;
  setData: (data: T | ((prev: T) => T)) => void;
  errors: Record<string, string>;
  isValid: boolean;
  isDirty: boolean;
  isSaving: boolean;
  reset: () => void;
  save: () => Promise<void>;
  updateField: <K extends keyof T>(field: K, value: T[K]) => void;
  hasUnsavedChanges: boolean;
}

export function useSmartForm<T extends Record<string, any>>({
  initialData,
  validationSchema,
  autoSaveDelay = 30000, // 30 segundos
  storageKey,
  onAutoSave,
  onValidationChange,
}: UseSmartFormOptions<T>): UseSmartFormReturn<T> {
  const [data, setDataState] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedDataRef = useRef<T>(initialData);
  
  // Cargar datos guardados al inicializar
  useEffect(() => {
    if (storageKey) {
      try {
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setDataState(parsedData);
          lastSavedDataRef.current = parsedData;
          toast.success('Datos recuperados del borrador');
        }
      } catch (error) {
        console.error('Error al cargar datos guardados:', error);
      }
    }
  }, [storageKey]);
  
  // Validación en tiempo real
  const validateData = useCallback((dataToValidate: T): Record<string, string> => {
    if (!validationSchema) return {};
    
    try {
      validationSchema.parse(dataToValidate);
      return {};
    } catch (error: any) {
      const validationErrors: Record<string, string> = {};
      if (error.errors) {
        error.errors.forEach((err: any) => {
          if (err.path) {
            validationErrors[err.path[0]] = err.message;
          }
        });
      }
      return validationErrors;
    }
  }, [validationSchema]);
  
  // Actualizar validación cuando cambian los datos
  useEffect(() => {
    const newErrors = validateData(data);
    setErrors(newErrors);
    
    const isValid = Object.keys(newErrors).length === 0;
    onValidationChange?.(isValid, newErrors);
  }, [data, validateData, onValidationChange]);
  
  // Función para actualizar un campo específico
  const updateField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setDataState(prev => {
      const newData = { ...prev, [field]: value };
      setIsDirty(true);
      setHasUnsavedChanges(true);
      return newData;
    });
  }, []);
  
  // Función para establecer datos
  const setData = useCallback((newData: T | ((prev: T) => T)) => {
    setDataState(prev => {
      const actualData = typeof newData === 'function' ? newData(prev) : newData;
      setIsDirty(true);
      setHasUnsavedChanges(true);
      return actualData;
    });
  }, []);
  
  // Autoguardado
  useEffect(() => {
    if (isDirty && storageKey) {
      // Limpiar timeout anterior
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      // Configurar nuevo timeout
      autoSaveTimeoutRef.current = setTimeout(() => {
        try {
          localStorage.setItem(storageKey, JSON.stringify(data));
          lastSavedDataRef.current = data;
          onAutoSave?.(data);
          toast.success('Datos guardados automáticamente');
        } catch (error) {
          console.error('Error en autoguardado:', error);
          toast.error('Error al guardar automáticamente');
        }
      }, autoSaveDelay);
    }
    
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [data, isDirty, storageKey, autoSaveDelay, onAutoSave]);
  
  // Función para guardar manualmente
  const save = useCallback(async () => {
    if (Object.keys(errors).length > 0) {
      toast.error('Por favor corrige los errores antes de guardar');
      return;
    }
    
    setIsSaving(true);
    try {
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(data));
        lastSavedDataRef.current = data;
      }
      
      setHasUnsavedChanges(false);
      setIsDirty(false);
      toast.success('Datos guardados correctamente');
    } catch (error) {
      console.error('Error al guardar:', error);
      toast.error('Error al guardar los datos');
    } finally {
      setIsSaving(false);
    }
  }, [data, errors, storageKey]);
  
  // Función para resetear
  const reset = useCallback(() => {
    setDataState(initialData);
    setErrors({});
    setIsDirty(false);
    setHasUnsavedChanges(false);
    lastSavedDataRef.current = initialData;
    
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
    
    toast.success('Formulario reseteado');
  }, [initialData, storageKey]);
  
  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);
  
  return {
    data,
    setData,
    errors,
    isValid: Object.keys(errors).length === 0,
    isDirty,
    isSaving,
    reset,
    save,
    updateField,
    hasUnsavedChanges,
  };
}