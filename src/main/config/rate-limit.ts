import rateLimit from "express-rate-limit";
export const makeRateLimit = (max: number, minutes: number) => {
  return rateLimit({
    windowMs: minutes * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
  });
};
