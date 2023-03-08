import rateLimit from "express-rate-limit";
import MongoStore from "rate-limit-mongo";
export const makeRateLimit = (max: number, minutes: number) => {
  return rateLimit({
    windowMs: minutes * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    store: new MongoStore({
      uri: process.env.MONGODB_URL,
      expireTimeMs: minutes * 60 * 1000,
      errorHandler: console.error.bind(null, "rate-limit-mongo"),
      // see Configuration section for more options and details
    }),
  });
};
