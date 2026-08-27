import React, { useEffect, useState } from "react";
import { sendEmailOtp, verifyEmailOtp } from "../services/emailVerification";

const EmailVerification = ({ email, onVerified }) => {
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [resendTimer, setResendTimer] = useState(0);

    useEffect(() => {
        if (resendTimer <= 0) return;
        const timer = setInterval(() => setResendTimer((previous) => previous - 1), 1000);
        return () => clearInterval(timer);
    }, [resendTimer]);

    const handleSendOtp = async () => {
        if (!email) {
            setMessage("Please enter your email");
            return;
        }
        try {
            setLoading(true);
            setMessage("");
            await sendEmailOtp(email);
            setOtpSent(true);
            setOtp("");
            setMessage("OTP sent to your email");
            setResendTimer(60);
        } catch (error) {
            setMessage(error.response?.data || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) {
            setMessage("Enter the 6-digit OTP");
            return;
        }
        try {
            setLoading(true);
            setMessage("");
            await verifyEmailOtp(email, otp);
            setVerified(true);
            setMessage("Email verified successfully");
            onVerified();
        } catch (error) {
            setMessage(error.response?.data || "Invalid or expired OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!email) {
            setMessage("Please enter your email");
            return;
        }
        if (resendTimer > 0) return;
        try {
            setResendLoading(true);
            setMessage("");
            await sendEmailOtp(email);
            setOtp("");
            setResendTimer(60);
            setMessage("New OTP sent to your email");
        } catch (error) {
            setMessage(error.response?.data || "Failed to resend OTP");
        } finally {
            setResendLoading(false);
        }
    };

    if (verified) {
        return <button type="button" disabled className="px-4 py-2 bg-green-600 text-white rounded-lg">✓ Email Verified</button>;
    }

    return (
        <div className="mt-2">
            {!otpSent ? (
                <button type="button" onClick={handleSendOtp} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {loading ? "Sending..." : "Verify Email"}
                </button>
            ) : (
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <input type="text" value={otp} maxLength={6} inputMode="numeric" onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Enter OTP" className="border border-gray-300 rounded-lg px-3 py-2 w-32 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                        <button type="button" onClick={handleVerifyOtp} disabled={loading || otp.length !== 6} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">Didn't receive the code?</span>
                        {resendTimer > 0 ? (
                            <span className="text-gray-400 font-medium">Resend in {resendTimer}s</span>
                        ) : (
                            <button type="button" onClick={handleResendOtp} disabled={resendLoading} className="text-blue-600 font-semibold hover:text-blue-700 hover:underline disabled:text-gray-400 disabled:no-underline">
                                {resendLoading ? "Sending..." : "Resend Code"}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {message && (
                <p className={`mt-2 text-sm ${message.includes("successfully") || message.includes("sent") ? "text-green-600" : "text-red-500"}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default EmailVerification;