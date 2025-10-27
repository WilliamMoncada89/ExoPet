import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { createSendToken } from '../middleware/auth.js';
import crypto from 'crypto';

// Registro de usuario
export const register = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password, phone, role } = req.body;

  // Validaciones básicas
  if (!firstName || !lastName || !email || !password) {
    return next(new AppError('Todos los campos obligatorios deben ser completados', 400));
  }

  // Verificar si el email ya existe
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Ya existe un usuario con este email', 400));
  }

  // Crear nuevo usuario
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone,
    role: role || 'user' // Por defecto es 'user', solo admin puede crear otros admin
  });

  // Enviar token
  createSendToken(newUser, 201, res);
});

// Login de usuario
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Verificar si email y password existen
  if (!email || !password) {
    return next(new AppError('Por favor proporciona email y contraseña', 400));
  }

  // 2) Verificar si el usuario existe y la contraseña es correcta
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Email o contraseña incorrectos', 401));
  }

  // 3) Verificar si el usuario está activo
  if (!user.isActive) {
    return next(new AppError('Tu cuenta ha sido desactivada. Contacta al soporte.', 401));
  }

  // 4) Actualizar último login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // 5) Si todo está bien, enviar token al cliente
  createSendToken(user, 200, res);
});

// Logout
export const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ success: true });
};

// Verificar token
export const verifyToken = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user
    }
  });
});

// Obtener perfil
export const getProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  res.status(200).json({
    success: true,
    data: {
      user
    }
  });
});

// Actualizar perfil
export const updateProfile = catchAsync(async (req, res, next) => {
  // 1) Crear objeto de error si el usuario intenta actualizar la contraseña
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('Esta ruta no es para actualizar contraseñas. Usa /change-password.', 400)
    );
  }

  // 2) Campos permitidos para actualizar
  const allowedFields = ['firstName', 'lastName', 'phone', 'dateOfBirth', 'gender', 'preferences'];
  const filteredBody = {};
  
  Object.keys(req.body).forEach(el => {
    if (allowedFields.includes(el)) {
      filteredBody[el] = req.body[el];
    }
  });

  // 3) Actualizar documento del usuario
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: {
      user: updatedUser
    }
  });
});

// Cambiar contraseña
export const changePassword = catchAsync(async (req, res, next) => {
  // 1) Obtener usuario de la base de datos
  const user = await User.findById(req.user.id).select('+password');

  // 2) Verificar si la contraseña actual es correcta
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Tu contraseña actual es incorrecta.', 401));
  }

  // 3) Si es así, actualizar contraseña
  user.password = req.body.password;
  user.passwordChangedAt = new Date();
  await user.save();

  // 4) Loguear usuario, enviar JWT
  createSendToken(user, 200, res);
});

// Olvidé mi contraseña
export const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Obtener usuario basado en el email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('No hay usuario con ese email.', 404));
  }

  // 2) Generar token aleatorio
  const resetToken = crypto.randomBytes(32).toString('hex');

  user.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutos

  await user.save({ validateBeforeSave: false });

  // 3) Enviar por email (por ahora solo devolvemos el token)
  try {
    res.status(200).json({
      success: true,
      message: 'Token enviado al email!',
      resetToken // En producción, esto se enviaría por email
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('Hubo un error enviando el email. Intenta de nuevo más tarde.', 500)
    );
  }
});

// Resetear contraseña
export const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Obtener usuario basado en el token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) Si el token no ha expirado y hay usuario, establecer nueva contraseña
  if (!user) {
    return next(new AppError('Token inválido o expirado', 400));
  }
  
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangedAt = new Date();
  await user.save();

  // 3) Actualizar changedPasswordAt para el usuario (hecho en middleware)

  // 4) Loguear usuario, enviar JWT
  createSendToken(user, 200, res);
});

// Crear usuario admin (solo para admins existentes)
export const createAdmin = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone, dateOfBirth, gender } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Ya existe un usuario con este correo electrónico', 400));
    }

    // Crear nuevo usuario admin
    const newAdmin = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
      role: 'admin',
      isActive: true,
      isEmailVerified: true // Los admins se consideran verificados automáticamente
    });

    // No enviar la contraseña en la respuesta
    newAdmin.password = undefined;

    res.status(201).json({
      success: true,
      message: 'Usuario administrador creado exitosamente',
      data: {
        user: newAdmin
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obtener todos los usuarios (solo para admins)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password -passwordResetToken -passwordResetExpires');
    
    res.status(200).json({
      success: true,
      results: users.length,
      data: {
        users
      }
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar rol de usuario (solo para admins)
export const updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return next(new AppError('Rol inválido. Debe ser "user" o "admin"', 400));
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return next(new AppError('Usuario no encontrado', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Rol de usuario actualizado exitosamente',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};