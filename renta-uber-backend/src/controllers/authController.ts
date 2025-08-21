import { Request, Response } from 'express';
import { 
  registerUser, 
  loginUser, 
  verifyToken as verifyTokenService, 
  changePassword as changePasswordService, 
  getUserProfile, 
  updateUserProfile 
} from '../services/authService';
import { asyncHandler } from '../utils/errorHandler';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

// Login completo
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: LoginRequest = req.body;

  // Validar campos requeridos
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email y contraseña son requeridos'
    });
  }

  try {
    const result = await loginUser(email.toLowerCase(), password);
    
    res.json({
      success: true,
      message: 'Login exitoso',
      data: result
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message || 'Credenciales inválidas'
    });
  }
});

// Registro completo
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, role = 'user' }: RegisterRequest = req.body;

  // Validar campos requeridos
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({
      success: false,
      message: 'Todos los campos son requeridos'
    });
  }

  try {
    await registerUser({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      role
    });

    // Generar token para el nuevo usuario
    const loginResult = await loginUser(email.toLowerCase(), password);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: loginResult
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error al registrar usuario'
    });
  }
});

// Verificar token completo
export const verifyToken = asyncHandler(async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token no proporcionado'
    });
  }

  try {
    const user = await verifyTokenService(token);
    
    res.json({
      success: true,
      message: 'Token válido',
      data: {
        user
      }
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message || 'Token inválido'
    });
  }
});

// Logout
export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Logout exitoso'
  });
});

// Cambiar contraseña completo
export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Usuario no autenticado'
    });
  }

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Contraseña actual y nueva contraseña son requeridas'
    });
  }

  try {
    const result = await changePasswordService(userId, currentPassword, newPassword);
    
    res.json({
      success: true,
      message: result.message
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error al cambiar contraseña'
    });
  }
});

// Perfil de usuario completo
export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Usuario no autenticado'
    });
  }

  try {
    const user = await getUserProfile(userId);
    
    res.json({
      success: true,
      data: {
        user
      }
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || 'Usuario no encontrado'
    });
  }
});

// Actualizar perfil de usuario
export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { firstName, lastName, email } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Usuario no autenticado'
    });
  }

  try {
    const user = await updateUserProfile(userId, { firstName, lastName, email });
    
    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: {
        user
      }
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error al actualizar perfil'
    });
  }
});