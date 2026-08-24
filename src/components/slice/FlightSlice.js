


import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../api/api";

// ==========================================
// FLIGHT SEARCH API
// ==========================================

export const flightSearch = createAsyncThunk(
    "flight/search",

    async (formData, thunkAPI) => {
        try {

            const response = await API.post(
                "/flight/search",
                formData
            );
            console.log(response);
            
            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Flight Search failed"
            );
        }
    }
);


// ==========================================
// INITIAL STATE
// ==========================================

const initialState = {

    onwardFlights: [],
    returnFlights: [],

    selectedOnwardFlight: null,
    selectedReturnFlight: null,

    confirmSeat: {},

    searchParams: null,

    loading: false,
    error: null,

    traveller: {
    ADULT: 1,
    CHILD: 0,
    INFANT: 0,
  },
   
   totalTravelers: 1,

    seatUpdates: {},
};


// ==========================================
// SLICE
// ==========================================

const flightSlice = createSlice({

    name: "flight",

    initialState,

    reducers: {

        // ======================================
        // SELECT / DESELECT DEPARTURE
        // ======================================

        selectOnwardFlight: (state, action) => {

            const flight = action.payload;

            if (
                state.selectedOnwardFlight &&
                state.selectedOnwardFlight.flightNumber ===
                flight.flightNumber
            ) {

                state.selectedOnwardFlight = null;

            } else {

                state.selectedOnwardFlight = flight;
            }
        },


        // ======================================
        // SELECT / DESELECT RETURN
        // ======================================

        selectReturnFlight: (state, action) => {

            const flight = action.payload;

            if (
                state.selectedReturnFlight &&
                state.selectedReturnFlight.flightNumber ===
                flight.flightNumber
            ) {

                state.selectedReturnFlight = null;

            } else {

                state.selectedReturnFlight = flight;
            }
        },


        setTraveller: (state, action) => {
            state.traveller = action.payload.travelers;
            state.totalTravelers = action.payload.totalTravelers;
        },
    


        clearSelectedFlights: (state) => {

            state.selectedOnwardFlight = null;
            state.selectedReturnFlight = null;
        },


        // ======================================
        // CONFIRM SEAT
        //
        // flightId → seatNumber
        // ======================================

       confirmFlightSeat: (state, action) => {
            const {
                flightId,
                seatNumber,
            } = action.payload;

            if (!state.confirmSeat[flightId]) {
                state.confirmSeat[flightId] = [];
            }

            // Don't add duplicate seats
            if (
                !state.confirmSeat[flightId].includes(seatNumber)
            ) {
                state.confirmSeat[flightId].push(seatNumber);
            }
        },


        // ======================================
        // REMOVE CONFIRMED SEAT
        // ======================================

        removeConfirmedSeat: (state, action) => {
            const {
                flightId,
                seatNumber,
            } = action.payload;

            if (!state.confirmSeat[flightId]) {
                return;
            }

            state.confirmSeat[flightId] =
                state.confirmSeat[flightId].filter(
                (seat) => seat !== seatNumber
                );

            if (
                state.confirmSeat[flightId].length === 0
            ) {
                delete state.confirmSeat[flightId];
            }
        },


        // ======================================
        // CLEAR ALL CONFIRMED SEATS
        // ======================================

        clearConfirmedSeats: (state) => {

            state.confirmSeat = {};
        },


        // ======================================
        // UPDATE LIVE SEAT STATUS
        // ======================================

        updateSeat: (state, action) => {

            const {
                flightId,
                seatNumber,
                status,
            } = action.payload;

            if (!state.seatUpdates[flightId]) {

                state.seatUpdates[flightId] = {};
            }

            state.seatUpdates[flightId][seatNumber] =
                status;
        },


        // ======================================
        // CLEAR SEARCH RESULTS
        // ======================================

        clearFlights: (state) => {

            state.onwardFlights = [];
            state.returnFlights = [];

            state.selectedOnwardFlight = null;
            state.selectedReturnFlight = null;

            state.searchParams = null;

            state.error = null;

            state.seatUpdates = {};

            state.confirmSeat = {};
        },
    },


    // ==========================================
    // ASYNC ACTIONS
    // ==========================================

    extraReducers: (builder) => {

        builder

            // ==================================
            // SEARCH PENDING
            // ==================================

            .addCase(
                flightSearch.pending,
                (state,action) => {

                    state.loading = true;

                    state.error = null;

                    state.searchParams = action.meta.arg;

                    state.selectedOnwardFlight = null;
                    state.selectedReturnFlight = null;

                    state.confirmSeat = {};
                    state.seatUpdates = {};
                }
            )


            // ==================================
            // SEARCH SUCCESS
            // ==================================

            .addCase(
                flightSearch.fulfilled,
                (state, action) => {

                    state.loading = false;

                    const {
                        onwardFlights,
                        returnFlights,
                    } = action.payload;


                    state.onwardFlights =
                        onwardFlights || [];

                    state.returnFlights =
                        returnFlights || [];

                    state.searchParams =  action.meta.arg;

                    state.selectedOnwardFlight = null;
                    state.selectedReturnFlight = null;

                    state.confirmSeat = {};
                    state.seatUpdates = {};

                    state.traveller =action.meta.arg.travelers || {
                        ADULT: 1,
                        CHILD: 0,
                        INFANT: 0,
                    };

                    state.totalTravelers =action.meta.arg.totalTravelers || 1;
                }
            )


            // ==================================
            // SEARCH FAILED
            // ==================================

            .addCase(
                flightSearch.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload ||
                        "Flight Search failed";
                }
            );
    },
});


// ==========================================
// EXPORT ACTIONS
// ==========================================

export const {
    selectOnwardFlight,
    selectReturnFlight,
    clearSelectedFlights,

    confirmFlightSeat,
    removeConfirmedSeat,
    clearConfirmedSeats,
    setTraveller,
    clearFlights,
    updateSeat,

} = flightSlice.actions;


// ==========================================
// EXPORT REDUCER
// ==========================================

export default flightSlice.reducer;