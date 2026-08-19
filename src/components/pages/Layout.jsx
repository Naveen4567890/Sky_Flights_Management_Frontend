import { useLocation, Link, useNavigate } from "react-router-dom";
import { FiHome, FiMessageCircle, FiUser, FiLogOut } from "react-icons/fi";
import { FaRegCompass, FaRegHeart } from "react-icons/fa6";
import { LuSettings } from "react-icons/lu";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { logoutUser } from "../slice/AuthSlice";

const Layout = ({ children }) => {

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/home", label: "Home", icon: FiHome },
    { path: "/explore", label: "Explore", icon: FaRegCompass },
    { path: "/messages", label: "Messages", icon: FiMessageCircle },
    { path: "/notifications", label: "Notifications", icon: FaRegHeart },
    { path: "/profile", label: "Profile", icon: FiUser },
    { path: "/settings", label: "Settings", icon: LuSettings },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logout successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-56 lg:w-64 bg-white border-r border-gray-200 flex-col shadow-sm z-50">

        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-gray-200">
          <Link to="/" className="flex items-center">
            <span className="text-3xl font-bold bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Sky Flights
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 lg:px-4 py-6 space-y-2 overflow-y-auto">

          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`
                flex items-center gap-3 lg:gap-4
                px-3 lg:px-4
                py-3
                rounded-xl
                transition-all duration-200
                ${
                  isActive(path)
                    ? "bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                }
              `}
            >
              <Icon
                size={23}
                className="shrink-0"
              />

              <span className="text-sm lg:text-base font-medium">
                {label}
              </span>
            </Link>
          ))}

        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="
              w-full
              h-11
              lg:h-12
              rounded-xl
              bg-red-500
              hover:bg-red-600
              active:bg-red-700
              text-white
              font-semibold
              flex
              items-center
              justify-center
              gap-2
              transition
            "
          >
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ================= MOBILE HEADER ================= */}
      <header
        className="
          md:hidden
          fixed
          top-0
          left-0
          right-0
          h-16
          bg-white
          border-b
          border-gray-200
          shadow-sm
          z-50
          flex
          items-center
          justify-between
          px-4
        "
      >
        <Link to="/" className="flex items-center gap-2">

          

          <span
            className="
              text-2xl
              sm:text-3xl
              font-bold
              bg-linear-to-r
              from-blue-500
              to-purple-600
              bg-clip-text
              text-transparent
            "
          >
            Sky Flights
          </span>

        </Link>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main
        className="
          md:ml-56
          lg:ml-64
          min-h-screen
          w-auto
          pt-16
          md:pt-0
          pb-20
          md:pb-0
        "
      >
        <div className="w-full min-h-screen">
          {children}
        </div>
      </main>

      {/* ================= MOBILE BOTTOM NAVIGATION ================= */}
      <nav
        className="
          md:hidden
          fixed
          bottom-0
          left-0
          right-0
          h-16
          bg-white
          border-t
          border-gray-200
          shadow-[0_-4px_15px_rgba(0,0,0,0.08)]
          z-50
        "
      >
        <div className="h-full flex items-center justify-around">

          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`
                h-full
                flex-1
                flex
                flex-col
                items-center
                justify-center
                transition-all
                duration-200
                ${
                  isActive(path)
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-800"
                }
              `}
            >
              <Icon
                size={22}
                className={`
                  transition-transform
                  ${
                    isActive(path)
                      ? "scale-110"
                      : ""
                  }
                `}
              />

              <span
                className={`
                  text-[10px]
                  sm:text-xs
                  font-medium
                  mt-1
                  ${
                    isActive(path)
                      ? "text-blue-600"
                      : "text-gray-500"
                  }
                `}
              >
                {label}
              </span>
            </Link>
          ))}

        </div>
      </nav>

    </div>
  );
};

export default Layout;