const Joi = require("joi");
const dotenv = require("dotenv");

dotenv.config();

const envSchema = Joi.object({
  PORT: Joi.number().default(5000).required(),
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  MONGO_URI: Joi.string().uri().required(),
  API_VERSION: Joi.string().default("/api/v1"),
  JWT_SECRET: Joi.string().required(),
  ACCESS_TOKEN_SECRET: Joi.string().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  SUPER_ADMIN_EMAIL: Joi.string().email().required(),
  SUPER_ADMIN_PASSWORD: Joi.string().min(6).required(),
}).unknown(true);

const { value: envVars, error } = envSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const env = {
  PORT: envVars.PORT,
  NODE_ENV: envVars.NODE_ENV,
  MONGO_URI: envVars.MONGO_URI,
  API_VERSION: envVars.API_VERSION,
  JWT: {
    SECRET: envVars.JWT_SECRET,
    ACCESS_TOKEN: envVars.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN: envVars.REFRESH_TOKEN_SECRET,
  },
  SUPER_ADMIN: {
    EMAIL: envVars.SUPER_ADMIN_EMAIL,
    PASSWORD: envVars.SUPER_ADMIN_PASSWORD,
  },
};

module.exports = env;
