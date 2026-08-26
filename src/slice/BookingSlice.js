import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../api/api";

export const createBooking = createAsyncThunk(
    "booking/create",

    async (bookingData, thunkAPI) => {
        try {

            const response = await API.post(
                "/booking/create",
                bookingData
            );

            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Booking failed"
            );
        }
    }
);

const initialState = {

    passengers: [],

    bookingDetails: null,

    bookingId: null,

    paymentStatus: "idle",

    loading: false,

    error: null,
};

const bookingSlice = createSlice({

    name: "booking",

    initialState,

    reducers: {

        setPassengers: (state, action) => {
            state.passengers = action.payload;
        },

        addPassenger: (state, action) => {
            state.passengers.push(action.payload);
        },

        updatePassenger: (state, action) => {

            const {
                index,
                passenger
            } = action.payload;

            state.passengers[index] = passenger;
        },

        removePassenger: (state, action) => {

            state.passengers.splice(
                action.payload,
                1
            );
        },

        clearBooking: (state) => {

            state.passengers = [];
            state.bookingDetails = null;
            state.bookingId = null;
            state.paymentStatus = "idle";
            state.error = null;
        },

        setPaymentStatus: (state, action) => {
            state.paymentStatus = action.payload;
        },
    },

    extraReducers: (builder) => {

        builder

            .addCase(createBooking.pending, (state) => {

                state.loading = true;
                state.error = null;
            })

            .addCase(createBooking.fulfilled, (state, action) => {

                state.loading = false;

                state.bookingDetails =
                    action.payload;

                state.bookingId =
                    action.payload.bookingId;

                state.paymentStatus =
                    "success";
            })

            .addCase(createBooking.rejected, (state, action) => {

                state.loading = false;

                state.paymentStatus =
                    "failed";

                state.error =
                    action.payload;
            });
    },
});

export const {
    setPassengers,
    addPassenger,
    updatePassenger,
    removePassenger,
    clearBooking,
    setPaymentStatus,
} = bookingSlice.actions;

export default bookingSlice.reducer;