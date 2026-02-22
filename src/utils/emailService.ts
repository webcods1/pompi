import emailjs from '@emailjs/browser';

// =========================================================================
// CONFIGURATION GUIDE:
// 1. Get SERVICE_ID from "Email Services" tab in EmailJS
// 2. Get TEMPLATE_ID from "Email Templates" tab (looks like template_xxxx)
// 3. Get PUBLIC_KEY from "Account" -> "API Keys" section
// =========================================================================

const SERVICE_ID: string = "service_zctjl1q"; // UPDATED
const ADMIN_TEMPLATE_ID: string = "template_n4bhpo5"; // For Admin Alerts
const USER_TEMPLATE_ID: string = "template_9suy5yn"; // For Customer Confirmations
const PUBLIC_KEY: string = "yhP6aFX59CCmKrCms"; // UPDATED
const ADMIN_EMAIL = "muzamuzammil01@gmail.com";

/**
 * Sends a booking request alert to the ADMIN
 */
export const sendBookingEmail = async (bookingData: any) => {
    try {
        console.log("🚀 Attempting to send Admin Alert to:", ADMIN_EMAIL);

        const templateParams = {
            title: `${bookingData.type?.toUpperCase()} Booking Request`,
            name: bookingData.name || bookingData.userName || "Customer",
            email: bookingData.email || bookingData.userEmail || "No Email Provided",
            admin_email: ADMIN_EMAIL, // Can be used as {{admin_email}} in EmailJS dashboard
            message: `
Booking Details:
- Type: ${bookingData.type}
- ${bookingData.from ? `From: ${bookingData.from}` : ''}
- ${bookingData.to ? `To: ${bookingData.to}` : ''}
- Date: ${bookingData.date || bookingData.travelDate || 'N/A'}
- Mobile: ${bookingData.phone || bookingData.userMobile || 'N/A'}
- Passengers: ${bookingData.passengers || bookingData.guests || 'N/A'}
- Notes: ${bookingData.message || 'None'}
            `.trim()
        };

        const response = await emailjs.send(SERVICE_ID, ADMIN_TEMPLATE_ID, templateParams, PUBLIC_KEY);
        console.log("✅ Admin Alert Sent! Response:", response.status, response.text);
        return response;
    } catch (error: any) {
        console.error("❌ Admin Email Alert failed error:", error);
        // Return a structured error but don't crash the UI
        return { status: error?.status || 500, text: error?.text || "Failed" };
    }
};

/**
 * Sends a confirmation email to the CUSTOMER
 */
/**
 * Sends an OTP email to the user for password reset
 */
export const sendOTPEmail = async (email: string, otp: string) => {
    try {
        console.log("Sending OTP to:", email);

        const templateParams = {
            title: `Password Reset OTP - Pompi Travels`,
            name: "User",
            email: email,
            message: `
Your OTP for password reset is: ${otp}

This OTP is valid for 10 minutes. If you did not request this, please ignore this email.
            `.trim()
        };

        const response = await emailjs.send(SERVICE_ID, USER_TEMPLATE_ID, templateParams, PUBLIC_KEY);
        console.log("OTP Email Sent!", response.status);
        return response;
    } catch (error) {
        console.error("OTP Email failed:", error);
        return { status: 500, text: "Failed" };
    }
};

export const sendConfirmationEmail = async (customerEmail: string, customerName: string, bookingDetails: any) => {
    try {
        if (!customerEmail || customerEmail.includes('@travelapp.local')) {
            console.log("Skipping email for phone-only registered user.");
            return;
        }

        console.log("Sending confirmation to customer:", customerEmail);

        const templateParams = {
            title: `Booking Confirmed - Pompi Travels`,
            name: customerName || "Valued Customer",
            email: customerEmail,
            message: `
Your booking has been confirmed!
            
Details:
- Booking Type: ${bookingDetails.type || bookingDetails.vehicleType || 'Tour'}
- Status: ${bookingDetails.status}
- Date: ${bookingDetails.date || bookingDetails.travelDate || 'N/A'}

Our team will contact you soon with further instructions. Thank you for choosing Pompi Travels!
            `.trim()
        };

        const response = await emailjs.send(SERVICE_ID, USER_TEMPLATE_ID, templateParams, PUBLIC_KEY);
        console.log("Customer Confirmation Sent!", response.status);
        return response;
    } catch (error) {
        console.error("Customer Confirmation Email failed:", error);
        return { status: 500, text: "Failed" };
    }
};
