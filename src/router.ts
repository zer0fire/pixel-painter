import { createBrowserRouter } from "react-router-dom";
import React from "react";
import App from "./components/App/App";
import HomePage from "./components/HomePage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: React.createElement(HomePage),
    },
    {
        path: "/pixel",
        element: React.createElement(App),
    },
]);
