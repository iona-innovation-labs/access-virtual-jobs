import crypto from "crypto";

export function generateEmailVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}