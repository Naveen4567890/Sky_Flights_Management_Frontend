import { createBrowserRouter } from "react-router-dom";
import Register from "../auth/Register";
import Login from "../auth/Login";
import Home from "../pages/Home";
import PrivateRoute from "./PrivateRoute";
import LandingPage from "../pages/LandingPage";
import FlightResults from "../pages/FlightResult";
import PassengerDetails from "../pages/PassengerDetails";
import BookingReview from "../pages/BookingReview";
import Payment from "../pages/Payment";
import BookingConfirmation from "../pages/BookingConfirmation";

const route = createBrowserRouter([
      {
        path:"/",
        element:<LandingPage/>
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path:"/flights",
        element:<FlightResults/>
      },
      {
        path:"/passengers",
        element:<PassengerDetails/>

      },
      {
        path:"/booking-review",
        element:<BookingReview/>
      },
      {
        path:"/payment",
        element:<Payment/>
      },
      {
        path:"/booking-confirmation",
        element:<BookingConfirmation/>
      },
      {  
        path: "/home",
        element:<PrivateRoute><Home/></PrivateRoute>
      },
      
    
]);

export default route;