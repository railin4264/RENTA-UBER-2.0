import { PrismaClient } from '@prisma/client';
import type { User } from '@prisma/client';
const bcrypt = require('bcryptjs');
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export const registerUser = async (userData: RegisterData): Promise<User> => {
  // Verificar si el usuario ya existe
  const existingUser = await prisma.user.findUnique({ where: { email: userData.email } });
  if (existingUser) {
    throw new Error('El usuario ya existe');
  }

  const hashedPassword = await bcrypt.hash(userData.password, 12);
  
  return prisma.user.create({
    data: {
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || 'user',
    },
  });
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Credenciales inválidas');
  }

  const token = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    }, 
    JWT_SECRET, 
    { expiresIn: '7d' }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    }
  };
};

export const verifyToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  } catch (error) {
    throw new Error('Token inválido');
  }
};

export const changePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new Error('Contraseña actual incorrecta');
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 12);
  
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword }
  });

  return { message: 'Contraseña actualizada correctamente' };
};

export const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({ 
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    }
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  return user;
};

export const updateUserProfile = async (userId: string, data: Partial<{ firstName: string; lastName: string; email: string }>) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    }
  });

  return user;
};