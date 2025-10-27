import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// Generar JWT token
export const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Crear y enviar token
export const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  const cookieOptions = {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    data: {
      user,
    },
  });
};

// Middleware para proteger rutas
export const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('No estás logueado. Por favor inicia sesión para acceder.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('El usuario propietario de este token ya no existe.', 401)
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('Usuario cambió contraseña recientemente. Por favor inicia sesión nuevamente.', 401)
    );
  }

  // Grant access to protected route
  req.user = currentUser;
  next();
});

// Middleware para autenticación opcional (permite invitados)
export const optionalAuth = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (token) {
    try {
      // Verificar token
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
      
      // Verificar si el usuario existe
      const currentUser = await User.findById(decoded.id);
      if (currentUser && !currentUser.changedPasswordAfter(decoded.iat)) {
        req.user = currentUser;
      }
    } catch (error) {
      // Si hay error en el token, continuar sin usuario
      req.user = null;
    }
  }

  next();
});

// Middleware para restringir acceso por roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('No tienes permisos para realizar esta acción', 403)
      );
    }
    next();
  };
};

// Middleware para verificar si el usuario está activo
export const checkActiveUser = catchAsync(async (req, res, next) => {
  if (!req.user.isActive) {
    return next(new AppError('Tu cuenta ha sido desactivada. Contacta al soporte.', 401));
  }
  next();
});