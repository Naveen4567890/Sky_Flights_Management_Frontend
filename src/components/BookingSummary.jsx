import React from "react";

const BookingSummary = ({
  onwardFlight,
  returnFlight,
  passengers = [],
}) => {
  const onwardPrice = Number(onwardFlight?.price || 0);
  const returnPrice = Number(returnFlight?.price || 0);

  const passengerCount = Math.max(passengers.length, 1);

  const total =
    (onwardPrice + returnPrice) * passengerCount;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-blue-500 px-5 sm:px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-xl">✈️</span>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Booking Summary
            </h2>

            <p className="text-sm text-blue-100">
              Review your selected flights
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">

        {/* Departure */}
        {onwardFlight && (
          <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 sm:p-5">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">

              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  ✈️
                </span>

                <h3 className="font-bold text-gray-800">
                  Departure
                </h3>
              </div>

              <span className="text-sm font-semibold text-blue-600">
                ₹{onwardPrice}
              </span>

            </div>

            {/* Route */}
            <div className="flex items-center justify-between gap-3">

              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-gray-800">
                  {onwardFlight.departureTime}
                </p>

                <p className="text-sm sm:text-base font-medium text-gray-600 truncate">
                  {onwardFlight.source}
                </p>
              </div>

              <div className="flex-1 flex items-center justify-center">
                <div className="hidden sm:block flex-1 border-t border-dashed border-blue-300" />

                <span className="mx-2 sm:mx-4 text-xl text-blue-500">
                  →
                </span>

                <div className="hidden sm:block flex-1 border-t border-dashed border-blue-300" />
              </div>

              <div className="text-right min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-gray-800">
                  {onwardFlight.arrivalTime}
                </p>

                <p className="text-sm sm:text-base font-medium text-gray-600 truncate">
                  {onwardFlight.destination}
                </p>
              </div>

            </div>

            <div className="border-t border-blue-100 mt-4 pt-3">

              <p className="text-sm text-gray-500">
                {onwardFlight.airline}
                {" • "}
                {onwardFlight.flightNumber}
              </p>

            </div>

          </div>
        )}

        {/* Return */}
        {returnFlight && (
          <div className="mt-4 rounded-xl bg-green-50 border border-green-100 p-4 sm:p-5">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">

              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  ↩️
                </span>

                <h3 className="font-bold text-gray-800">
                  Return
                </h3>
              </div>

              <span className="text-sm font-semibold text-green-600">
                ₹{returnPrice}
              </span>

            </div>

            {/* Route */}
            <div className="flex items-center justify-between gap-3">

              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-gray-800">
                  {returnFlight.departureTime}
                </p>

                <p className="text-sm sm:text-base font-medium text-gray-600 truncate">
                  {returnFlight.source}
                </p>
              </div>

              <div className="flex-1 flex items-center justify-center">

                <div className="hidden sm:block flex-1 border-t border-dashed border-green-300" />

                <span className="mx-2 sm:mx-4 text-xl text-green-500">
                  →
                </span>

                <div className="hidden sm:block flex-1 border-t border-dashed border-green-300" />

              </div>

              <div className="text-right min-w-0">

                <p className="text-xl sm:text-2xl font-bold text-gray-800">
                  {returnFlight.arrivalTime}
                </p>

                <p className="text-sm sm:text-base font-medium text-gray-600 truncate">
                  {returnFlight.destination}
                </p>

              </div>

            </div>

            <div className="border-t border-green-100 mt-4 pt-3">

              <p className="text-sm text-gray-500">
                {returnFlight.airline}
                {" • "}
                {returnFlight.flightNumber}
              </p>

            </div>

          </div>
        )}

        {/* Price Breakdown */}
        <div className="mt-6 border-t border-gray-200 pt-5">

          <h3 className="text-base font-bold text-gray-800 mb-4">
            Price Details
          </h3>

          <div className="space-y-3">

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                Departure fare
              </span>

              <span className="font-medium text-gray-800">
                ₹{onwardPrice}
              </span>
            </div>

            {returnFlight && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Return fare
                </span>

                <span className="font-medium text-gray-800">
                  ₹{returnPrice}
                </span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                Passengers
              </span>

              <span className="font-medium text-gray-800">
                {passengers.length}
              </span>
            </div>

          </div>

        </div>

        {/* Total */}
        <div className="mt-5 pt-5 border-t border-gray-200">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Amount
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {passengerCount} passenger
                {passengerCount !== 1 ? "s" : ""}
              </p>
            </div>

            <p className="text-2xl sm:text-3xl font-bold text-blue-600">
              ₹{total}
            </p>

          </div>

        </div>

      </div>
    </div>
  );
};

export default BookingSummary;