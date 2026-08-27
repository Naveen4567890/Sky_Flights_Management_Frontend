import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import API from "../api/api";

export const createPaymentOrder =
    createAsyncThunk(
        "payment/createOrder",

        async (paymentData, thunkAPI) => {
            try {
                const token =
                    localStorage.getItem("token");

                if (!token) {
                    return thunkAPI.rejectWithValue(
                        "Please login to continue"
                    );
                }

                const response =
                    await API.post(
                        "/payment/create-order",
                        paymentData,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );

                return response.data;

            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem("token");

                    return thunkAPI.rejectWithValue(
                        "Session expired. Please login again"
                    );
                }

                return thunkAPI.rejectWithValue(
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Unable to create payment order"
                );
            }
        }
    );

export const verifyPayment =
    createAsyncThunk(
        "payment/verify",

        async (paymentData, thunkAPI) => {
            try {
                const token =
                    localStorage.getItem("token");

                if (!token) {
                    return thunkAPI.rejectWithValue(
                        "Please login to continue"
                    );
                }

                const response =
                    await API.post(
                        "/payment/verify",
                        paymentData,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );

                return response.data;

            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem("token");

                    return thunkAPI.rejectWithValue(
                        "Session expired. Please login again"
                    );
                }

                return thunkAPI.rejectWithValue(
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Payment verification failed"
                );
            }
        }
    );

const initialState = {
    orderId: null,
    paymentId: null,
    amount: 0,
    currency: "INR",
    loading: false,
    error: null,
    success: false,
};

const paymentSlice =
    createSlice({
        name: "payment",

        initialState,

        reducers: {
            resetPayment: (state) => {
                state.orderId = null;
                state.paymentId = null;
                state.amount = 0;
                state.currency = "INR";
                state.loading = false;
                state.error = null;
                state.success = false;
            },
        },

        extraReducers: (builder) => {
            builder

                .addCase(
                    createPaymentOrder.pending,
                    (state) => {
                        state.loading = true;
                        state.error = null;
                    }
                )

                .addCase(
                    createPaymentOrder.fulfilled,
                    (state, action) => {
                        state.loading = false;

                        state.orderId =
                            action.payload.orderId;

                        state.amount =
                            action.payload.amount;

                        state.currency =
                            action.payload.currency ||
                            "INR";
                    }
                )

                .addCase(
                    createPaymentOrder.rejected,
                    (state, action) => {
                        state.loading = false;

                        state.error =
                            action.payload;
                    }
                )

                .addCase(
                    verifyPayment.pending,
                    (state) => {
                        state.loading = true;
                        state.error = null;
                    }
                )

                .addCase(
                    verifyPayment.fulfilled,
                    (state, action) => {
                        state.loading = false;
                        state.success = true;

                        state.paymentId =
                            action.payload?.paymentId ||
                            null;
                    }
                )

                .addCase(
                    verifyPayment.rejected,
                    (state, action) => {
                        state.loading = false;
                        state.success = false;

                        state.error =
                            action.payload;
                    }
                );
        },
    });

export const {
    resetPayment,
} = paymentSlice.actions;

export default paymentSlice.reducer;