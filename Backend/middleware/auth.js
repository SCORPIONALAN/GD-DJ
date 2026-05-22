import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const protect = async (req, res, next) => {
  try {
    // Acepta token desde cookie httpOnly o desde header Authorization (fallback para clientes móviles/API)
    let token = req.cookies?.gd_token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      return res.status(401).json({ message: 'Accion no autorizada - No existe token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id);
    if (!admin)          return res.status(401).json({ message: 'El administrador no existe' });
    if (!admin.isActive) return res.status(401).json({ message: 'Esta cuenta fue deshabilitada' });

    req.admin = admin;
    next();
  } catch {
    return res.status(401).json({ message: 'Token invalido o expirado' });
  }
};

// Uso: protect, authorize('superadmin')
export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.admin.role)) {
    return res.status(403).json({ message: 'No tienes permiso para esta accion' });
  }
  next();
};
