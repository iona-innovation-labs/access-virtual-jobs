import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

if (!accountSid || !authToken || !verifyServiceSid) {
  throw new Error("Missing Twilio environment variables");
}

const client = twilio(accountSid, authToken);
const verifyService = client.verify.v2.services(verifyServiceSid);

export interface VerificationResult {
  success: boolean;
  message: string;
  status?: string;
}

export class TwilioService {
  /**
   * Send verification code to phone number
   */
  static async sendVerificationCode(
    phoneNumber: string
  ): Promise<VerificationResult> {
    try {
      // Format phone number for Philippines (+63)
      const formattedPhone = this.formatPhilippinePhone(phoneNumber);

      const verification = await verifyService.verifications.create({
        to: formattedPhone,
        channel: "sms",
      });

      return {
        success: true,
        message: "Verification code sent successfully",
        status: verification.status,
      };
    } catch (error: any) {
      console.error("Twilio send verification error:", error);

      // Handle specific Twilio errors
      if (error.code === 60200) {
        return {
          success: false,
          message:
            "Invalid phone number format. Please enter a valid Philippine phone number.",
        };
      }

      if (error.code === 60202) {
        return {
          success: false,
          message: "Too many verification attempts. Please try again later.",
        };
      }

      return {
        success: false,
        message: "Failed to send verification code. Please try again.",
      };
    }
  }

  /**
   * Verify the code sent to phone number
   */
  static async verifyCode(
    phoneNumber: string,
    code: string
  ): Promise<VerificationResult> {
    try {
      // Format phone number for Philippines (+63)
      const formattedPhone = this.formatPhilippinePhone(phoneNumber);

      const verificationCheck = await verifyService.verificationChecks.create({
        to: formattedPhone,
        code: code,
      });

      if (verificationCheck.status === "approved") {
        return {
          success: true,
          message: "Phone number verified successfully",
          status: verificationCheck.status,
        };
      } else {
        return {
          success: false,
          message: "Invalid verification code. Please try again.",
          status: verificationCheck.status,
        };
      }
    } catch (error: any) {
      console.error("Twilio verify code error:", error);

      if (error.code === 60200) {
        return {
          success: false,
          message: "Invalid phone number format.",
        };
      }

      if (error.code === 60202) {
        return {
          success: false,
          message: "Too many verification attempts. Please try again later.",
        };
      }

      return {
        success: false,
        message: "Failed to verify code. Please try again.",
      };
    }
  }

  /**
   * Format Philippine phone number
   */
  static formatPhilippinePhone(phoneNumber: string): string {
    // Remove all non-digit characters
    const digits = phoneNumber.replace(/\D/g, "");

    // Handle different Philippine phone number formats
    if (digits.startsWith("63")) {
      return `+${digits}`;
    } else if (digits.startsWith("09")) {
      return `+63${digits.substring(1)}`;
    } else if (digits.startsWith("9")) {
      return `+63${digits}`;
    } else {
      // Assume it's already in international format
      return phoneNumber;
    }
  }

  /**
   * Validate Philippine phone number format
   */
  // static isValidPhilippinePhone(phoneNumber: string): boolean {
  //   const formatted = this.formatPhilippinePhone(phoneNumber);
  //   // Philippine mobile numbers should be +63 followed by 9 digits
  //   const philippineMobileRegex = /^\+63[9]\d{8}$/;
  //   return philippineMobileRegex.test(formatted);
  // }
}
