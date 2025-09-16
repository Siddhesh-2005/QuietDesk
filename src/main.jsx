import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Login from "./components/Login.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx"; // Make sure this is imported
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { store } from "./app/store";
import { Provider } from "react-redux";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App remains the top-level layout with the loader
    children: [
      // --- Group for Public Routes (e.g., Login, Signup) ---
      // These routes are only accessible if the user is LOGGED OUT.
      {
        element: <ProtectedRoute authentication={false} />,
        children: [
          {
            path: "/", // The root path now renders the Login component
            element: <Login />,
          },
          // You could add a <Signup /> page here later, e.g., { path: "/signup", element: <Signup /> }
        ],
      },

      // --- Group for Private/Protected Routes (e.g., Home, Dashboard) ---
      // These routes are only accessible if the user is LOGGED IN.
      {
        element: <ProtectedRoute authentication={true} />,
        children: [
          {
            path: "/home",
            element: <Home />,
          },
          // You could add a <Dashboard /> page here later, e.g., { path: "/dashboard", element: <Dashboard /> }
        ],
      },

      // --- Standalone Auth Callback Route ---
      // This route is always public and doesn't need the guard.
      {
        path: "/auth/callback",
        element: <AuthCallback />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);