import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

function LogoutBtn() {
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const handleLogout = () => {
    authService
      .logout()
      .then(() => {
        dispatch(logout);
        navigate("/");
      })
      .catch((error) => {
        throw error;
      });
    console.log("logout");
  };
  return (
    <button className="bg-red-600 text-white p-4" onClick={handleLogout}>
      Logout
    </button>
  );
}

export default LogoutBtn;
