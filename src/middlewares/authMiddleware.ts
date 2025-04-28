// authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

async function authenticateToken(req: Request,res: Response,  next: NextFunction
) {
  const authHeader = req.get('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  if (!token) {
    return res.status(401).json({ 
      code: 'MISSING_TOKEN',
      message: 'Authentication token is required' 
    });}
// authMiddleware.ts
jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
  if (err) {
    return res.status(403).json({
      code: 'INVALID_TOKEN',
      message: 'Invalid authentication token'
    });}
  
  // Asegúrate que el payload tenga userType
  req.user = {
    id: decoded.id,
    userType: decoded.userType || decoded.userType // Usa el nombre correcto de tu campo
  };
  
  next();
});}

async function isAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      code: 'UNAUTHORIZED',
      message: 'Authentication required'
    });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (decoded.userType !== 'Admin') {
      return res.status(403).json({
        code: 'FORBIDDEN',
        message: 'Admin privileges required'
      });
    }

    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
}
export {authenticateToken, isAdmin}