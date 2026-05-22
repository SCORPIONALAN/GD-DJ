import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';

const COOKIE_NAME = 'gd_token';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 días en ms

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

/** Setea la cookie httpOnly con el token */
const setTokenCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge:   COOKIE_MAX_AGE,
  });
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    if (!admin.isActive) {
      return res.status(401).json({ message: 'Esta cuenta fue deshabilitada' });
    }

    const passwordOk = await bcrypt.compare(password, admin.password);
    if (!passwordOk) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    const token = signToken(admin._id);
    setTokenCookie(res, token);

    res.json({
      admin: {
        id:    admin._id,
        name:  admin.name,
        email: admin.email,
        role:  admin.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existe = await Admin.findOne({ email });
    if (existe) {
      return res.status(400).json({ message: 'Ya existe un administrador con ese email' });
    }

    const admin = await Admin.create({ name, email, password, role });

    const token = signToken(admin._id);
    setTokenCookie(res, token);

    res.status(201).json({
      admin: {
        id:    admin._id,
        name:  admin.name,
        email: admin.email,
        role:  admin.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// GET /api/auth/me
export const me = (req, res) => {
  res.json({
    id:        req.admin._id,
    name:      req.admin.name,
    email:     req.admin.email,
    role:      req.admin.role,
    lastLogin: req.admin.lastLogin,
  });
};

// POST /api/auth/logout
export const logout = (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  });
  res.json({ message: 'Sesion cerrada correctamente' });
};

// PATCH /api/auth/change-password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.admin._id).select('+password');

    const passwordOk = await bcrypt.compare(currentPassword, admin.password);
    if (!passwordOk) {
      return res.status(401).json({ message: 'La contrasena actual es incorrecta' });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ message: 'Contrasena actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
