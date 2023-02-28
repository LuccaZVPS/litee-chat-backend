import { GeneratePasswordAdapter } from "../../../src/infra/utils/generate-password-adapter";

const generateSecret = new GeneratePasswordAdapter();
export const randomSecret = generateSecret.generate();
