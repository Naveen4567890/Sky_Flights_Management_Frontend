import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import API from "../api/api";

// ==========================================
// CREATE PAYMENT ORDER
// ==========================================

export const createPaymentOrder =
    createAsyncThunk(
        "payment/createOrder",

        async (paymentData, thunkAPI) => {
            try {

                // Get JWT token
                const token =
                    localStorage.getItem("token");

                // Check token
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

                // Token expired / unauthorized
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


// ==========================================
// VERIFY PAYMENT
// ==========================================

export const verifyPayment =
    createAsyncThunk(
        "payment/verify",

        async (paymentData, thunkAPI) => {
            try {

                // Get JWT token
                const token =
                    localStorage.getItem("token");

                // Check token
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

                // Token expired / unauthorized
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


// ==========================================
// INITIAL STATE
// ==========================================

const initialState = {

    orderId: null,

    paymentId: null,

    amount: 0,

    currency: "INR",

    loading: false,

    error: null,

    success: false,
};


// ==========================================
// SLICE
// ==========================================

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

                // ======================================
                // CREATE ORDER
                // ======================================

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

                // ======================================
                // VERIFY PAYMENT
                // ======================================

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


// ==========================================
// ACTIONS
// ==========================================

export const {
    resetPayment,
} = paymentSlice.actions;


// ==========================================
// REDUCER
// ==========================================

export default paymentSlice.reducer;