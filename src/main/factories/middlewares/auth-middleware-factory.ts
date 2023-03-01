import { AuthMiddleware } from "../../../presentation/middlewares/auth-middleware";

export const makeAuthMiddleware = () => new AuthMiddleware();
