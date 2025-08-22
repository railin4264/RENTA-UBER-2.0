import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
}

interface Vehicle {
  id: string;
  plate: string;
  model: string;
  status: string;
}

interface Contract {
  id: string;
  driverId: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
}

interface Expense {
  id: string;
  amount: number;
  category: string;
}

interface AppState {
  drivers: Driver[];
  vehicles: Vehicle[];
  contracts: Contract[];
  payments: Payment[];
  expenses: Expense[];
  loading: boolean;
  error: string | null;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

type AppAction = 
  | { type: 'SET_DRIVERS'; payload: Driver[] }
  | { type: 'ADD_DRIVER'; payload: Driver }
  | { type: 'UPDATE_DRIVER'; payload: Driver }
  | { type: 'DELETE_DRIVER'; payload: string }
  | { type: 'SET_VEHICLES'; payload: Vehicle[] }
  | { type: 'ADD_VEHICLE'; payload: Vehicle }
  | { type: 'UPDATE_VEHICLE'; payload: Vehicle }
  | { type: 'DELETE_VEHICLE'; payload: string }
  | { type: 'SET_CONTRACTS'; payload: Contract[] }
  | { type: 'ADD_CONTRACT'; payload: Contract }
  | { type: 'UPDATE_CONTRACT'; payload: Contract }
  | { type: 'DELETE_CONTRACT'; payload: string }
  | { type: 'SET_PAYMENTS'; payload: Payment[] }
  | { type: 'ADD_PAYMENT'; payload: Payment }
  | { type: 'UPDATE_PAYMENT'; payload: Payment }
  | { type: 'DELETE_PAYMENT'; payload: string }
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string };

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearError: () => void;
}

const initialState: AppState = {
  user: null,
  drivers: [],
  vehicles: [],
  payments: [],
  expenses: [],
  contracts: [],
  loading: false,
  error: null,
  notifications: []
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_DRIVERS':
      return { ...state, drivers: action.payload };
    
    case 'SET_VEHICLES':
      return { ...state, vehicles: action.payload };
    
    case 'SET_PAYMENTS':
      return { ...state, payments: action.payload };
    
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload };
    
    case 'SET_CONTRACTS':
      return { ...state, contracts: action.payload };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [...state.notifications, { ...action.payload, id: Date.now().toString() }]
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    
    case 'ADD_DRIVER':
      return { ...state, drivers: [...state.drivers, action.payload] };
    
    case 'UPDATE_DRIVER':
      return {
        ...state,
        drivers: state.drivers.map(driver => 
          driver.id === action.payload.id ? action.payload : driver
        )
      };
    
    case 'DELETE_DRIVER':
      return {
        ...state,
        drivers: state.drivers.filter(driver => driver.id !== action.payload)
      };
    
    case 'ADD_VEHICLE':
      return { ...state, vehicles: [...state.vehicles, action.payload] };
    
    case 'UPDATE_VEHICLE':
      return {
        ...state,
        vehicles: state.vehicles.map(vehicle => 
          vehicle.id === action.payload.id ? action.payload : vehicle
        )
      };
    
    case 'DELETE_VEHICLE':
      return {
        ...state,
        vehicles: state.vehicles.filter(vehicle => vehicle.id !== action.payload)
      };
    
    case 'ADD_PAYMENT':
      return { ...state, payments: [...state.payments, action.payload] };
    
    case 'UPDATE_PAYMENT':
      return {
        ...state,
        payments: state.payments.map(payment => 
          payment.id === action.payload.id ? action.payload : payment
        )
      };
    
    case 'DELETE_PAYMENT':
      return {
        ...state,
        payments: state.payments.filter(payment => payment.id !== action.payload)
      };
    
    default:
      return state;
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    
    // Auto-remove notification after duration
    if (notification.duration !== undefined) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: Date.now().toString() });
      }, notification.duration);
    }
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, addNotification, removeNotification, clearError }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 