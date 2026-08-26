import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let client = null;

export const connectWebSocket = ({
    onNotification,
    onSeatUpdate,
} = {}) => {

    
    if (client?.active) {
        console.log("WebSocket already active");
        return;
    }

    client = new Client({

    
        webSocketFactory: () =>
            new SockJS("http://localhost:8080/ws"),

        
        reconnectDelay: 5000,

        onConnect: () => {

            console.log("✅ WebSocket Connected");


            client.subscribe(
                "/topic/payment",
                (message) => {

                    try {

                        const notification =
                            JSON.parse(message.body);

                        console.log(
                            "💳 Payment notification:",
                            notification
                        );

                        if (onNotification) {
                            onNotification(notification);
                        }

                    } catch (error) {

                        console.error(
                            "Failed to parse payment notification:",
                            error
                        );
                    }
                }
            );


            client.subscribe(
                "/topic/booking",
                (message) => {

                    try {

                        const notification =
                            JSON.parse(message.body);

                        console.log(
                            "🎫 Booking notification:",
                            notification
                        );

                        if (onNotification) {
                            onNotification(notification);
                        }

                    } catch (error) {

                        console.error(
                            "Failed to parse booking notification:",
                            error
                        );
                    }
                }
            );

            client.subscribe(
                "/topic/seats",
                (message) => {

                    try {

                        const seatUpdate =
                            JSON.parse(message.body);

                        console.log(
                            "🪑 Seat update:",
                            seatUpdate
                        );

                        if (onSeatUpdate) {
                            onSeatUpdate(seatUpdate);
                        }

                    } catch (error) {

                        console.error(
                            "Failed to parse seat update:",
                            error
                        );
                    }
                }
            );
        },

        onDisconnect: () => {

            console.log(
                "❌ WebSocket Disconnected"
            );
        },


        onStompError: (frame) => {

            console.error(
                "STOMP Error:",
                frame
            );
        },

        onWebSocketError: (error) => {

            console.error(
                "WebSocket Error:",
                error
            );
        },
    });


    
    client.activate();
};

export const sendSeatUpdate = (
    flightId,
    seatNumber,
    status
) => {

    if (!client?.connected) {

        console.error(
            "❌ WebSocket is not connected"
        );

        return;
    }


    client.publish({

        destination: "/app/seat",

        body: JSON.stringify({
            flightId,
            seatNumber,
            status,
        }),
    });

};


export const disconnectWebSocket = () => {

    if (client) {

        console.log(
            "Disconnecting WebSocket..."
        );

        client.deactivate();

        client = null;
    }
};