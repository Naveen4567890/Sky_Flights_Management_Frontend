import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiCalendar,
  FiUsers,
  FiArrowRight,
  FiCheckCircle,
  FiShield,
  FiClock,
  FiChevronDown,
} from "react-icons/fi";
import { FaPlaneDeparture, FaPlaneArrival } from "react-icons/fa";

import { Airports } from "../data/Airport";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { flightSearch } from "../slice/FlightSlice";

const LandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const MAX_TRAVELERS = 9;

  const [travelerError, setTravelerError] = useState("");

  const [travelerOpen, setTravelerOpen] = useState(false);
  const [cabinOpen, setCabinOpen] = useState(false);

  const [traveller, setTraveller] = useState({
    ADULT: 1,
    CHILD: 0,
    INFANT: 0,
  });

  const [cabin, setCabin] = useState("Economy");

  const updateTraveler = (type, value) => {
    setTraveller((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + value),
    }));
  };

  const totalTravelers =
    traveller.ADULT + traveller.CHILD + traveller.INFANT;

  const today = new Date().toISOString().split("T")[0];

  const [tripType, setTripType] = useState("ROUND_TRIP");

  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const [sources, setSources] = useState(null);
  const [destinations, setDestinations] = useState(null);

  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");

  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  // ==========================================
  // FILTER AIRPORTS
  // ==========================================

  const filteredFromAirports = Airports.list.filter((airport) =>
    `${airport.city} ${airport.country} ${airport.code} ${airport.name}`
      .toLowerCase()
      .includes(fromSearch.toLowerCase())
  );

  const filteredToAirports = Airports.list.filter((airport) =>
    `${airport.city} ${airport.country} ${airport.code} ${airport.name}`
      .toLowerCase()
      .includes(toSearch.toLowerCase())
  );

  // ==========================================
  // SWAP AIRPORTS
  // ==========================================

  const handleSwapAirports = () => {
    if (!sources && !destinations) {
      toast.error("Please select source and destination first");
      return;
    }

    setSources(destinations);
    setDestinations(sources);

    setFromSearch("");
    setToSearch("");

    setShowFromDropdown(false);
    setShowToDropdown(false);
  };

  // ==========================================
  // SEARCH FLIGHTS
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sources) {
      toast.error("Please select a source airport");
      return;
    }

    if (!destinations) {
      toast.error("Please select a destination airport");
      return;
    }

    if (!departureDate) {
      toast.error("Please select departure date");
      return;
    }

    if (tripType === "ROUND_TRIP" && !returnDate) {
      toast.error("Please select return date");
      return;
    }

    const source = sources.code;
    const destination = destinations.code;

    if (source === destination) {
      toast.error("Source and destination should be different");
      return;
    }

    const payload = {
      tripType,
      source,
      destination,
      departureDate,
      returnDate: tripType === "ONE_WAY" ? null : returnDate,
      cabin,
      travelers: traveller,
      totalTravelers,
    };

    console.log(payload);

    

    try {
     
      await dispatch(flightSearch(payload)).unwrap();

      navigate("/flights");
    } catch (error) {
      console.error("Flight Search Error:", error);
      toast.error("Unable to search flights");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* ========================================================= */}
      {/* NAVBAR */}
      {/* ========================================================= */}

      <nav className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-20 flex items-center justify-between">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <FaPlaneDeparture className="text-white text-xl" />
              </div>

              <span className="text-2xl sm:text-3xl font-bold text-white">
                Sky Flights
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 text-white">

              <a
                href="#home"
                className="hover:text-blue-200 transition cursor-pointer"
              >
                Home
              </a>

              <a
                href="#destinations"
                className="hover:text-blue-200 transition cursor-pointer"
              >
                Destinations
              </a>

              <a
                href="#offers"
                className="hover:text-blue-200 transition cursor-pointer"
              >
                Offers
              </a>

              <a
                href="#about"
                className="hover:text-blue-200 transition cursor-pointer"
              >
                About
              </a>

            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">

              <Link
                to="/login"
                className="px-3 sm:px-5 py-2 text-sm sm:text-base text-white font-medium border border-white/40 hover:bg-white/10 rounded-lg transition cursor-pointer"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-3 sm:px-5 py-2 text-sm sm:text-base bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition cursor-pointer"
              >
                Sign Up
              </Link>

            </div>

          </div>
        </div>
      </nav>

      {/* ========================================================= */}
      {/* HERO */}
      {/* ========================================================= */}

      <section
        id="home"
        className="
          relative
          min-h-170
          sm:min-h-180
          flex
          items-center
          justify-center
          overflow-visible
          bg-cover
          bg-center
          bg-no-repeat
        "
        style={{
          backgroundImage:
            "url('https://images.financialexpressdigital.com/2026/08/Air-India-long-haul-flights.jpg?w=1200')",
        }}
      >

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/35" />

        {/* Blue Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-blue-950/70 via-blue-900/30 to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">

          {/* Hero Text */}
          <div className="text-center text-white max-w-3xl mx-auto">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-sm mb-6">

              <FaPlaneDeparture />

              <span>
                Travel smarter. Fly farther.
              </span>

            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight drop-shadow-lg">

              Your Journey

              <span className="block text-blue-200">
                Starts Here
              </span>

            </h1>

            <p className="mt-5 text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto">

              Discover amazing destinations, compare flight prices,
              and book your next adventure with ease.

            </p>

          </div>

          {/* ===================================================== */}
          {/* SEARCH CARD */}
          {/* ===================================================== */}

          <div className="mt-10 w-full max-w-350 mx-auto px-2 sm:px-4">

            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6">

              {/* ================================================= */}
              {/* TRIP TYPE */}
              {/* ================================================= */}

              <div className="flex flex-wrap gap-5 mb-6">

                {/* Round Trip */}
                <label className="flex items-center gap-2 cursor-pointer">

                  <input
                    type="radio"
                    name="trip"
                    value="ROUND_TRIP"
                    checked={tripType === "ROUND_TRIP"}
                    onChange={(e) => setTripType(e.target.value)}
                    className="accent-blue-600 cursor-pointer"
                  />

                  <span className="text-sm font-medium">
                    Round Trip
                  </span>

                </label>

                {/* One Way */}
                <label className="flex items-center gap-2 cursor-pointer">

                  <input
                    type="radio"
                    name="trip"
                    value="ONE_WAY"
                    checked={tripType === "ONE_WAY"}
                    onChange={(e) => {
                      setTripType(e.target.value);
                      setReturnDate("");
                    }}
                    className="accent-blue-600 cursor-pointer"
                  />

                  <span className="text-sm font-medium">
                    One Way
                  </span>

                </label>

              </div>

              {/* ================================================= */}
              {/* SEARCH FIELDS */}
              {/* ================================================= */}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

                {/* ================================================= */}
                {/* FROM */}
                {/* ================================================= */}

                <div className="relative border border-gray-200 rounded-xl p-3 hover:border-blue-400 transition">

                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">

                    <FaPlaneDeparture />

                    <span>
                      SOURCE
                    </span>

                  </div>

                  <input
                    type="text"
                    value={
                      sources
                        ? `${sources.city} (${sources.code})`
                        : fromSearch
                    }
                    placeholder="City or airport"
                    onChange={(e) => {
                      setSources(null);
                      setFromSearch(e.target.value);
                      setShowFromDropdown(true);
                    }}
                    onFocus={() => setShowFromDropdown(true)}
                    className="
                      w-full
                      font-semibold
                      text-gray-800
                      outline-none
                      bg-transparent
                      text-sm
                      placeholder:text-gray-400
                      cursor-text
                    "
                  />

                  {sources && (
                    <div className="text-xs text-gray-400 mt-1">
                      {sources.name}
                    </div>
                  )}

                  {/* FROM DROPDOWN */}
                  {showFromDropdown && fromSearch && (

                    <div
                      className="
                        absolute
                        z-50
                        left-0
                        right-0
                        top-full
                        mt-2
                        bg-white
                        border
                        border-gray-200
                        rounded-xl
                        shadow-xl
                        max-h-64
                        overflow-y-auto
                      "
                    >

                      {filteredFromAirports.length > 0 ? (

                        filteredFromAirports.map((airport) => (

                          <button
                            type="button"
                            key={airport.code}
                            onClick={() => {
                              setSources(airport);
                              setFromSearch("");
                              setShowFromDropdown(false);
                            }}
                            className="
                              w-full
                              text-left
                              px-4
                              py-3
                              hover:bg-blue-50
                              transition
                              border-b
                              border-gray-100
                              last:border-b-0
                              cursor-pointer
                            "
                          >

                            <div className="flex items-center justify-between">

                              <div>

                                <p className="font-semibold text-gray-800">
                                  {airport.city}
                                </p>

                                <p className="text-xs text-gray-500">
                                  {airport.name}
                                </p>

                                <p className="text-xs text-gray-400">
                                  {airport.country}
                                </p>

                              </div>

                              <span
                                className="
                                  font-bold
                                  text-blue-600
                                  text-sm
                                  bg-blue-50
                                  px-2
                                  py-1
                                  rounded
                                "
                              >
                                {airport.code}
                              </span>

                            </div>

                          </button>

                        ))

                      ) : (

                        <div className="px-4 py-4 text-sm text-gray-500">
                          No airports found
                        </div>

                      )}

                    </div>

                  )}

                </div>

                {/* ================================================= */}
                {/* SWAP BUTTON */}
                {/* ================================================= */}

                <div className="relative hidden lg:flex items-center justify-center -mx-2 z-10">

                  <button
                    type="button"
                    onClick={handleSwapAirports}
                    disabled={!sources && !destinations}
                    title="Swap source and destination"
                    className="
                      absolute
                      w-10
                      h-10
                      rounded-full
                      bg-white
                      border
                      border-gray-200
                      shadow-md
                      flex
                      items-center
                      justify-center
                      text-blue-600
                      hover:bg-blue-50
                      hover:border-blue-400
                      hover:shadow-lg
                      transition
                      cursor-pointer
                      disabled:opacity-40
                      disabled:cursor-not-allowed
                    "
                  >
                    ⇄
                  </button>

                </div>

                {/* ================================================= */}
                {/* TO */}
                {/* ================================================= */}

                <div className="relative border border-gray-200 rounded-xl p-3 hover:border-blue-400 transition">

                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">

                    <FaPlaneArrival />

                    <span>
                      DESTINATION
                    </span>

                  </div>

                  <input
                    type="text"
                    value={
                      destinations
                        ? `${destinations.city} (${destinations.code})`
                        : toSearch
                    }
                    placeholder="City or airport"
                    onChange={(e) => {
                      setDestinations(null);
                      setToSearch(e.target.value);
                      setShowToDropdown(true);
                    }}
                    onFocus={() => setShowToDropdown(true)}
                    className="
                      w-full
                      font-semibold
                      text-gray-800
                      outline-none
                      bg-transparent
                      text-sm
                      placeholder:text-gray-400
                      cursor-text
                    "
                  />

                  {destinations && (
                    <div className="text-xs text-gray-400 mt-1">
                      {destinations.name}
                    </div>
                  )}

                  {/* TO DROPDOWN */}
                  {showToDropdown && toSearch && (

                    <div
                      className="
                        absolute
                        z-50
                        left-0
                        right-0
                        top-full
                        mt-2
                        bg-white
                        border
                        border-gray-200
                        rounded-xl
                        shadow-xl
                        max-h-64
                        overflow-y-auto
                      "
                    >

                      {filteredToAirports.length > 0 ? (

                        filteredToAirports.map((airport) => (

                          <button
                            type="button"
                            key={airport.code}
                            onClick={() => {
                              setDestinations(airport);
                              setToSearch("");
                              setShowToDropdown(false);
                            }}
                            className="
                              w-full
                              text-left
                              px-4
                              py-3
                              hover:bg-blue-50
                              transition
                              border-b
                              border-gray-100
                              last:border-b-0
                              cursor-pointer
                            "
                          >

                            <div className="flex items-center justify-between">

                              <div>

                                <p className="font-semibold text-gray-800">
                                  {airport.city}
                                </p>

                                <p className="text-xs text-gray-500">
                                  {airport.name}
                                </p>

                                <p className="text-xs text-gray-400">
                                  {airport.country}
                                </p>

                              </div>

                              <span
                                className="
                                  font-bold
                                  text-blue-600
                                  text-sm
                                  bg-blue-50
                                  px-2
                                  py-1
                                  rounded
                                "
                              >
                                {airport.code}
                              </span>

                            </div>

                          </button>

                        ))

                      ) : (

                        <div className="px-4 py-4 text-sm text-gray-500">
                          No airports found
                        </div>

                      )}

                    </div>

                  )}

                </div>

                {/* ================================================= */}
                {/* DEPARTURE */}
                {/* ================================================= */}

                <div
                  className="
                    border
                    border-gray-200
                    rounded-xl
                    p-3
                    hover:border-blue-400
                    transition
                  "
                >

                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">

                    <FiCalendar />

                    <span>
                      DEPARTURE
                    </span>

                  </div>

                  <input
                    type="date"
                    value={departureDate}
                    min={today}
                    onChange={(e) => {

                      const selectedDate = e.target.value;

                      setDepartureDate(selectedDate);

                      if (
                        returnDate &&
                        returnDate < selectedDate
                      ) {
                        setReturnDate("");
                      }

                    }}
                    className="
                      w-full
                      font-semibold
                      text-gray-800
                      outline-none
                      bg-transparent
                      cursor-pointer
                    "
                  />

                </div>

                {/* ================================================= */}
                {/* RETURN */}
                {/* ================================================= */}

                <div
                  className={`
                    border
                    rounded-xl
                    p-3
                    transition
                    ${
                      tripType === "ONE_WAY"
                        ? "bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed"
                        : "border-gray-200 hover:border-blue-400"
                    }
                  `}
                >

                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">

                    <FiCalendar />

                    <span>
                      RETURN
                    </span>

                  </div>

                  {tripType === "ONE_WAY" ? (

                    <div className="font-semibold text-gray-400">
                      Not available for one way
                    </div>

                  ) : (

                    <input
                      type="date"
                      value={returnDate}
                      min={departureDate || today}
                      disabled={!departureDate}
                      onChange={(e) =>
                        setReturnDate(e.target.value)
                      }
                      className="
                        w-full
                        font-semibold
                        text-gray-800
                        outline-none
                        bg-transparent
                        cursor-pointer
                        disabled:cursor-not-allowed
                      "
                    />

                  )}

                </div>

              </div>

              {/* ================================================= */}
              {/* TRAVELERS + CABIN */}
              {/* ================================================= */}

              <div className="mt-4 flex flex-col sm:flex-row gap-3">

                {/* ================================================= */}
                {/* TRAVELERS */}
                {/* ================================================= */}

                <div className="relative w-full sm:w-55">

                  <button
                    type="button"
                    onClick={() => {
                      setTravelerOpen(!travelerOpen);
                      setCabinOpen(false);
                    }}
                    className="
                      w-full
                      h-13
                      border
                      border-gray-200
                      rounded-xl
                      px-3
                      flex
                      items-center
                      justify-between
                      bg-white
                      hover:border-blue-400
                      transition
                      cursor-pointer
                    "
                  >

                    <div className="flex items-center gap-2">

                      <FiUsers
                        className="text-blue-600"
                        size={19}
                      />

                      <div className="text-left">

                        <p className="text-[10px] text-gray-400 uppercase">
                          Travelers
                        </p>

                        <p className="text-sm font-semibold text-gray-800">
                          {totalTravelers} Traveler
                          {totalTravelers !== 1 ? "s" : ""}
                        </p>

                      </div>

                    </div>

                    <FiChevronDown
                      className={`
                        text-gray-500
                        transition-transform
                        ${
                          travelerOpen
                            ? "rotate-180"
                            : ""
                        }
                      `}
                    />

                  </button>

                  {/* Travelers Dropdown */}
                  {travelerOpen && (

                    <div
                      className="
                        absolute
                        z-50
                        mt-2
                        w-full
                        sm:w-70
                        bg-white
                        rounded-xl
                        shadow-2xl
                        border
                        border-gray-200
                        p-4
                      "
                    >

                      {/* Adults */}
                      <div className="flex items-center justify-between py-3">

                        <div>

                          <p className="font-semibold text-gray-800 text-sm">
                            Adults
                          </p>

                          <p className="text-xs text-gray-400">
                            Age 12+
                          </p>

                        </div>

                        <div className="flex items-center gap-3">

                          <button
                            type="button"
                            onClick={() => {

                              if (traveller.ADULT > 0) {

                                setTravelerError("");

                                updateTraveler(
                                  "ADULT",
                                  -1
                                );

                              }

                            }}
                            className="
                              w-8
                              h-8
                              rounded-full
                              border
                              border-gray-300
                              text-lg
                              hover:bg-gray-100
                              cursor-pointer
                              disabled:opacity-40
                              disabled:cursor-not-allowed
                            "
                            disabled={traveller.ADULT <= 1}
                          >
                            −
                          </button>

                          <span className="w-5 text-center font-semibold">
                            {traveller.ADULT}
                          </span>

                          <button
                            type="button"
                            onClick={() => {

                              if (
                                totalTravelers >=
                                MAX_TRAVELERS
                              ) {

                                setTravelerError(
                                  "You can select a maximum of 9 travelers"
                                );

                                return;
                              }

                              setTravelerError("");

                              updateTraveler(
                                "ADULT",
                                1
                              );

                            }}
                            className="
                              w-8
                              h-8
                              rounded-full
                              border
                              border-gray-300
                              text-lg
                              hover:bg-gray-100
                              cursor-pointer
                            "
                          >
                            +
                          </button>

                        </div>

                      </div>

                      {/* Children */}
                      <div className="flex items-center justify-between py-3 border-t">

                        <div>

                          <p className="font-semibold text-gray-800 text-sm">
                            Children
                          </p>

                          <p className="text-xs text-gray-400">
                            Age 2–11
                          </p>

                        </div>

                        <div className="flex items-center gap-3">

                          <button
                            type="button"
                            onClick={() => {

                              if (traveller.CHILD > 0) {

                                setTravelerError("");

                                updateTraveler(
                                  "CHILD",
                                  -1
                                );

                              }

                            }}
                            className="
                              w-8
                              h-8
                              rounded-full
                              border
                              border-gray-300
                              text-lg
                              hover:bg-gray-100
                              cursor-pointer
                              disabled:opacity-40
                              disabled:cursor-not-allowed
                            "
                            disabled={traveller.CHILD <= 0}
                          >
                            −
                          </button>

                          <span className="w-5 text-center font-semibold">
                            {traveller.CHILD}
                          </span>

                          <button
                            type="button"
                            onClick={() => {

                              if (
                                totalTravelers >=
                                MAX_TRAVELERS
                              ) {

                                setTravelerError(
                                  "You can select a maximum of 9 travelers"
                                );

                                return;
                              }

                              setTravelerError("");

                              updateTraveler(
                                "CHILD",
                                1
                              );

                            }}
                            className="
                              w-8
                              h-8
                              rounded-full
                              border
                              border-gray-300
                              text-lg
                              hover:bg-gray-100
                              cursor-pointer
                            "
                          >
                            +
                          </button>

                        </div>

                      </div>

                      {/* Infants */}
                      <div className="flex items-center justify-between py-3 border-t">

                        <div>

                          <p className="font-semibold text-gray-800 text-sm">
                            Infants
                          </p>

                          <p className="text-xs text-gray-400">
                            Under 2
                          </p>

                        </div>

                        <div className="flex items-center gap-3">

                          <button
                            type="button"
                            onClick={() => {

                              if (
                                traveller.INFANT > 0
                              ) {

                                setTravelerError("");

                                updateTraveler(
                                  "INFANT",
                                  -1
                                );

                              }

                            }}
                            className="
                              w-8
                              h-8
                              rounded-full
                              border
                              border-gray-300
                              text-lg
                              hover:bg-gray-100
                              cursor-pointer
                              disabled:opacity-40
                              disabled:cursor-not-allowed
                            "
                            disabled={traveller.INFANT <= 0}
                          >
                            −
                          </button>

                          <span className="w-5 text-center font-semibold">
                            {traveller.INFANT}
                          </span>

                          <button
                            type="button"
                            onClick={() => {

                              if (
                                totalTravelers >=
                                MAX_TRAVELERS
                              ) {

                                setTravelerError(
                                  "You can select a maximum of 9 travelers"
                                );

                                return;
                              }

                              setTravelerError("");

                              updateTraveler(
                                "INFANT",
                                1
                              );

                            }}
                            className="
                              w-8
                              h-8
                              rounded-full
                              border
                              border-gray-300
                              text-lg
                              hover:bg-gray-100
                              cursor-pointer
                            "
                          >
                            +
                          </button>

                        </div>

                      </div>

                      {/* Error */}
                      {travelerError && (

                        <p className="mt-2 text-xs text-red-500 text-center">
                          {travelerError}
                        </p>

                      )}

                      {/* Done */}
                      <button
                        type="button"
                        onClick={() =>
                          setTravelerOpen(false)
                        }
                        className="
                          w-full
                          mt-3
                          h-9
                          rounded-lg
                          bg-blue-600
                          text-white
                          text-sm
                          font-semibold
                          hover:bg-blue-700
                          cursor-pointer
                        "
                      >
                        Done
                      </button>

                    </div>

                  )}

                </div>

                {/* ================================================= */}
                {/* CABIN CLASS */}
                {/* ================================================= */}

                <div className="relative w-full sm:w-55">

                  <button
                    type="button"
                    onClick={() => {
                      setCabinOpen(!cabinOpen);
                      setTravelerOpen(false);
                    }}
                    className="
                      w-full
                      h-13
                      border
                      border-gray-200
                      rounded-xl
                      px-3
                      flex
                      items-center
                      justify-between
                      bg-white
                      hover:border-blue-400
                      transition
                      cursor-pointer
                    "
                  >

                    <div className="text-left">

                      <p className="text-[10px] text-gray-400 uppercase">
                        Cabin Class
                      </p>

                      <p className="text-sm font-semibold text-gray-800">
                        {cabin}
                      </p>

                    </div>

                    <FiChevronDown
                      className={`
                        text-gray-500
                        transition-transform
                        ${
                          cabinOpen
                            ? "rotate-180"
                            : ""
                        }
                      `}
                    />

                  </button>

                  {/* Cabin Dropdown */}
                  {cabinOpen && (

                    <div
                      className="
                        absolute
                        z-50
                        mt-2
                        w-full
                        bg-white
                        rounded-xl
                        shadow-2xl
                        border
                        border-gray-200
                        overflow-hidden
                      "
                    >

                      {[
                        "Economy",
                        "Premium Economy",
                        "Business",
                        "First",
                      ].map((cabinOption) => (

                        <button
                          key={cabinOption}
                          type="button"
                          onClick={() => {
                            setCabin(cabinOption);
                            setCabinOpen(false);
                          }}
                          className={`
                            w-full
                            text-left
                            px-4
                            py-3
                            text-sm
                            hover:bg-blue-50
                            transition
                            cursor-pointer
                            ${
                              cabin === cabinOption
                                ? "bg-blue-50 text-blue-600 font-semibold"
                                : "text-gray-700"
                            }
                          `}
                        >
                          {cabinOption}
                        </button>

                      ))}

                    </div>

                  )}

                </div>

                {/* ================================================= */}
                {/* SEARCH BUTTON */}
                {/* ================================================= */}

                <button
                  type="button"
                  className="
                    relative
                    w-full
                    sm:w-75
                    h-13
                    bg-linear-to-r
                    from-blue-600
                    to-purple-600
                    hover:from-blue-700
                    hover:to-purple-700
                    text-white
                    rounded-xl
                    font-semibold
                    flex
                    items-center
                    justify-center
                    gap-2
                    transition
                    shadow-lg
                    ml-0
                    sm:ml-20
                    md:ml-40
                    lg:ml-95
                    cursor-pointer
                  "
                  onClick={handleSubmit}
                >

                  <FiSearch size={20} />

                  Search Flights

                </button>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ========================================================= */}
      {/* FEATURES */}
      {/* ========================================================= */}

      <section className="py-16 sm:py-20 bg-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto">

            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
              Why choose Sky Flights?
            </p>

            <h2 className="mt-2 text-3xl sm:text-4xl font-bold">
              Everything you need for a better journey
            </h2>

            <p className="mt-4 text-gray-500">
              Simple, reliable and convenient flight booking designed
              for modern travelers.
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">

            {/* Easy Search */}
            <div className="p-6 rounded-2xl bg-blue-50 hover:shadow-lg transition">

              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center">

                <FiSearch size={24} />

              </div>

              <h3 className="mt-5 text-xl font-bold">
                Easy Flight Search
              </h3>

              <p className="mt-2 text-gray-500">
                Search and compare flights from multiple airlines
                in one convenient place.
              </p>

            </div>

            {/* Best Prices */}
            <div className="p-6 rounded-2xl bg-purple-50 hover:shadow-lg transition">

              <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center">

                <FiCheckCircle size={24} />

              </div>

              <h3 className="mt-5 text-xl font-bold">
                Best Prices
              </h3>

              <p className="mt-2 text-gray-500">
                Find competitive fares and choose the option
                that works best for your budget.
              </p>

            </div>

            {/* Secure Booking */}
            <div className="p-6 rounded-2xl bg-green-50 hover:shadow-lg transition">

              <div className="w-12 h-12 rounded-xl bg-green-600 text-white flex items-center justify-center">

                <FiShield size={24} />

              </div>

              <h3 className="mt-5 text-xl font-bold">
                Secure Booking
              </h3>

              <p className="mt-2 text-gray-500">
                Your booking information is protected with
                secure and reliable technology.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ========================================================= */}
      {/* DESTINATIONS */}
      {/* ========================================================= */}

      <section
        id="destinations"
        className="py-16 sm:py-20 bg-gray-50"
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

            <div>

              <p className="text-blue-600 font-semibold">
                Explore
              </p>

              <h2 className="text-3xl sm:text-4xl font-bold mt-1">
                Popular Destinations
              </h2>

              <p className="text-gray-500 mt-2">
                Find your next unforgettable destination.
              </p>

            </div>

            <button
              type="button"
              className="
                flex
                items-center
                gap-2
                text-blue-600
                font-semibold
                cursor-pointer
              "
            >
              View all
              <FiArrowRight />
            </button>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">

            {[
              {
                city: "Dubai",
                country: "United Arab Emirates",
                price: "From ₹12,999",
                image:
                  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
              },
              {
                city: "Singapore",
                country: "Singapore",
                price: "From ₹15,499",
                image:
                  "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
              },
              {
                city: "Bangkok",
                country: "Thailand",
                price: "From ₹13,999",
                image:
                  "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80",
              },
              {
                city: "London",
                country: "United Kingdom",
                price: "From ₹42,999",
                image:
                  "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
              },
            ].map((destination) => (

              <div
                key={destination.city}
                className="
                  group
                  bg-white
                  rounded-2xl
                  overflow-hidden
                  shadow-sm
                  hover:shadow-xl
                  transition
                  cursor-pointer
                "
              >

                <div className="relative h-48 overflow-hidden">

                  <img
                    src={destination.image}
                    alt={destination.city}
                    className="
                      w-full
                      h-full
                      object-cover
                      group-hover:scale-105
                      transition
                      duration-500
                    "
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />

                </div>

                <div className="p-4">

                  <h3 className="text-xl font-bold">
                    {destination.city}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {destination.country}
                  </p>

                  <div className="mt-4 flex items-center justify-between">

                    <span className="font-semibold text-blue-600">
                      {destination.price}
                    </span>

                    <FiArrowRight
                      className="
                        text-blue-600
                        group-hover:translate-x-1
                        transition
                      "
                    />

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* ========================================================= */}
      {/* CTA */}
      {/* ========================================================= */}

      <section
        id="offers"
        className="
          relative
          py-16
          sm:py-20
          bg-cover
          bg-center
          bg-no-repeat
        "
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80')",
        }}
      >

        <div className="absolute inset-0 bg-blue-950/70" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">

          <FiClock className="mx-auto text-white text-4xl mb-5" />

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Ready for your next adventure?
          </h2>

          <p className="mt-4 text-blue-100 text-base sm:text-lg">
            Search thousands of flights and start planning your
            next journey today.
          </p>

          <Link
            to="/home"
            className="
              inline-flex
              items-center
              gap-2
              mt-8
              px-7
              py-3
              bg-white
              text-blue-600
              rounded-xl
              font-bold
              hover:bg-blue-50
              transition
              cursor-pointer
            "
          >
            Book a Flight
            <FiArrowRight />
          </Link>

        </div>

      </section>

      {/* ========================================================= */}
      {/* FOOTER */}
      {/* ========================================================= */}

      <footer
        id="about"
        className="bg-gray-950 text-gray-400 py-10"
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Brand */}
            <div>

              <div className="flex items-center gap-2">

                <FaPlaneDeparture className="text-blue-500" />

                <span className="text-2xl font-bold text-white">
                  Sky Flights
                </span>

              </div>

              <p className="mt-4 text-sm leading-6">
                Making flight booking simple, secure and
                convenient for travelers everywhere.
              </p>

            </div>

            {/* Company */}
            <div>

              <h3 className="text-white font-semibold mb-4">
                Company
              </h3>

              <div className="space-y-2 text-sm">

                <p className="cursor-pointer hover:text-white transition">
                  About Us
                </p>

                <p className="cursor-pointer hover:text-white transition">
                  Careers
                </p>

                <p className="cursor-pointer hover:text-white transition">
                  Contact
                </p>

              </div>

            </div>

            {/* Support */}
            <div>

              <h3 className="text-white font-semibold mb-4">
                Support
              </h3>

              <div className="space-y-2 text-sm">

                <p className="cursor-pointer hover:text-white transition">
                  Help Center
                </p>

                <p className="cursor-pointer hover:text-white transition">
                  Booking Guide
                </p>

                <p className="cursor-pointer hover:text-white transition">
                  Cancellation
                </p>

              </div>

            </div>

            {/* Legal */}
            <div>

              <h3 className="text-white font-semibold mb-4">
                Legal
              </h3>

              <div className="space-y-2 text-sm">

                <p className="cursor-pointer hover:text-white transition">
                  Privacy Policy
                </p>

                <p className="cursor-pointer hover:text-white transition">
                  Terms & Conditions
                </p>

                <p className="cursor-pointer hover:text-white transition">
                  Refund Policy
                </p>

              </div>

            </div>

          </div>

          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">

            © 2026 Sky Flights. All rights reserved.

          </div>

        </div>

      </footer>

    </div>
  );
};

export default LandingPage;