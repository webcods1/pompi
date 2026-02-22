/**
 * SMS Service for Pompi Travels
 * This service handles sending SMS notifications and OTPs to users.
 * 
 * RECOMMENDED SERVICES:
 * 1. Twilio (Global)
 * 2. Fast2SMS (India - recommended for this project)
 * 3. Vonage (Global)
 */

// CONFIGURATION: Replace with your actual credentials
const FAST2SMS_API_KEY = "UVobal07tfxeBEGHYi5QKk9dn1zguyT46hrLSOFZWNPqmpwIMvI7POw3m5HLe0j8rfFhiWBvVsxbJkCl";
const ADMIN_MOBILE = "919745008000"; // Your admin mobile number

/**
 * Sends a generic SMS
 */
export const sendSMS = async (mobileNumber: string, message: string) => {
    try {
        // Cleaning up the mobile number (removing + and spaces)
        const cleanNumber = mobileNumber.replace(/\D/g, '');

        console.log(`🚀 Attempting to send SMS to: ${cleanNumber}`);

        // Example using Fast2SMS API (Commonly used in India)
        // Note: In production, this should ideally be called from a backend to hide API keys.
        const response = await fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=${FAST2SMS_API_KEY}&route=q&message=${encodeURIComponent(message)}&flash=0&numbers=${cleanNumber}`, {
            method: 'GET',
            headers: {
                "cache-control": "no-cache"
            }
        });

        const data = await response.json();

        if (data.return) {
            console.log("✅ SMS Sent Successfully!");
            return { status: 200, text: "Success" };
        } else {
            console.error("❌ SMS Failed:", data.message);
            return { status: 500, text: data.message || "Failed" };
        }
    } catch (error) {
        console.error("❌ SMS Service error:", error);
        // Fallback for demonstration since we don't have a real API key yet
        console.log("SIMULATED SMS CONTENT:", message);
        return { status: 500, text: "SMS Service Not Configured" };
    }
};

/**
 * Sends a booking alert SMS to the ADMIN
 */
export const sendBookingSMS = async (bookingData: any) => {
    const message = `
New Booking Request!
Type: ${bookingData.type}
From: ${bookingData.from || 'N/A'}
To: ${bookingData.to || 'N/A'}
Date: ${bookingData.date || 'N/A'}
Customer: ${bookingData.name}
Mobile: ${bookingData.phone}
    `.trim();

    return await sendSMS(ADMIN_MOBILE, message);
};

/**
 * Sends an OTP SMS to the user
 */
export const sendOTPSMS = async (mobileNumber: string, otp: string) => {
    const message = `Your OTP for Pompi Travels password reset is: ${otp}. Valid for 10 minutes.`;
    return await sendSMS(mobileNumber, message);
};
