import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../api/api";

export const flightSearch = createAsyncThunk(
    "flight/search",

    async (formData, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                return thunkAPI.rejectWithValue(
                    "Please login to search flights"
                );
            }

            const response = await API.post(
                "/flight/search",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
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
                "Flight Search failed"
            );
        }
    }
);

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

const flightSlice = createSlice({
    name: "flight",

    initialState,

    reducers: {
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

        confirmFlightSeat: (state, action) => {
            const {
                flightId,
                seatNumber,
            } = action.payload;

            if (!state.confirmSeat[flightId]) {
                state.confirmSeat[flightId] = [];
            }

            if (
                !state.confirmSeat[flightId].includes(seatNumber)
            ) {
                state.confirmSeat[flightId].push(seatNumber);
            }
        },

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

        clearConfirmedSeats: (state) => {
            state.confirmSeat = {};
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

            state.seatUpdates[flightId][seatNumber] = status;
        },

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

    extraReducers: (builder) => {
        builder
            .addCase(
                flightSearch.pending,
                (state, action) => {
                    state.loading = true;
                    state.error = null;
                    state.searchParams = action.meta.arg;

                    state.selectedOnwardFlight = null;
                    state.selectedReturnFlight = null;

                    state.confirmSeat = {};
                    state.seatUpdates = {};
                }
            )

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

                    state.searchParams =
                        action.meta.arg;

                    state.selectedOnwardFlight = null;
                    state.selectedReturnFlight = null;

                    state.confirmSeat = {};
                    state.seatUpdates = {};

                    state.traveller =
                        action.meta.arg.travelers || {
                            ADULT: 1,
                            CHILD: 0,
                            INFANT: 0,
                        };

                    state.totalTravelers =
                        action.meta.arg.totalTravelers || 1;
                }
            )

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

export default flightSlice.reducer;