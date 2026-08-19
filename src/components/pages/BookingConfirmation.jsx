import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const BookingConfirmation = () => {
    const navigate = useNavigate();

    const {
        bookingDetails,
        bookingId,
    } = useSelector(
        (state) => state.booking
    );

    const {
        selectedOnwardFlight,
        selectedReturnFlight,
    } = useSelector(
        (state) => state.flight
    );

    const finalBookingId =
        bookingId ||
        bookingDetails?.id ||
        bookingDetails?.bookingId ||
        "N/A";

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ================= HEADER ================= */}

            <header className="bg-white border-b border-gray-200 shadow-sm">

                <div className="
                    max-w-6xl
                    mx-auto
                    px-4
                    sm:px-6
                    lg:px-8
                    py-4
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                    ">

                        <h1 className="
                            text-xl
                            sm:text-2xl
                            font-bold
                            text-blue-600
                        ">
                            Flight Booking
                        </h1>

                        <span className="
                            hidden
                            sm:block
                            text-sm
                            text-gray-500
                        ">
                            Booking Confirmation
                        </span>

                    </div>

                </div>

            </header>


            {/* ================= MAIN ================= */}

            <main className="
                max-w-4xl
                mx-auto
                px-4
                sm:px-6
                lg:px-8
                py-8
                sm:py-12
            ">

                {/* ================= SUCCESS CARD ================= */}

                <div className="
                    bg-white
                    rounded-3xl
                    border
                    border-gray-200
                    shadow-lg
                    overflow-hidden
                ">

                    {/* SUCCESS HEADER */}

                    <div className="
                        bg-linear-to-r
                        from-green-500
                        to-emerald-500
                        px-5
                        sm:px-8
                        py-8
                        sm:py-10
                        text-center
                        text-white
                    ">

                        <div className="
                            w-20
                            h-20
                            sm:w-24
                            sm:h-24
                            mx-auto
                            rounded-full
                            bg-white
                            flex
                            items-center
                            justify-center
                            shadow-lg
                            mb-5
                        ">

                            <span className="
                                text-4xl
                                sm:text-5xl
                            ">
                                ✓
                            </span>

                        </div>

                        <h1 className="
                            text-2xl
                            sm:text-3xl
                            lg:text-4xl
                            font-bold
                        ">
                            Booking Confirmed!
                        </h1>

                        <p className="
                            mt-2
                            text-sm
                            sm:text-base
                            text-green-50
                        ">
                            Your flight has been booked
                            successfully.
                        </p>

                    </div>


                    {/* ================= BOOKING ID ================= */}

                    <div className="
                        px-5
                        sm:px-8
                        py-6
                        border-b
                        border-gray-200
                        text-center
                    ">

                        <p className="
                            text-xs
                            sm:text-sm
                            uppercase
                            tracking-wider
                            text-gray-400
                            font-semibold
                        ">
                            Booking ID
                        </p>

                        <div className="
                            mt-2
                            inline-flex
                            items-center
                            gap-2
                            bg-blue-50
                            border
                            border-blue-100
                            px-4
                            py-2
                            rounded-lg
                        ">

                            <span className="
                                text-lg
                                font-bold
                                text-blue-600
                                break-all
                            ">
                                {finalBookingId}
                            </span>

                        </div>

                        <p className="
                            text-xs
                            text-gray-400
                            mt-2
                        ">
                            Please save this ID for
                            future reference.
                        </p>

                    </div>


                    {/* ================= FLIGHT DETAILS ================= */}

                    <div className="
                        px-5
                        sm:px-8
                        py-6
                    ">

                        <h2 className="
                            text-xl
                            sm:text-2xl
                            font-bold
                            text-gray-800
                            mb-5
                        ">
                            Flight Details
                        </h2>


                        {/* DEPARTURE */}

                        {selectedOnwardFlight && (

                            <div className="
                                rounded-2xl
                                border
                                border-blue-100
                                bg-blue-50
                                p-4
                                sm:p-6
                                mb-5
                            ">

                                <div className="
                                    flex
                                    flex-col
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                    gap-3
                                    mb-5
                                ">

                                    <div>

                                        <span className="
                                            inline-block
                                            px-3
                                            py-1
                                            rounded-full
                                            bg-blue-100
                                            text-blue-600
                                            text-xs
                                            sm:text-sm
                                            font-semibold
                                        ">
                                            DEPARTURE
                                        </span>

                                    </div>

                                    <span className="
                                        text-sm
                                        text-gray-500
                                    ">
                                        {selectedOnwardFlight.flightNumber}
                                    </span>

                                </div>


                                {/* ROUTE */}

                                <div className="
                                    grid
                                    grid-cols-[1fr_auto_1fr]
                                    items-center
                                    gap-3
                                    sm:gap-6
                                ">

                                    {/* SOURCE */}

                                    <div>

                                        <p className="
                                            text-2xl
                                            sm:text-3xl
                                            font-bold
                                            text-gray-800
                                        ">
                                            {
                                                selectedOnwardFlight
                                                    .departureTime
                                            }
                                        </p>

                                        <p className="
                                            mt-1
                                            text-sm
                                            sm:text-base
                                            font-semibold
                                            text-gray-600
                                            wrap-break-word
                                        ">
                                            {
                                                selectedOnwardFlight
                                                    .source
                                            }
                                        </p>

                                    </div>


                                    {/* ARROW */}

                                    <div className="
                                        flex
                                        flex-col
                                        items-center
                                    ">

                                        <span className="
                                            text-blue-500
                                            text-xl
                                            sm:text-2xl
                                        ">
                                            ✈
                                        </span>

                                        <div className="
                                            hidden
                                            sm:block
                                            w-16
                                            border-t
                                            border-dashed
                                            border-blue-300
                                            mt-1
                                        " />

                                    </div>


                                    {/* DESTINATION */}

                                    <div className="
                                        text-right
                                    ">

                                        <p className="
                                            text-2xl
                                            sm:text-3xl
                                            font-bold
                                            text-gray-800
                                        ">
                                            {
                                                selectedOnwardFlight
                                                    .arrivalTime
                                            }
                                        </p>

                                        <p className="
                                            mt-1
                                            text-sm
                                            sm:text-base
                                            font-semibold
                                            text-gray-600
                                            wrap-break-word
                                        ">
                                            {
                                                selectedOnwardFlight
                                                    .destination
                                            }
                                        </p>

                                    </div>

                                </div>


                                {/* AIRLINE */}

                                <div className="
                                    border-t
                                    border-blue-100
                                    mt-5
                                    pt-4
                                    flex
                                    flex-col
                                    sm:flex-row
                                    sm:justify-between
                                    gap-2
                                ">

                                    <p className="
                                        text-sm
                                        text-gray-500
                                    ">
                                        Airline
                                    </p>

                                    <p className="
                                        text-sm
                                        font-semibold
                                        text-gray-800
                                    ">
                                        {
                                            selectedOnwardFlight
                                                .airline
                                        }
                                    </p>

                                </div>

                            </div>

                        )}


                        {/* RETURN */}

                        {selectedReturnFlight && (

                            <div className="
                                rounded-2xl
                                border
                                border-green-100
                                bg-green-50
                                p-4
                                sm:p-6
                            ">

                                <div className="
                                    flex
                                    flex-col
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                    gap-3
                                    mb-5
                                ">

                                    <span className="
                                        inline-block
                                        w-fit
                                        px-3
                                        py-1
                                        rounded-full
                                        bg-green-100
                                        text-green-600
                                        text-xs
                                        sm:text-sm
                                        font-semibold
                                    ">
                                        RETURN
                                    </span>

                                    <span className="
                                        text-sm
                                        text-gray-500
                                    ">
                                        {
                                            selectedReturnFlight
                                                .flightNumber
                                        }
                                    </span>

                                </div>


                                {/* ROUTE */}

                                <div className="
                                    grid
                                    grid-cols-[1fr_auto_1fr]
                                    items-center
                                    gap-3
                                    sm:gap-6
                                ">

                                    {/* SOURCE */}

                                    <div>

                                        <p className="
                                            text-2xl
                                            sm:text-3xl
                                            font-bold
                                            text-gray-800
                                        ">
                                            {
                                                selectedReturnFlight
                                                    .departureTime
                                            }
                                        </p>

                                        <p className="
                                            mt-1
                                            text-sm
                                            sm:text-base
                                            font-semibold
                                            text-gray-600
                                        ">
                                            {
                                                selectedReturnFlight
                                                    .source
                                            }
                                        </p>

                                    </div>


                                    {/* ARROW */}

                                    <div className="
                                        flex
                                        flex-col
                                        items-center
                                    ">

                                        <span className="
                                            text-green-500
                                            text-xl
                                            sm:text-2xl
                                        ">
                                            ✈
                                        </span>

                                        <div className="
                                            hidden
                                            sm:block
                                            w-16
                                            border-t
                                            border-dashed
                                            border-green-300
                                            mt-1
                                        " />

                                    </div>


                                    {/* DESTINATION */}

                                    <div className="
                                        text-right
                                    ">

                                        <p className="
                                            text-2xl
                                            sm:text-3xl
                                            font-bold
                                            text-gray-800
                                        ">
                                            {
                                                selectedReturnFlight
                                                    .arrivalTime
                                            }
                                        </p>

                                        <p className="
                                            mt-1
                                            text-sm
                                            sm:text-base
                                            font-semibold
                                            text-gray-600
                                        ">
                                            {
                                                selectedReturnFlight
                                                    .destination
                                            }
                                        </p>

                                    </div>

                                </div>


                                {/* AIRLINE */}

                                <div className="
                                    border-t
                                    border-green-100
                                    mt-5
                                    pt-4
                                    flex
                                    flex-col
                                    sm:flex-row
                                    sm:justify-between
                                    gap-2
                                ">

                                    <p className="
                                        text-sm
                                        text-gray-500
                                    ">
                                        Airline
                                    </p>

                                    <p className="
                                        text-sm
                                        font-semibold
                                        text-gray-800
                                    ">
                                        {
                                            selectedReturnFlight
                                                .airline
                                        }
                                    </p>

                                </div>

                            </div>

                        )}

                    </div>


                    {/* ================= ACTIONS ================= */}

                    <div className="
                        bg-gray-50
                        border-t
                        border-gray-200
                        px-5
                        sm:px-8
                        py-6
                    ">

                        <div className="
                            flex
                            flex-col-reverse
                            sm:flex-row
                            gap-3
                            sm:justify-end
                        ">

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/")
                                }
                                className="
                                    w-full
                                    sm:w-auto
                                    px-6
                                    h-11
                                    border
                                    border-gray-300
                                    bg-white
                                    hover:bg-gray-100
                                    text-gray-700
                                    font-semibold
                                    rounded-xl
                                    transition
                                "
                            >
                                Back to Home
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/flights"
                                    )
                                }
                                className="
                                    w-full
                                    sm:w-auto
                                    px-6
                                    h-11
                                    bg-blue-600
                                    hover:bg-blue-700
                                    text-white
                                    font-semibold
                                    rounded-xl
                                    transition
                                "
                            >
                                Book Another Flight
                            </button>

                        </div>

                    </div>

                </div>


                {/* FOOTER MESSAGE */}

                <div className="
                    text-center
                    mt-6
                ">

                    <p className="
                        text-sm
                        text-gray-500
                    ">
                        ✈️ Thank you for booking
                        with us!
                    </p>

                    <p className="
                        text-xs
                        text-gray-400
                        mt-1
                    ">
                        Have a safe and pleasant journey.
                    </p>

                </div>

            </main>

        </div>
    );
};

export default BookingConfirmation;