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

        async (
            paymentData,
            thunkAPI
        ) => {

            try {

                const response =
                    await API.post(
                        "/payment/create-order",
                        paymentData
                    );

                return response.data;

            } catch (error) {

                return thunkAPI.rejectWithValue(
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

        async (
            paymentData,
            thunkAPI
        ) => {

            try {

                const response =
                    await API.post(
                        "/payment/verify",
                        paymentData
                    );

                return response.data;

            } catch (error) {

                return thunkAPI.rejectWithValue(
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

            resetPayment: (
                state
            ) => {

                state.orderId = null;

                state.paymentId = null;

                state.amount = 0;

                state.loading = false;

                state.error = null;

                state.success = false;
            },
        },


        extraReducers: (
            builder
        ) => {

            builder

                // CREATE ORDER
                .addCase(
                    createPaymentOrder.pending,
                    (state) => {

                        state.loading = true;

                        state.error = null;
                    }
                )

                .addCase(
                    createPaymentOrder.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.loading = false;

                        state.orderId =
                            action.payload.orderId;

                        state.amount =
                            action.payload.amount;

                        state.currency =
                            action.payload.currency;
                    }
                )

                .addCase(
                    createPaymentOrder.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.loading = false;

                        state.error =
                            action.payload;
                    }
                )


                // VERIFY PAYMENT
                .addCase(
                    verifyPayment.pending,
                    (state) => {

                        state.loading = true;

                        state.error = null;
                    }
                )

                .addCase(
                    verifyPayment.fulfilled,
                    (
                        state
                    ) => {

                        state.loading = false;

                        state.success = true;
                    }
                )

                .addCase(
                    verifyPayment.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.loading = false;

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