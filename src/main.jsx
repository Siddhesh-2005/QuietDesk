import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Login from "./components/Login.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { store } from "./app/store";
import { Provider } from "react-redux";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // layout wrapper
    children: [
      {
        index: true, // renders at "/"
        element: (

            <Login />

        ),
      },
      {
        path: "home", // renders at "/home"
        element: (

            <Home />

        ),
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
