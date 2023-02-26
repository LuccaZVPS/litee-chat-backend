import { Router } from "express";
import { adptRoute } from "../adapters/express-route";
import { makeAuthenticationController } from "../factories/controllers/account/authentication-controller-factory";
import { makeCreateAccountController } from "../factories/controllers/account/create-account-controller-factory";
import { makeEmailVerifyController } from "../factories/controllers/account/email-verify-controller-factory";
import { makeUpdateImageController } from "../factories/controllers/account/update-image-controller-factory";

const router = Router();
router.post("/signup", adptRoute(makeCreateAccountController()));
router.post("/login", adptRoute(makeAuthenticationController()));
router.put("/image", adptRoute(makeUpdateImageController()));
router.put("/verify/:id/:password", adptRoute(makeEmailVerifyController()));
export default router;
