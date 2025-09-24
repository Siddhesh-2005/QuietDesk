import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import authService from "../../appwriteservices/auth";


function LogoutBtn() {
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const handleLogout = () => {
    authService
      .logout()
      .then(() => {
        dispatch(logout());
        navigate("/");
      })
      .catch((error) => {
        throw error;
      });
    console.log("logout");
  };
  return (
    <button
      onClick={handleLogout}
      className="
        inline-block px-4 py-2
        text-sm font-medium text-white
        bg-red-600 rounded-full
        hover:bg-red-700 focus:outline-none
        focus:ring-2 focus:ring-offset-2 focus:ring-red-500
        transition-colors duration-200
      "
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
