import { Router } from "express";
import { adaptMiddeware } from "../adapters/express-middleware";
import { adptRoute } from "../adapters/express-route";
import { makeAuthenticationController } from "../factories/controllers/account/authentication-controller-factory";
import { makeChangePasswordController } from "../factories/controllers/account/change-password-controller-factory";
import { makeCreateAccountController } from "../factories/controllers/account/create-account-controller-factory";
import { makeEmailVerifyController } from "../factories/controllers/account/email-verify-controller-factory";
import { makeRequestPasswordChangeController } from "../factories/controllers/account/request-password-change-controller-factory";
import { makeUpdateImageController } from "../factories/controllers/account/update-image-controller-factory";
import { makeVerifyChangeRequest } from "../factories/controllers/account/verify-change-request-factory";
import { makeAuthMiddleware } from "../factories/middlewares/auth-middleware-factory";

const router = Router();
router.post("/signup", adptRoute(makeCreateAccountController()));
router.post("/login", adptRoute(makeAuthenticationController()));
router.put(
  "/image",
  adaptMiddeware(makeAuthMiddleware()),
  adptRoute(makeUpdateImageController())
);
router.put("/verify/:_id/:password", adptRoute(makeEmailVerifyController()));
router.post(
  "/change-password",
  adptRoute(makeRequestPasswordChangeController())
);
router.get(
  "/change-password/:_id/:secret",
  adptRoute(makeVerifyChangeRequest())
);
router.put(
  "/change-password/:_id/:secret",
  adptRoute(makeChangePasswordController())
);

export default router;
