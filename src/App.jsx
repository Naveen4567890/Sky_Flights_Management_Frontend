import React, { useEffect } from "react";
import "./app.css";

import { RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import route from "./router/Router";
import { clearTokenOnRefresh } from "./slice/AuthSlice";

import {
    connectWebSocket,
    disconnectWebSocket,
} from "./services/websocket";

import { updateSeat } from "./slice/FlightSlice";


const App = () => {

    const dispatch = useDispatch();


    useEffect(() => {

        dispatch(clearTokenOnRefresh());

        connectWebSocket({

            onNotification: (notification) => {

                console.log(
                    "🔔 Notification:",
                    notification
                );


                if (
                    notification.type ===
                    "PAYMENT_SUCCESS"
                ) {

                    toast.success(
                        notification.message
                    );
                }

                if (
                    notification.type ===
                    "PAYMENT_FAILED"
                ) {

                    toast.error(
                        notification.message
                    );
                }

                if (
                    notification.type ===
                    "BOOKING_CONFIRMED"
                ) {

                    toast.success(
                        notification.message
                    );
                }
            },

            onSeatUpdate: (seatUpdate) => {

                console.log(
                    "🪑 Live seat update:",
                    seatUpdate
                );
                dispatch(updateSeat(seatUpdate))
               
            },
        });


        return () => {

            disconnectWebSocket();

        };

    }, [dispatch]);


    return (
        <RouterProvider router={route} />
    );
};


export default App;