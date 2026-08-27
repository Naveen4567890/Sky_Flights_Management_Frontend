import { createBrowserRouter } from "react-router-dom";
import Register from "../auth/Register";
import Login from "../auth/Login";
import PrivateRoute from "./PrivateRoute";
import LandingPage from "../pages/LandingPage";
import FlightResults from "../pages/FlightResult";
import PassengerDetails from "../pages/PassengerDetails";
import BookingReview from "../pages/BookingReview";
import Payment from "../pages/Payment";
import BookingConfirmation from "../pages/BookingConfirmation";
import OAuthSuccess from "../pages/OAuthSuccess"

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
        element:<PrivateRoute><FlightResults/></PrivateRoute>
      },
      {
        path:"/passengers",
        element:<PrivateRoute><PassengerDetails/></PrivateRoute>

      },
      {
        path:"/booking-review",
        element:<PrivateRoute><BookingReview/></PrivateRoute>
      },
      {
        path:"/payment",
        element:<PrivateRoute><Payment/></PrivateRoute>
      },
      {
        path:"/booking-confirmation",
        element:<PrivateRoute><BookingConfirmation/></PrivateRoute>
      }, 
      {
         path:"/oauth-success",
         element:<OAuthSuccess/>
      },
]);

export default route;