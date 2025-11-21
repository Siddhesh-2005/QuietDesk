import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Login from "./components/Login.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { store } from "./app/store";
import { Provider } from "react-redux";
import MyPosts from "./pages/MyPosts.jsx";
import AddPost from "./pages/AddPost.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <ProtectedRoute authentication={false} />,
        children: [
          {
            path: "/",
            element: <Login />,
          },
        ],
      },

      {
        element: <ProtectedRoute authentication={true} />,
        children: [
          {
            path: "/home",
            element: <Home />,
          },
        ],
      },

      {
        element: <ProtectedRoute authentication={true} />,
        children: [
          {
            path: "/addpost",
            element: <AddPost />,
          },
        ],
      },

      {
        element: <ProtectedRoute authentication={true} />,
        children: [
          {
            path: "/myposts",
            element: <MyPosts />,
          },
        ],
      },

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
