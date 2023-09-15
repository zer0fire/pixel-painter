import React, { useState } from "react";
import io from "socket.io-client";
import "./App.css";
import PixelGrid from "./PixelGrid";
import ColorSelect from "./ColorSelect";
import OnlineCount from "./OnlineCount";
// import { produce } from "immer";
// import _ from "lodash";

/**
 * 放大、拖拽、取色、限制频率、人数、页面内实时聊天
 * 批量更新而不是单点更新
 * PureComponent
 * Hooks
 * ReactDOM.createPortal
 * socket.io
 * canvas
 * Jimp
 * ArrayBuffer to image
 */
const socket: any = io("http://localhost:3001");

function App() {
  const [pixelData, setPixelData] = useState([]);
  const [currentColor, setColor] = useState("#ff0000");

  const handlePixelClick = (row, col) => {};

  const changeCurrentColor = (color) => {
    setColor(color);
  };

  return (
    <React.StrictMode>
      <div>
        {/* <h1>pixel data</h1> */}
        <PixelGrid
          onPickColor={changeCurrentColor}
          currentColor={currentColor}
          onPixelClick={handlePixelClick}
          socket={socket}
        ></PixelGrid>
        <ColorSelect
          onChange={changeCurrentColor}
          color={currentColor}
        ></ColorSelect>
        <OnlineCount socket={socket}></OnlineCount>
        <span id="color-pick-placeholder"></span>
      </div>
    </React.StrictMode>
  );
}

export default App;
