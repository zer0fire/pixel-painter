import { createBrowserRouter } from "react-router-dom";
import React from "react";
import App from "./components/App/App";
import HomePage from "./components/HomePage";
import CssContent from "./components/CssContent";
import HtmlContent from "./components/HtmlContent";
import { PracticePage } from "./components/PracticePage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: React.createElement(HomePage),
    },
    {
        path: "/pixel",
        element: React.createElement(App),
    },
    {
        path: "/css",
        element: React.createElement(CssContent),
    },
    {
        path: "/html",
        element: React.createElement(HtmlContent),
    },
    {
        path: "/practice",
        element: React.createElement(PracticePage),
    },
]);
