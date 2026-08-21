import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import BookingSummary from "./BookingSummary";
import { createBooking } from "../slice/BookingSlice";

const BookingReview = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    selectedOnwardFlight,
    selectedReturnFlight,
    confirmSeat,
  } = useSelector((state) => state.flight);

  const {
    passengers = [],
    loading,
  } = useSelector((state) => state.booking);

  // ==========================================
  // VALIDATION
  // ==========================================

  if (!selectedOnwardFlight) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

        <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-8 text-center">

          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-5">
            <span className="text-3xl">
              ✈️
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Flight Not Selected
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Please select a flight before reviewing your booking.
          </p>

          <button
            type="button"
            onClick={() => navigate("/flights")}
            className="
              w-full
              mt-6
              h-11
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-semibold
              rounded-lg
              transition
            "
          >
            Go to Flights
          </button>

        </div>
      </div>
    );
  }

  // ==========================================
  // CREATE BOOKING
  // ==========================================

  const handleProceedToPayment = async () => {

    // Passenger validation
    if (passengers.length === 0) {
      toast.error("Please add passenger details");
      return;
    }

    // Seat validation
    const onwardSeat = confirmSeat[selectedOnwardFlight.id];

    if (!onwardSeat) {
      toast.error("Please select a seat for the departure flight");
      return;
    }

    let returnSeat = null;

    if (selectedReturnFlight) {
      returnSeat = confirmSeat[selectedReturnFlight.id];

      if (!returnSeat) {
        toast.error("Please select a seat for the return flight");
        return;
      }
    }

    // ==========================================
    // BOOKING REQUEST
    // ==========================================

    const bookingData = {
      onwardFlightId: selectedOnwardFlight.id,

      returnFlightId: selectedReturnFlight
        ? selectedReturnFlight.id
        : null,

      passengers,

      // Send confirmed seat information
      onwardSeatNumber:onwardSeat,

      returnSeatNumber:returnSeat
    };

    console.log("Booking Request:", bookingData);

    try {

      await dispatch(
        createBooking(bookingData)
      ).unwrap();

      toast.success(
        "Booking details saved successfully!"
      );

      navigate("/payment");

    } catch (error) {

      toast.error(
        typeof error === "string"
          ? error
          : "Booking failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Review Booking
              </h1>

              <p className="text-sm sm:text-base text-gray-500 mt-1">
                Check your flight and passenger details
                before payment
              </p>

            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">

              <span className="text-lg">
                👤
              </span>

              <span className="text-sm font-semibold text-blue-600">
                {passengers.length} Passenger
                {passengers.length !== 1 ? "s" : ""}
              </span>

            </div>

          </div>

        </div>

      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            <BookingSummary
              onwardFlight={selectedOnwardFlight}
              returnFlight={selectedReturnFlight}
              passengers={passengers}
            />

            {/* Passenger Details */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

              <div className="px-5 sm:px-6 py-5 border-b border-gray-100">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    👤
                  </div>

                  <div>

                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                      Passenger Details
                    </h2>

                    <p className="text-sm text-gray-500">
                      Verify passenger information
                    </p>

                  </div>

                </div>

              </div>

              <div className="p-5 sm:p-6 space-y-4">

                {passengers.length === 0 ? (

                  <div className="text-center py-6">
                    <p className="text-gray-500">
                      No passenger details found.
                    </p>
                  </div>

                ) : (

                  passengers.map((passenger, index) => (

                    <div
                      key={index}
                      className="
                        rounded-xl
                        border
                        border-gray-200
                        bg-gray-50
                        p-4
                      "
                    >

                      <div className="flex items-center gap-3 mb-4">

                        <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">

                          <span className="text-sm font-bold text-purple-600">
                            {index + 1}
                          </span>

                        </div>

                        <div>

                          <h3 className="font-semibold text-gray-800">
                            Passenger {index + 1}
                          </h3>

                          <p className="text-xs text-gray-500">
                            Passenger information
                          </p>

                        </div>

                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <Detail
                          label="Full Name"
                          value={`${passenger.firstName} ${passenger.lastName}`}
                        />

                        <Detail
                          label="Email"
                          value={passenger.email}
                        />

                        <Detail
                          label="Phone"
                          value={passenger.phone}
                        />

                        <Detail
                          label="Date of Birth"
                          value={passenger.dateOfBirth}
                        />

                      </div>

                    </div>

                  ))
                )}

              </div>

            </section>

          </div>

          {/* RIGHT */}
          <aside className="lg:col-span-1">

            <div className="lg:sticky lg:top-6">

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">

                <h2 className="text-lg font-bold text-gray-800">
                  Complete Your Booking
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Everything looks good?
                </p>

                {/* Steps */}
                <div className="mt-6 space-y-4">

                  <div className="flex items-center gap-3">

                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      ✓
                    </div>

                    <div>

                      <p className="text-sm font-semibold text-gray-800">
                        Flight Selected
                      </p>

                      <p className="text-xs text-gray-500">
                        Completed
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-3">

                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      ✓
                    </div>

                    <div>

                      <p className="text-sm font-semibold text-gray-800">
                        Passenger Details
                      </p>

                      <p className="text-xs text-gray-500">
                        Completed
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-3">

                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      3
                    </div>

                    <div>

                      <p className="text-sm font-semibold text-gray-800">
                        Payment
                      </p>

                      <p className="text-xs text-gray-500">
                        Next step
                      </p>

                    </div>

                  </div>

                </div>

                {/* BUTTONS */}
                <div className="mt-6 space-y-3">

                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleProceedToPayment}
                    className="
                      w-full
                      h-12
                      bg-blue-600
                      hover:bg-blue-700
                      disabled:bg-gray-400
                      disabled:cursor-not-allowed
                      text-white
                      font-semibold
                      rounded-xl
                      shadow-md
                      transition
                    "
                  >
                    {loading
                      ? "Saving Booking..."
                      : "Proceed to Payment →"}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/passengers")}
                    className="
                      w-full
                      h-11
                      border
                      border-gray-300
                      hover:bg-gray-50
                      text-gray-700
                      font-medium
                      rounded-xl
                      transition
                    "
                  >
                    ← Edit Passenger Details
                  </button>

                </div>

                <div className="mt-5 pt-5 border-t border-gray-100">

                  <div className="flex gap-3">

                    <span className="text-lg">
                      🔒
                    </span>

                    <p className="text-xs text-gray-500 leading-relaxed">
                      Your booking information is securely
                      processed. Review all details before
                      proceeding to payment.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
};


// ==========================================
// DETAIL COMPONENT
// ==========================================

const Detail = ({ label, value }) => (
  <div>

    <p className="text-xs text-gray-400 uppercase tracking-wide">
      {label}
    </p>

    <p className="text-sm font-medium text-gray-800 mt-1 break-all">
      {value || "N/A"}
    </p>

  </div>
);

export default BookingReview;