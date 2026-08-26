import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../api/api";

// ==========================================
// CREATE BOOKING
// ==========================================

export const createBooking = createAsyncThunk(
  "booking/create",

  async (bookingData, thunkAPI) => {
    try {
      // Get JWT token
      const token = localStorage.getItem("token");

      // If token doesn't exist
      if (!token) {
        return thunkAPI.rejectWithValue(
          "Please login to continue"
        );
      }

      // Send booking request
      const response = await API.post(
        "/booking/create",
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;

    } catch (error) {

      // Handle unauthorized token
      if (error.response?.status === 401) {
        localStorage.removeItem("token");

        return thunkAPI.rejectWithValue(
          "Session expired. Please login again."
        );
      }

      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        "Booking failed"
      );
    }
  }
);

// ==========================================
// INITIAL STATE
// ==========================================

const initialState = {
  passengers: [],

  bookingDetails: null,

  bookingId: null,

  paymentStatus: "idle",

  loading: false,

  error: null,
};

// ==========================================
// BOOKING SLICE
// ==========================================

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
        passenger,
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

  // ==========================================
  // ASYNC ACTIONS
  // ==========================================

  extraReducers: (builder) => {

    builder

      // BOOKING REQUEST
      .addCase(
        createBooking.pending,
        (state) => {

          state.loading = true;

          state.error = null;

          state.paymentStatus = "idle";
        }
      )

      // BOOKING SUCCESS
      .addCase(
        createBooking.fulfilled,
        (state, action) => {

          state.loading = false;

          state.bookingDetails =
            action.payload;

          state.bookingId =
            action.payload.bookingId;

          state.paymentStatus =
            "success";
        }
      )

      // BOOKING FAILED
      .addCase(
        createBooking.rejected,
        (state, action) => {

          state.loading = false;

          state.paymentStatus =
            "failed";

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
  setPassengers,
  addPassenger,
  updatePassenger,
  removePassenger,
  clearBooking,
  setPaymentStatus,
} = bookingSlice.actions;

// ==========================================
// REDUCER
// ==========================================

export default bookingSlice.reducer;