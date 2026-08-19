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

    searchParams: null,

    loading: false,
    error: null,
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

            // If same flight is already selected
            // then deselect it

            if (
                state.selectedOnwardFlight &&
                state.selectedOnwardFlight.flightNumber ===
                flight.flightNumber
            ) {

                state.selectedOnwardFlight = null;

            } else {

                // Otherwise select the new flight

                state.selectedOnwardFlight = flight;
            }
        },


        // ======================================
        // SELECT / DESELECT RETURN
        // ======================================

        selectReturnFlight: (state, action) => {

            const flight = action.payload;

            // If same flight is already selected
            // then deselect it

            if (
                state.selectedReturnFlight &&
                state.selectedReturnFlight.flightNumber ===
                flight.flightNumber
            ) {

                state.selectedReturnFlight = null;

            } else {

                // Otherwise select the new flight

                state.selectedReturnFlight = flight;
            }
        },


        // ======================================
        // CLEAR SELECTED FLIGHTS
        // ======================================

        clearSelectedFlights: (state) => {

            state.selectedOnwardFlight = null;

            state.selectedReturnFlight = null;
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
        },
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
                (state) => {

                    state.loading = true;

                    state.error = null;

                    state.selectedOnwardFlight = null;

                    state.selectedReturnFlight = null;
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


                    state.selectedOnwardFlight = null;

                    state.selectedReturnFlight = null;
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
    clearFlights,
    updateSeat,
} = flightSlice.actions;


// ==========================================
// EXPORT REDUCER
// ==========================================

export default flightSlice.reducer;