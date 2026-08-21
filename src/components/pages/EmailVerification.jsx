import React, { useState } from "react";
import {
    sendEmailOtp,
    verifyEmailOtp
} from "../services/emailVerification";

const EmailVerification = ({
    email,
    onVerified
}) => {
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

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
            setMessage("OTP sent to your email");

        } catch (error) {
            setMessage(
                error.response?.data ||
                "Failed to send OTP"
            );
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

            await verifyEmailOtp(email, otp);

            setVerified(true);
            setMessage("Email verified successfully");

            onVerified();

        } catch (error) {
            setMessage(
                error.response?.data ||
                "Invalid or expired OTP"
            );
        } finally {
            setLoading(false);
        }
    };

    if (verified) {
        return (
            <button
                type="button"
                disabled
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
                ✓ Email Verified
            </button>
        );
    }

    return (
        <div className="mt-2">

            {!otpSent ? (
                <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    {loading
                        ? "Sending..."
                        : "Verify Email"}
                </button>
            ) : (
                <div className="flex gap-2">

                    <input
                        type="text"
                        value={otp}
                        maxLength={6}
                        onChange={(e) =>
                            setOtp(
                                e.target.value.replace(/\D/g, "")
                            )
                        }
                        placeholder="Enter OTP"
                        className="border rounded-lg px-3 py-2 w-32"
                    />

                    <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        {loading
                            ? "Verifying..."
                            : "Verify OTP"}
                    </button>

                </div>
            )}

            {message && (
                <p className="mt-2 text-sm">
                    {message}
                </p>
            )}
        </div>
    );
};

export default EmailVerification;