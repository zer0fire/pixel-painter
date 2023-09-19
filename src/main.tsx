import ReactDOM from "react-dom/client";
import React from "react";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

function Entry() {
    return (
        <React.StrictMode>
            <RouterProvider router={router}></RouterProvider>
        </React.StrictMode>
    );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    React.createElement(Entry)
);
