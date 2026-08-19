import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute({children}) {
  const {token} = useSelector((state)=>state.auth) 
  return token ? children : <Navigate to="/login" replace />;
}

