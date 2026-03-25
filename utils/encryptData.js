const crypto = require("crypto");

// Config
const env = require("../config/env");

const SECRET_KEY = crypto
  .createHash("sha256")
  .update(env.ENCRYPTION_SECRET)
  .digest();

const IV_LENGTH = 12;

// Encrypt
exports.encrypt = (data) => {
  if (!data) return data;

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    env.ENCRYPTION_ALGORITHM,
    SECRET_KEY,
    iv,
  );

  let encrypted = cipher.update(JSON.stringify(data), "utf8", "base64");
  encrypted += cipher.final("base64");

  const tag = cipher.getAuthTag();

  return `${iv.toString("base64")}:${tag.toString("base64")}:${encrypted}`;
};

// Decrypt
exports.decrypt = (encryptedData) => {
  if (!encryptedData) return encryptedData;

  const [ivStr, tagStr, encrypted] = encryptedData.split(":");

  const iv = Buffer.from(ivStr, "base64");
  const tag = Buffer.from(tagStr, "base64");

  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(encrypted, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return JSON.parse(decrypted);
};

// Encrypt object values
exports.encryptObjectValues = (obj) => {
  const encryptedObj = {};
  for (const key in obj) {
    encryptedObj[key] = exports.encrypt(obj[key]);
  }
  return encryptedObj;
};

// Decrypt object values
exports.decryptObjectValues = (obj) => {
  const decryptedObj = {};
  for (const key in obj) {
    decryptedObj[key] = exports.decrypt(obj[key]);
  }
  return decryptedObj;
};
