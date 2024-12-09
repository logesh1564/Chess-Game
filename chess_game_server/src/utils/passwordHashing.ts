import crypto from "crypto";

//  Configuration
const SALT_LENGTH = 16;
const ITERATIONS = 10000;
const KEY_LENGTH = 64;
const DIGEST = "sha256";

export const getPasswordHash = (password: string) => {
  const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST)
    .toString("hex");
  return { hash, salt };
};

export const validatePassword = (
  password: string,
  hash: string,
  salt: string
) => {
   const hashToVerify = crypto
     .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST)
     .toString("hex");
    return hash === hashToVerify;
};
