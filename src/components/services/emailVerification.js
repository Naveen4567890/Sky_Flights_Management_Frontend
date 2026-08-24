import API from "../api/api";

export const sendEmailOtp = async (email) => {

    const response = await API.post(
        "/email/send-email-otp",
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
        "/email/verify-email-otp",
        {
            email,
            otp
        }
    );

    return response.data;
};