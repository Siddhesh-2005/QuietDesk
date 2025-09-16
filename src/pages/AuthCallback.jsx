import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import authService from "../appwriteservices/auth";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const secret = searchParams.get("secret");
    const userId = searchParams.get("userId");

    async function handleAuthCallback() {
      if (userId && secret) {
        try {
         
          await authService.loginWithMagicURL({ userId, secret });
          const user = await authService.getCurrentUser();
          
          if (user) {
            console.log("Dispatching user to Redux:", user);
            dispatch(login(user));
            navigate("/home", { replace: true }); // Redirect to home on success
          } else {
          
            console.error("Session created but failed to get user.");
            navigate("/", { replace: true });
          }
        } catch (error) {
          console.error("Auth callback error:", error);
          navigate("/", { replace: true }); // On failure, redirect to login
        }
      } else {
        console.log("No userId/secret found in URL, redirecting to login.");
        navigate("/", { replace: true });
      }
    }

    handleAuthCallback();
  }, [searchParams, dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Authenticating...
        </h1>
        <p className="text-gray-600 mt-2">Please wait while we verify your session.</p>
        {/* You can add a spinner here */}
      </div>
    </div>
  );
}

export default AuthCallback;