import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import customFetch from "./utils/customFtech.js";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

customFetch
  .get("/test")
  .then((res) => console.log(res.data))
  .catch((err) => console.error(err));

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <ToastContainer position="top-center" />
  </StrictMode>
);
