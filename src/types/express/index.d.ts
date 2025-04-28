// types/express/index.d.ts
import { UserRole } from "../path/to/your/roles"; // opcional si tenés enums, etc.

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        userType: string;
      };
    }
  }
}
