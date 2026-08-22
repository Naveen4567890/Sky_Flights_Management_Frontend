

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { sendSeatUpdate } from "../services/websocket";

import {
    updateSeat,
    confirmFlightSeat,
    removeConfirmedSeat,
} from "../slice/FlightSlice";

const FlightCard = ({
    flight,
    onSelect,
    selected = false,
}) => {

    const dispatch = useDispatch();

    const [showDetails, setShowDetails] = useState(false);
    const [showSeats, setShowSeats] = useState(false);
    const [selectedSeat, setSelectedSeat] = useState(null);


    // ==========================================
    // REDUX
    // ==========================================

    const seatUpdates = useSelector(
        (state) =>
            state.flight?.seatUpdates?.[flight.id] || {}
    );

    const confirmedSeat = useSelector(
        (state) =>
            state.flight?.confirmSeat?.[flight.id] || null
    );


    // ==========================================
    // CABIN / SEAT CONFIGURATION
    // ==========================================

    const cabinType = flight.cabin || "Economy";

    const cabinConfig = {

        First: {
            rows: 5,
            columns: ["A", "B", "C"],
            layout: "1-2",
            label: "First Class",
        },

        Business: {
            rows: 7,
            columns: ["A", "B", "C", "D"],
            layout: "2-2",
            label: "Business Class",
        },

        Premium_Economy: {
            rows: 8,
            columns: [
                "A",
                "B",
                "C",
                "D",
                "E",
                "F",
                "G",
            ],
            layout: "2-3-2",
            label: "Premium Economy",
        },

        Economy: {
            rows: 10,
            columns: [
                "A",
                "B",
                "C",
                "D",
                "E",
                "F",
            ],
            layout: "3-3",
            label: "Economy Class",
        },
    };


    const currentCabin =
        cabinConfig[cabinType] ||
        cabinConfig.Premium_Economy;

    const seatRows = currentCabin.rows;
    const seatColumns = currentCabin.columns;


    // ==========================================
    // GET WEBSOCKET SEAT STATUS
    // ==========================================

    const getWebSocketSeatStatus = (seat) => {

        return seatUpdates?.[seat] || null;
    };


    // ==========================================
    // CHECK IF SEAT IS OCCUPIED
    // ==========================================

    const isSeatOccupied = (seat) => {

        const status = getWebSocketSeatStatus(seat);

        return (
            status === "BOOKED" ||
            status === "OCCUPIED"
        );
    };


    // ==========================================
    // GET SEAT STATUS
    // ==========================================

    const getSeatStatus = (seat) => {

        const status =
            getWebSocketSeatStatus(seat);

        // Confirmed seat from Redux
        if (confirmedSeat === seat) {
            return "BOOKED";
        }

        return status || "AVAILABLE";
    };


    // ==========================================
    // HANDLE SEAT CLICK
    // ==========================================

    const handleSeatClick = (seat) => {

        // Don't allow occupied seats
        if (isSeatOccupied(seat)) {
            return;
        }


        // Don't allow another user's
        // SELECTED seat
        const status =
            getWebSocketSeatStatus(seat);

        if (status === "SELECTED") {
            return;
        }


        // Release previous local selection
        if (
            selectedSeat &&
            selectedSeat !== seat
        ) {

            sendSeatUpdate(
                flight.id,
                selectedSeat,
                "AVAILABLE"
            );

            dispatch(
                updateSeat({
                    flightId: flight.id,
                    seatNumber: selectedSeat,
                    status: "AVAILABLE",
                })
            );
        }


        // Select new seat
        setSelectedSeat(seat);


        // Update Redux
        dispatch(
            updateSeat({
                flightId: flight.id,
                seatNumber: seat,
                status: "SELECTED",
            })
        );


        // Send WebSocket update
        sendSeatUpdate(
            flight.id,
            seat,
            "SELECTED"
        );
    };


    // ==========================================
    // TOGGLE SEATS
    // ==========================================

    const toggleSeats = () => {

        const newState = !showSeats;

        setShowSeats(newState);

        if (!newState) {

            // Release local selected seat
            if (selectedSeat) {

                sendSeatUpdate(
                    flight.id,
                    selectedSeat,
                    "AVAILABLE"
                );

                dispatch(
                    updateSeat({
                        flightId: flight.id,
                        seatNumber: selectedSeat,
                        status: "AVAILABLE",
                    })
                );
            }

            setSelectedSeat(null);
        }
    };


    // ==========================================
    // TOGGLE DETAILS
    // ==========================================

    const toggleDetails = () => {

        setShowDetails(!showDetails);
    };


    // ==========================================
    // CONFIRM SEAT
    // ==========================================

    const handleConfirmSeat = () => {

        if (!selectedSeat) {
            return;
        }



        dispatch(
            confirmFlightSeat({
                flightId: flight.id,
                seatNumber: selectedSeat,
            })
        );


        // ======================================
        // UPDATE REDUX SEAT STATUS
        // ======================================

        dispatch(
            updateSeat({
                flightId: flight.id,
                seatNumber: selectedSeat,
                status: "BOOKED",
            })
        );


        // ======================================
        // SEND BOOKED STATUS THROUGH WEBSOCKET
        // ======================================

        sendSeatUpdate(
            flight.id,
            selectedSeat,
            "BOOKED"
        );


        console.log(
            "Seat confirmed:",
            flight.id,
            selectedSeat
        );


        // Clear temporary local selection
        setSelectedSeat(null);

        // Close seat map
        setShowSeats(false);
    };


    // ==========================================
    // CANCEL CONFIRMED SEAT
    // ==========================================

 const handleRemoveConfirmedSeat = () => {

    if (!confirmedSeat) {
        return;
    }

    const seatToRemove = confirmedSeat;

    // Remove confirmed seat
    dispatch(
        removeConfirmedSeat({
            flightId: flight.id,
        })
    );

    // Make seat available
    dispatch(
        updateSeat({
            flightId: flight.id,
            seatNumber: seatToRemove,
            status: "AVAILABLE",
        })
    );

    // Notify other clients
    sendSeatUpdate(
        flight.id,
        seatToRemove,
        "AVAILABLE"
    );

    // Clear temporary local selection
    setSelectedSeat(null);

    console.log(
        "Confirmed seat removed:",
        flight.id,
        seatToRemove
    );
};


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div
            className={`
                w-full
                bg-white
                rounded-2xl
                border
                p-4
                sm:p-5
                lg:p-6
                transition-all
                duration-200

                ${
                    selected
                        ? `
                            border-blue-500
                            ring-2
                            ring-blue-100
                            shadow-lg
                        `
                        : `
                            border-gray-200
                            hover:border-blue-300
                            hover:shadow-md
                        `
                }
            `}
        >

            {/* ========================================== */}
            {/* HEADER */}
            {/* ========================================== */}

            <div
                className="
                    flex
                    flex-col
                    xs:flex-row
                    sm:flex-row
                    items-start
                    justify-between
                    gap-3
                    mb-5
                "
            >

                <div className="min-w-0">

                    <h3
                        className="
                            text-base
                            sm:text-lg
                            font-bold
                            text-gray-800
                            truncate
                        "
                    >
                        {flight.airline}
                    </h3>

                    <p
                        className="
                            text-xs
                            sm:text-sm
                            text-gray-500
                            mt-1
                        "
                    >
                        Flight No: {flight.flightNumber}
                    </p>

                </div>


                <span
                    className="
                        shrink-0
                        px-2.5
                        py-1
                        rounded-md
                        bg-green-50
                        text-green-600
                        text-xs
                        font-semibold
                    "
                >
                    Available
                </span>

            </div>


            {/* ========================================== */}
            {/* ROUTE */}
            {/* ========================================== */}

            <div
                className="
                    grid
                    grid-cols-[1fr_auto_1fr]
                    items-center
                    gap-2
                    sm:gap-4
                "
            >

                {/* Departure */}

                <div className="min-w-0">

                    <strong
                        className="
                            block
                            text-xl
                            sm:text-2xl
                            lg:text-3xl
                            font-bold
                            text-gray-800
                        "
                    >
                        {flight.departureTime}
                    </strong>

                    <span
                        className="
                            block
                            mt-1
                            text-sm
                            sm:text-base
                            font-medium
                            text-gray-600
                            truncate
                        "
                    >
                        {flight.source}
                    </span>

                    <span
                        className="
                            block
                            text-xs
                            text-gray-400
                            mt-1
                        "
                    >
                        Departure
                    </span>

                </div>


                {/* Route */}

                <div
                    className="
                        flex
                        flex-col
                        items-center
                        justify-center
                        min-w-17.5
                        sm:min-w-27.5
                    "
                >

                    <span
                        className="
                            text-[10px]
                            sm:text-xs
                            text-gray-400
                            mb-1
                            whitespace-nowrap
                        "
                    >
                        {flight.duration || "Direct"}
                    </span>

                    <div
                        className="
                            flex
                            items-center
                            w-full
                        "
                    >

                        <div
                            className="
                                hidden
                                sm:block
                                flex-1
                                border-t
                                border-dashed
                                border-gray-300
                            "
                        />

                        <span
                            className="
                                mx-1
                                sm:mx-2
                                text-lg
                                sm:text-2xl
                                text-blue-500
                            "
                        >
                            →
                        </span>

                        <div
                            className="
                                hidden
                                sm:block
                                flex-1
                                border-t
                                border-dashed
                                border-gray-300
                            "
                        />

                    </div>

                </div>


                {/* Arrival */}

                <div
                    className="
                        min-w-0
                        text-right
                    "
                >

                    <strong
                        className="
                            block
                            text-xl
                            sm:text-2xl
                            lg:text-3xl
                            font-bold
                            text-gray-800
                        "
                    >
                        {flight.arrivalTime}
                    </strong>

                    <span
                        className="
                            block
                            mt-1
                            text-sm
                            sm:text-base
                            font-medium
                            text-gray-600
                            truncate
                        "
                    >
                        {flight.destination}
                    </span>

                    <span
                        className="
                            block
                            text-xs
                            text-gray-400
                            mt-1
                        "
                    >
                        Arrival
                    </span>

                </div>

            </div>


            {/* ========================================== */}
            {/* DIVIDER */}
            {/* ========================================== */}

            <div
                className="
                    border-t
                    border-gray-100
                    my-5
                "
            />


            {/* ========================================== */}
            {/* FLIGHT INFO + PRICE */}
            {/* ========================================== */}

            <div
                className="
                    flex
                    flex-col
                    gap-4
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        xs:flex-row
                        sm:flex-row
                        items-start
                        sm:items-center
                        justify-between
                        gap-4
                    "
                >

                    {/* Confirmed Seat */}

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <span
                            className="
                                text-sm
                                text-gray-500
                            "
                        >
                            Seat
                        </span>

                        {confirmedSeat ? (

                            <span
                                className="
                                    px-2.5
                                    py-1
                                    bg-blue-50
                                    text-blue-600
                                    rounded-md
                                    text-sm
                                    font-semibold
                                "
                            >
                                {confirmedSeat}
                            </span>

                        ) : (

                            <span
                                className="
                                    px-2.5
                                    py-1
                                    bg-gray-50
                                    text-gray-500
                                    rounded-md
                                    text-sm
                                "
                            >
                                Not Selected
                            </span>
                        )}

                    </div>


                    {/* Price */}

                    <div className="sm:text-right">

                        <span
                            className="
                                block
                                text-xs
                                text-gray-400
                            "
                        >
                            Price
                        </span>

                        <strong
                            className="
                                text-xl
                                sm:text-2xl
                                text-gray-800
                            "
                        >
                            ₹{flight.price}
                        </strong>

                    </div>

                </div>


                {/* ========================================== */}
                {/* ACTION BUTTONS */}
                {/* ========================================== */}

                <div
                    className="
                        grid
                        grid-cols-1
                        sm:grid-cols-3
                        gap-2.5
                        sm:gap-3
                    "
                >

                    {/* Details */}

                    <button
                        type="button"
                        onClick={toggleDetails}
                        className="
                            w-full
                            h-10
                            sm:h-11
                            rounded-lg
                            border
                            border-gray-300
                            hover:bg-gray-50
                            text-gray-700
                            font-medium
                            text-sm
                            transition
                        "
                    >
                        {showDetails
                            ? "Hide Details"
                            : "View Details"}
                    </button>


                    {/* Seats */}

                    <button
                        type="button"
                        onClick={toggleSeats}
                        className="
                            w-full
                            h-10
                            sm:h-11
                            rounded-lg
                            border
                            border-blue-300
                            bg-blue-50
                            hover:bg-blue-100
                            text-blue-600
                            font-medium
                            text-sm
                            transition
                        "
                    >
                        💺{" "}
                        {showSeats
                            ? "Hide Seats"
                            : "View Seats"}
                    </button>


                    {/* Select */}

                    <button
                        type="button"
                        onClick={() =>
                            onSelect(flight)
                        }
                        className={`
                            w-full
                            h-10
                            sm:h-11
                            rounded-lg
                            font-semibold
                            text-sm
                            sm:text-base
                            transition-all
                            duration-200

                            ${
                                selected
                                    ? `
                                        bg-red-600
                                        hover:bg-red-700
                                        text-white
                                    `
                                    : `
                                        bg-blue-600
                                        hover:bg-blue-700
                                        text-white
                                    `
                            }
                        `}
                    >
                        {selected
                            ? "Deselect Flight"
                            : "Select Flight"}
                    </button>

                </div>

            </div>


            {/* ========================================== */}
            {/* FLIGHT DETAILS */}
            {/* ========================================== */}

            {showDetails && (

                <div
                    className="
                        mt-6
                        pt-5
                        border-t
                        border-gray-200
                    "
                >

                    <div
                        className="
                            rounded-xl
                            bg-gray-50
                            border
                            border-gray-200
                            p-4
                            sm:p-5
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-3
                                mb-5
                            "
                        >

                            <div>

                                <h4
                                    className="
                                        font-bold
                                        text-gray-800
                                        text-base
                                        sm:text-lg
                                    "
                                >
                                    ✈️ Flight Details
                                </h4>

                                <p
                                    className="
                                        text-xs
                                        text-gray-500
                                        mt-1
                                    "
                                >
                                    Complete flight information
                                </p>

                            </div>


                            <span
                                className="
                                    hidden
                                    sm:block
                                    px-2.5
                                    py-1
                                    rounded-md
                                    bg-white
                                    border
                                    border-gray-200
                                    text-xs
                                    text-gray-500
                                "
                            >
                                {flight.flightNumber}
                            </span>

                        </div>


                        <div
                            className="
                                grid
                                grid-cols-1
                                xs:grid-cols-2
                                sm:grid-cols-2
                                lg:grid-cols-3
                                gap-4
                            "
                        >

                            <DetailItem
                                label="Airline"
                                value={flight.airline}
                            />

                            <DetailItem
                                label="Flight Number"
                                value={flight.flightNumber}
                            />

                            <DetailItem
                                label="Duration"
                                value={
                                    flight.duration ||
                                    "N/A"
                                }
                            />

                            <DetailItem
                                label="From"
                                value={flight.source}
                            />

                            <DetailItem
                                label="To"
                                value={flight.destination}
                            />

                            <DetailItem
                                label="Confirmed Seat"
                                value={
                                    confirmedSeat ||
                                    "Not Selected"
                                }
                                green={
                                    !!confirmedSeat
                                }
                            />

                            <DetailItem
                                label="Departure"
                                value={
                                    flight.departureTime
                                }
                            />

                            <DetailItem
                                label="Arrival"
                                value={
                                    flight.arrivalTime
                                }
                            />

                            <DetailItem
                                label="Price"
                                value={`₹${flight.price}`}
                            />

                        </div>

                    </div>

                </div>
            )}


            {/* ========================================== */}
            {/* SEAT MAP */}
            {/* ========================================== */}

            {showSeats && (

                <div
                    className="
                        mt-6
                        pt-5
                        border-t
                        border-gray-200
                    "
                >

                    <div
                        className="
                            rounded-xl
                            bg-gray-50
                            border
                            border-gray-200
                            p-4
                            sm:p-5
                        "
                    >

                        {/* Seat Header */}

                        <div
                            className="
                                flex
                                flex-col
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                                gap-3
                                mb-5
                            "
                        >

                            <div>

                                <h4
                                    className="
                                        font-bold
                                        text-gray-800
                                        text-base
                                        sm:text-lg
                                    "
                                >
                                    💺 Select Seat
                                </h4>

                                <p
                                    className="
                                        text-xs
                                        text-gray-500
                                        mt-1
                                    "
                                >
                                    Choose an available seat
                                </p>

                            </div>


                            <div
                                className="
                                    flex
                                    gap-2
                                    flex-wrap
                                "
                            >

                                <span
                                    className="
                                        px-3
                                        py-1.5
                                        rounded-lg
                                        bg-green-100
                                        text-green-600
                                        text-xs
                                        font-semibold
                                    "
                                >
                                    🟢 Live
                                </span>


                                {confirmedSeat && (

                                    <span
                                        className="
                                            px-3
                                            py-1.5
                                            rounded-lg
                                            bg-green-100
                                            text-green-700
                                            text-sm
                                            font-semibold
                                        "
                                    >
                                        Confirmed:{" "}
                                        {confirmedSeat}
                                    </span>

                                )}


                                {selectedSeat && (

                                    <span
                                        className="
                                            self-start
                                            sm:self-auto
                                            px-3
                                            py-1.5
                                            rounded-lg
                                            bg-blue-100
                                            text-blue-600
                                            text-sm
                                            font-semibold
                                        "
                                    >
                                        Seat{" "}
                                        {selectedSeat}
                                    </span>

                                )}

                            </div>

                        </div>


                        {/* Legend */}

                        <div
                            className="
                                flex
                                flex-wrap
                                gap-x-5
                                gap-y-2
                                mb-5
                                text-xs
                                text-gray-600
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-1.5
                                "
                            >

                                <span
                                    className="
                                        w-4
                                        h-4
                                        rounded
                                        bg-white
                                        border
                                        border-gray-300
                                    "
                                />

                                Available

                            </div>


                            <div
                                className="
                                    flex
                                    items-center
                                    gap-1.5
                                "
                            >

                                <span
                                    className="
                                        w-4
                                        h-4
                                        rounded
                                        bg-gray-300
                                    "
                                />

                                Occupied

                            </div>


                            <div
                                className="
                                    flex
                                    items-center
                                    gap-1.5
                                "
                            >

                                <span
                                    className="
                                        w-4
                                        h-4
                                        rounded
                                        bg-blue-600
                                    "
                                />

                                Selected

                            </div>



                            <div
                                className="
                                    flex
                                    items-center
                                    gap-1.5
                                "
                            >

                                <span
                                    className="
                                        w-4
                                        h-4
                                        rounded
                                        bg-green-600
                                    "
                                />

                                Confirmed

                            </div>

                        </div>


                        {/* ========================================== */}
                        {/* AIRCRAFT */}
                        {/* ========================================== */}

                        <div
                            className="
                                w-full
                                overflow-x-auto
                                pb-2
                            "
                        >

                            <div
                                className="
                                    min-w-[320px]
                                    max-w-md
                                    mx-auto
                                "
                            >

                                {/* Cockpit */}

                                <div
                                    className="
                                        text-center
                                        mb-4
                                        text-xs
                                        text-gray-400
                                    "
                                >
                                    ✈️ FRONT / COCKPIT
                                </div>


                                {/* Seat Header */}

                                <div
                                    className="
                                        grid
                                        grid-cols-8
                                        gap-2
                                        mb-2
                                    "
                                >

                                    <div />

                                    {seatColumns.map(
                                        (column) => (

                                            <div
                                                key={column}
                                                className="
                                                    text-center
                                                    text-xs
                                                    font-semibold
                                                    text-gray-400
                                                "
                                            >
                                                {column}
                                            </div>

                                        )
                                    )}

                                </div>


                                {/* Seat Rows */}

                                <div
                                    className="
                                        space-y-2
                                    "
                                >

                                    {Array.from(
                                        {
                                            length: seatRows,
                                        },
                                        (_, index) => {

                                            const row =
                                                index + 1;

                                            return (

                                                <div
                                                    key={row}
                                                    className="
                                                        grid
                                                        grid-cols-8
                                                        gap-2
                                                        items-center
                                                    "
                                                >

                                                    {/* Row Number */}

                                                    <span
                                                        className="
                                                            text-xs
                                                            text-gray-400
                                                            text-center
                                                        "
                                                    >
                                                        {row}
                                                    </span>


                                                    {seatColumns.map(
                                                        (column) => {

                                                            const seat =
                                                                `${column}${row}`;

                                                            const status =
                                                                getSeatStatus(
                                                                    seat
                                                                );


                                                            const occupied =
                                                                status ===
                                                                    "BOOKED" ||
                                                                status ===
                                                                    "OCCUPIED";


                                                            const selectedSeatNow =
                                                                selectedSeat ===
                                                                seat;


                                                            const confirmedSeatNow =
                                                                confirmedSeat ===
                                                                seat;


                                                            const liveLocked =
                                                                status ===
                                                                    "SELECTED" &&
                                                                !selectedSeatNow &&
                                                                !confirmedSeatNow;


                                                            return (

                                                                <button
                                                                    key={seat}
                                                                    type="button"

                                                                    disabled={
                                                                        occupied ||
                                                                        liveLocked ||
                                                                        confirmedSeatNow
                                                                    }

                                                                    onClick={() =>
                                                                        handleSeatClick(
                                                                            seat
                                                                        )
                                                                    }

                                                                    title={
                                                                        confirmedSeatNow
                                                                            ? `Seat ${seat} is confirmed`
                                                                            : occupied
                                                                            ? `Seat ${seat} is occupied`
                                                                            : liveLocked
                                                                            ? `Seat ${seat} is temporarily locked`
                                                                            : `Select seat ${seat}`
                                                                    }

                                                                    className={`
                                                                        h-8
                                                                        sm:h-9
                                                                        rounded-md
                                                                        text-[10px]
                                                                        sm:text-xs
                                                                        font-semibold
                                                                        transition-all
                                                                        duration-150

                                                                        ${
                                                                            confirmedSeatNow
                                                                                ? `
                                                                                    bg-green-600
                                                                                    text-white
                                                                                    cursor-not-allowed
                                                                                `
                                                                                : selectedSeatNow
                                                                                ? `
                                                                                    bg-blue-600
                                                                                    text-white
                                                                                    ring-2
                                                                                    ring-blue-200
                                                                                `
                                                                                : liveLocked
                                                                                ? `
                                                                                    bg-orange-400
                                                                                    text-white
                                                                                    cursor-not-allowed
                                                                                `
                                                                                : occupied
                                                                                ? `
                                                                                    bg-gray-300
                                                                                    text-gray-500
                                                                                    cursor-not-allowed
                                                                                `
                                                                                : `
                                                                                    bg-white
                                                                                    border
                                                                                    border-gray-300
                                                                                    text-gray-600
                                                                                    hover:border-blue-500
                                                                                    hover:text-blue-600
                                                                                    hover:bg-blue-50
                                                                                `
                                                                        }
                                                                    `}
                                                                >
                                                                    {seat}
                                                                </button>

                                                            );
                                                        }
                                                    )}

                                                </div>
                                            );
                                        }
                                    )}

                                </div>

                            </div>

                        </div>


{/* ========================================== */}
{/* CONFIRMED SEAT */}
{/* ========================================== */}

{confirmedSeat && (
    <div
        className="
            mt-5
            flex
            flex-col
            sm:flex-row
            items-start
            sm:items-center
            justify-between
            gap-3
            p-4
            rounded-lg
            bg-green-50
            border
            border-green-200
        "
    >
        <div>
            <p
                className="
                    text-xs
                    text-green-600
                "
            >
                Confirmed seat
            </p>

            <p
                className="
                    text-base
                    font-bold
                    text-green-700
                    mt-0.5
                "
            >
                {confirmedSeat}
            </p>
        </div>

        <button
            type="button"
            onClick={handleRemoveConfirmedSeat}
            className="
                w-full
                sm:w-auto
                px-5
                h-10
                bg-red-600
                hover:bg-red-700
                text-white
                rounded-lg
                text-sm
                font-semibold
                transition
            "
        >
            Remove Seat
        </button>
    </div>
)}


{/* ========================================== */}
{/* TEMPORARY SELECTED SEAT */}
{/* ========================================== */}

{selectedSeat && !confirmedSeat && (
    <div
        className="
            mt-5
            flex
            flex-col
            sm:flex-row
            items-start
            sm:items-center
            justify-between
            gap-3
            p-4
            rounded-lg
            bg-blue-50
            border
            border-blue-100
        "
    >
        <div>
            <p
                className="
                    text-xs
                    text-blue-500
                "
            >
                Selected seat
            </p>

            <p
                className="
                    text-base
                    font-bold
                    text-blue-700
                    mt-0.5
                "
            >
                {selectedSeat}
            </p>
        </div>

        <button
            type="button"
            onClick={handleConfirmSeat}
            className="
                w-full
                sm:w-auto
                px-5
                h-10
                bg-blue-600
                hover:bg-blue-700
                text-white
                rounded-lg
                text-sm
                font-semibold
                transition
            "
        >
            Confirm Seat
        </button>
    </div>
)}


                    </div>

                </div>
            )}

        </div>
    );
};


// ==========================================
// DETAIL ITEM COMPONENT
// ==========================================

const DetailItem = ({
    label,
    value,
    green = false,
}) => {

    return (

        <div
            className="
                p-3
                rounded-lg
                bg-white
                border
                border-gray-100
            "
        >

            <p
                className="
                    text-[11px]
                    sm:text-xs
                    text-gray-400
                    mb-1
                "
            >
                {label}
            </p>

            <p
                className={`
                    text-sm
                    sm:text-base
                    font-semibold
                    wrap-break-word

                    ${
                        green
                            ? "text-green-600"
                            : "text-gray-700"
                    }
                `}
            >
                {value}
            </p>

        </div>
    );
};


export default FlightCard;