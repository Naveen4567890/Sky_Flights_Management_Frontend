import { configureStore } from '@reduxjs/toolkit'

import authReducer from '../slice/AuthSlice'
import flightSearchReducer from '../slice/FlightSlice'
import bookingReducer from "../slice/BookingSlice";
import paymentReducer from "../slice/PaymentSlice";

export const store=configureStore({
    reducer:{
        auth:authReducer,
        flight:flightSearchReducer,
        booking: bookingReducer,
        payment: paymentReducer,

    },
    getDefaultMiddleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),

})
