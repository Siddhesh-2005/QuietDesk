import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import authService from "../appwriteservices/auth";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";

function Home() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const searchToken = searchParams.get("secret");
  const userId = searchParams.get("userId");

  useEffect(() => {
    async function handleAuth() {
      try {
        let user = await authService.getCurrentUser();

        if (!user && userId && searchToken) {
          // Try creating a session with magic link
          await authService.login({ userId, secret: searchToken });
          user = await authService.getCurrentUser();


        }

        if (user) {
          console.log("Dispatching user to Redux:", user);
          dispatch(login(user));
        } else {
          console.log("No user found, staying on login");
          navigate("/", { replace: true }); // back to login page
        }
      } catch (error) {
        console.error("Auth error:", error);
        navigate("/", { replace: true });
      }
    }

    handleAuth();
  }, [userId, searchToken, dispatch, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to QuietDesk
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            A place for focused discussions and meaningful conversations.
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature cards can be added here later */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
