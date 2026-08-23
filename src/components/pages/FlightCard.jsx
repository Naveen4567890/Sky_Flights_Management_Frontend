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
    const [selectedSeat, setSelectedSeat] = useState([]);

    // ==========================================
    // SEARCH PARAMS
    // ==========================================

    const searchParams = useSelector(
        (state) => state.flight?.searchParams
    );

    const travelers =
        searchParams?.travelers || {};

    const requiredSeats =
        Number(travelers.ADULT || 0) +
        Number(travelers.CHILD || 0) +
        Number(travelers.INFANT || 0);


    // ==========================================
    // REDUX
    // ==========================================

    const seatUpdates = useSelector(
        (state) =>
            state.flight?.seatUpdates?.[flight.id] || {}
    );

    const confirmedSeat = useSelector(
        (state) =>
            state.flight?.confirmSeat?.[flight.id] || []
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
        cabinConfig.Economy;

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
        if (confirmedSeat.includes(seat)) {
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

        // Don't allow another user's SELECTED seat
        const status =
            getWebSocketSeatStatus(seat);

        if (status === "SELECTED") {
            return;
        }


        // ======================================
        // DESELECT CURRENTLY SELECTED SEAT
        // ======================================

        if (selectedSeat.includes(seat)) {

            const updatedSeats =
                selectedSeat.filter(
                    (item) => item !== seat
                );

            setSelectedSeat(updatedSeats);

            dispatch(
                updateSeat({
                    flightId: flight.id,
                    seatNumber: seat,
                    status: "AVAILABLE",
                })
            );

            sendSeatUpdate(
                flight.id,
                seat,
                "AVAILABLE"
            );

            return;
        }


        // ======================================
        // DON'T SELECT MORE SEATS THAN TRAVELLERS
        // ======================================

        if (selectedSeat.length >= requiredSeats) {
            return;
        }


        // ======================================
        // SELECT NEW SEAT
        // ======================================

        setSelectedSeat((prev) => [
            ...prev,
            seat,
        ]);


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

            // Release local selected seats
            selectedSeat.forEach((seat) => {

                sendSeatUpdate(
                    flight.id,
                    seat,
                    "AVAILABLE"
                );

                dispatch(
                    updateSeat({
                        flightId: flight.id,
                        seatNumber: seat,
                        status: "AVAILABLE",
                    })
                );
            });

            setSelectedSeat([]);
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

        if (selectedSeat.length === 0) {
            return;
        }


        // ======================================
        // MAKE SURE ALL TRAVELLER SEATS SELECTED
        // ======================================

        if (
            selectedSeat.length !== requiredSeats
        ) {
            return;
        }


        selectedSeat.forEach((seat) => {

            // Confirm seat
            dispatch(
                confirmFlightSeat({
                    flightId: flight.id,
                    seatNumber: seat,
                })
            );


            // Update Redux seat status
            dispatch(
                updateSeat({
                    flightId: flight.id,
                    seatNumber: seat,
                    status: "BOOKED",
                })
            );


            // Send booked status through WebSocket
            sendSeatUpdate(
                flight.id,
                seat,
                "BOOKED"
            );
        });


        console.log(
            "Seat confirmed:",
            flight.id,
            selectedSeat
        );


        // Clear temporary selection
        setSelectedSeat([]);

        // Close seat map
        setShowSeats(false);
    };


    // ==========================================
    // CANCEL CONFIRMED SEAT
    // ==========================================

    const handleRemoveConfirmedSeat = (
        seatToRemove
    ) => {

        if (!seatToRemove) {
            return;
        }


        // Remove confirmed seat
        dispatch(
            removeConfirmedSeat({
                flightId: flight.id,
                seatNumber: seatToRemove,
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
                max-w-full
                bg-white
                rounded-xl
                sm:rounded-2xl
                border
                p-3
                sm:p-5
                lg:p-6
                transition-all
                duration-200
                overflow-hidden

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
                    sm:flex-row
                    sm:items-center
                    justify-between
                    gap-2
                    sm:gap-3
                    mb-4
                    sm:mb-5
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
                            truncate
                        "
                    >
                        Flight No: {flight.flightNumber}
                    </p>

                </div>


                <span
                    className="
                        self-start
                        sm:self-auto
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
                    grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]
                    items-center
                    gap-1
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
                            truncate
                        "
                    >
                        {flight.departureTime}
                    </strong>

                    <span
                        className="
                            block
                            mt-1
                            text-xs
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
                            text-[10px]
                            sm:text-xs
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
                        min-w-12
                        sm:min-w-28
                    "
                >

                    <span
                        className="
                            text-[9px]
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
                                text-base
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
                            truncate
                        "
                    >
                        {flight.arrivalTime}
                    </strong>

                    <span
                        className="
                            block
                            mt-1
                            text-xs
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
                            text-[10px]
                            sm:text-xs
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
                    my-4
                    sm:my-5
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
                        sm:flex-row
                        sm:items-center
                        justify-between
                        gap-3
                    "
                >

                    {/* Confirmed Seat */}

                    <div
                        className="
                            flex
                            flex-wrap
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

                        <span
                            className="
                                px-2.5
                                py-1
                                bg-blue-50
                                text-blue-600
                                rounded-md
                                text-sm
                                font-semibold
                                break-words
                            "
                        >
                            {confirmedSeat.length > 0
                                ? confirmedSeat.join(", ")
                                : "Not Selected"}
                        </span>

                    </div>


                    {/* Price */}

                    <div className="text-left sm:text-right">

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
                        gap-2
                        sm:gap-3
                    "
                >

                    {/* Details */}

                    <button
                        type="button"
                        onClick={toggleDetails}
                        className="
                            w-full
                            min-h-10
                            sm:h-11
                            rounded-lg
                            border
                            border-gray-300
                            hover:bg-gray-50
                            active:bg-gray-100
                            text-gray-700
                            font-medium
                            text-sm
                            transition
                            px-3
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
                            min-h-10
                            sm:h-11
                            rounded-lg
                            border
                            border-blue-300
                            bg-blue-50
                            hover:bg-blue-100
                            active:bg-blue-200
                            text-blue-600
                            font-medium
                            text-sm
                            transition
                            px-3
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
                            min-h-10
                            sm:h-11
                            rounded-lg
                            font-semibold
                            text-sm
                            sm:text-base
                            transition-all
                            duration-200
                            px-3

                            ${
                                selected
                                    ? `
                                        bg-red-600
                                        hover:bg-red-700
                                        active:bg-red-800
                                        text-white
                                    `
                                    : `
                                        bg-blue-600
                                        hover:bg-blue-700
                                        active:bg-blue-800
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
                        mt-5
                        sm:mt-6
                        pt-4
                        sm:pt-5
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
                            p-3
                            sm:p-5
                        "
                    >

                        <div
                            className="
                                flex
                                flex-col
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                                gap-3
                                mb-4
                                sm:mb-5
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
                                    self-start
                                    sm:self-auto
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
                                sm:grid-cols-2
                                lg:grid-cols-3
                                gap-3
                                sm:gap-4
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
                                    confirmedSeat.length > 0
                                        ? confirmedSeat.join(", ")
                                        : "Not Selected"
                                }
                                green={
                                    confirmedSeat.length > 0
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
                        mt-5
                        sm:mt-6
                        pt-4
                        sm:pt-5
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
                            p-3
                            sm:p-5
                        "
                    >

                        {/* Seat Header */}

                        <div
                            className="
                                flex
                                flex-col
                                gap-4
                                mb-5
                            "
                        >

                            <div
                                className="
                                    flex
                                    flex-col
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                    gap-3
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


                                <span
                                    className="
                                        self-start
                                        sm:self-auto
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

                            </div>


                            {/* Traveller Status */}

                            <div
                                className="
                                    flex
                                    flex-wrap
                                    gap-2
                                "
                            >

                                <span
                                    className="
                                        px-2.5
                                        sm:px-3
                                        py-1.5
                                        rounded-lg
                                        bg-gray-100
                                        text-gray-700
                                        text-xs
                                        font-semibold
                                    "
                                >
                                    👥 Travellers:{" "}
                                    {requiredSeats}
                                </span>

                                <span
                                    className="
                                        px-2.5
                                        sm:px-3
                                        py-1.5
                                        rounded-lg
                                        bg-blue-100
                                        text-blue-700
                                        text-xs
                                        font-semibold
                                    "
                                >
                                    💺 Selected:{" "}
                                    {selectedSeat.length} /{" "}
                                    {requiredSeats}
                                </span>

                                <span
                                    className="
                                        px-2.5
                                        sm:px-3
                                        py-1.5
                                        rounded-lg
                                        bg-green-100
                                        text-green-700
                                        text-xs
                                        font-semibold
                                    "
                                >
                                    ✓ Confirmed:{" "}
                                    {confirmedSeat.length} /{" "}
                                    {requiredSeats}
                                </span>

                            </div>

                        </div>


                        {/* ========================================== */}
                        {/* SELECTED / CONFIRMED STATUS */}
                        {/* ========================================== */}

                        {(confirmedSeat.length > 0 ||
                            selectedSeat.length > 0) && (

                            <div
                                className="
                                    mb-5
                                    flex
                                    flex-col
                                    gap-2
                                "
                            >

                                {confirmedSeat.length > 0 && (
                                    <div
                                        className="
                                            flex
                                            flex-wrap
                                            items-center
                                            gap-2
                                            p-3
                                            rounded-lg
                                            bg-green-50
                                            border
                                            border-green-100
                                        "
                                    >

                                        <span
                                            className="
                                                text-xs
                                                text-green-700
                                                font-semibold
                                            "
                                        >
                                            Confirmed:
                                        </span>

                                        <span
                                            className="
                                                text-sm
                                                font-bold
                                                text-green-700
                                                break-words
                                            "
                                        >
                                            {confirmedSeat.join(", ")}
                                        </span>

                                    </div>
                                )}


                                {selectedSeat.length > 0 && (
                                    <div
                                        className="
                                            flex
                                            flex-wrap
                                            items-center
                                            gap-2
                                            p-3
                                            rounded-lg
                                            bg-blue-50
                                            border
                                            border-blue-100
                                        "
                                    >

                                        <span
                                            className="
                                                text-xs
                                                text-blue-700
                                                font-semibold
                                            "
                                        >
                                            Selected:
                                        </span>

                                        <span
                                            className="
                                                text-sm
                                                font-bold
                                                text-blue-700
                                                break-words
                                            "
                                        >
                                            {selectedSeat.join(", ")}
                                        </span>

                                    </div>
                                )}

                            </div>
                        )}


                        {/* ========================================== */}
                        {/* LEGEND */}
                        {/* ========================================== */}

                        <div
                            className="
                                flex
                                flex-wrap
                                gap-x-4
                                gap-y-2
                                mb-5
                                text-xs
                                text-gray-600
                            "
                        >

                            <LegendItem
                                className="bg-white border border-gray-300"
                                label="Available"
                            />

                            <LegendItem
                                className="bg-gray-300"
                                label="Occupied"
                            />

                            <LegendItem
                                className="bg-blue-600"
                                label="Selected"
                            />

                            <LegendItem
                                className="bg-green-600"
                                label="Confirmed"
                            />

                            <LegendItem
                                className="bg-orange-400"
                                label="Locked"
                            />

                        </div>


                        {/* ========================================== */}
                        {/* AIRCRAFT */}
                        {/* ========================================== */}

                        <div
                            className="
                                w-full
                                overflow-x-auto
                                overflow-y-hidden
                                pb-3
                                overscroll-x-contain
                            "
                        >

                            <div
                                className="
                                    w-full
                                    min-w-[300px]
                                    sm:min-w-[340px]
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
                                        font-medium
                                    "
                                >
                                    ✈️ FRONT / COCKPIT
                                </div>


                                {/* Seat Header */}

                                <div
                                    className="
                                        grid
                                        grid-cols-8
                                        gap-1.5
                                        sm:gap-2
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
                                                    text-[10px]
                                                    sm:text-xs
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
                                        space-y-1.5
                                        sm:space-y-2
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
                                                        gap-1.5
                                                        sm:gap-2
                                                        items-center
                                                    "
                                                >

                                                    {/* Row Number */}

                                                    <span
                                                        className="
                                                            text-[10px]
                                                            sm:text-xs
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
                                                                selectedSeat.includes(
                                                                    seat
                                                                );


                                                            const confirmedSeatNow =
                                                                confirmedSeat.includes(
                                                                    seat
                                                                );


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
                                                                            : selectedSeat.length >= requiredSeats
                                                                            ? "Maximum seats selected"
                                                                            : `Select seat ${seat}`
                                                                    }

                                                                    className={`
                                                                        w-full
                                                                        h-8
                                                                        sm:h-9
                                                                        rounded-md
                                                                        text-[9px]
                                                                        sm:text-xs
                                                                        font-semibold
                                                                        transition-all
                                                                        duration-150
                                                                        select-none

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
                                                                                    active:bg-blue-100
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

                        {confirmedSeat.length > 0 && (

                            <div
                                className="
                                    mt-5
                                    p-3
                                    sm:p-4
                                    rounded-lg
                                    bg-green-50
                                    border
                                    border-green-200
                                "
                            >

                                <div className="mb-3">

                                    <p
                                        className="
                                            text-xs
                                            text-green-600
                                            font-semibold
                                        "
                                    >
                                        Confirmed seats
                                    </p>

                                    <p
                                        className="
                                            text-xs
                                            text-gray-500
                                            mt-1
                                        "
                                    >
                                        {confirmedSeat.length} of{" "}
                                        {requiredSeats} seats confirmed
                                    </p>

                                </div>


                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        gap-2
                                    "
                                >

                                    {confirmedSeat.map(
                                        (seat) => (

                                            <div
                                                key={seat}
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    px-3
                                                    py-2
                                                    rounded-lg
                                                    bg-green-600
                                                    text-white
                                                "
                                            >

                                                <span
                                                    className="
                                                        font-bold
                                                        text-sm
                                                    "
                                                >
                                                    {seat}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveConfirmedSeat(
                                                            seat
                                                        )
                                                    }
                                                    className="
                                                        w-6
                                                        h-6
                                                        rounded-full
                                                        bg-white/20
                                                        hover:bg-white/30
                                                        active:bg-white/40
                                                        text-white
                                                        text-xs
                                                    "
                                                >
                                                    ×
                                                </button>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>
                        )}


                        {/* ========================================== */}
                        {/* TEMPORARY SELECTED SEAT */}
                        {/* ========================================== */}

                        {selectedSeat.length > 0 && (

                            <div
                                className="
                                    mt-5
                                    p-3
                                    sm:p-4
                                    rounded-lg
                                    bg-blue-50
                                    border
                                    border-blue-100
                                "
                            >

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-3
                                    "
                                >

                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                text-blue-500
                                            "
                                        >
                                            Selected seats
                                        </p>

                                        <p
                                            className="
                                                text-base
                                                font-bold
                                                text-blue-700
                                                mt-1
                                                break-words
                                            "
                                        >
                                            {selectedSeat.join(", ")}
                                        </p>

                                        <p
                                            className="
                                                text-xs
                                                text-gray-500
                                                mt-1
                                            "
                                        >
                                            {selectedSeat.length} of{" "}
                                            {requiredSeats} seats selected
                                        </p>

                                    </div>


                                    <button
                                        type="button"
                                        disabled={
                                            selectedSeat.length !==
                                            requiredSeats
                                        }
                                        onClick={handleConfirmSeat}
                                        className={`
                                            w-full
                                            sm:w-auto
                                            sm:self-end
                                            px-5
                                            min-h-10
                                            rounded-lg
                                            text-sm
                                            font-semibold
                                            transition

                                            ${
                                                selectedSeat.length ===
                                                requiredSeats
                                                    ? `
                                                        bg-blue-600
                                                        hover:bg-blue-700
                                                        active:bg-blue-800
                                                        text-white
                                                    `
                                                    : `
                                                        bg-gray-300
                                                        text-gray-500
                                                        cursor-not-allowed
                                                    `
                                            }
                                        `}
                                    >
                                        Confirm{" "}
                                        {selectedSeat.length} Seats
                                    </button>

                                </div>

                            </div>

                        )}

                    </div>

                </div>
            )}

        </div>
    );
};


// ==========================================
// LEGEND ITEM COMPONENT
// ==========================================

const LegendItem = ({
    className,
    label,
}) => {

    return (
        <div
            className="
                flex
                items-center
                gap-1.5
            "
        >

            <span
                className={`
                    w-4
                    h-4
                    rounded
                    shrink-0
                    ${className}
                `}
            />

            <span>{label}</span>

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
                min-w-0
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
                    break-words
                    overflow-wrap-anywhere

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