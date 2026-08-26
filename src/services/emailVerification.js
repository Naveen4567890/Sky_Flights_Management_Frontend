import API from "../api/api";

export const sendEmailOtp = async (email) => {

    const response = await API.post(
        "/auth/send-email-otp",
        {
            email
        }
    );

    return response.data;
};

export const verifyEmailOtp = async (
    email,
    otp
) => {

    const response = await API.post(
        "/auth/verify-email-otp",
        {
            email,
            otp
        }
    );

    return response.data;
};