import React from "react";
import ReactDOM from "react-dom";
import App from "../src/components/App/App";

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(React.createElement(App), div);
    ReactDOM.unmountComponentAtNode(div);
});
