import React, { useEffect, useReducer, useRef, useState } from "react";
import { Socket, Manager } from "socket.io-client";
import "./App.scss";
import PixelGrid from "../PixelGrid/PixelGrid";
import { PixelGridContext, initialState, reducer } from "../../stores/store";
import ToolBox from "../ToolBox";
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

function App() {
    // const [pixelData, setPixelData] = useState([]);
    const [currentColor, setColor] = useState("#ff0000");
    const [state, dispatch] = useReducer(reducer, initialState);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        try {
            const m = new Manager("http://localhost:3001");
            const socket: Socket = m.socket("/");
            socket.io.on("error", () => {
                console.log("can not connect");
                socket.close();
            });
            socketRef.current = socket;
        } catch (e) {
            console.log(e);
        }
    }, []);

    const handlePixelClick = () => {
        // row: number, col: number
    };

    const changeCurrentColor = (color: string) => {
        setColor(color);
    };

    return (
        <React.StrictMode>
            <div>
                <PixelGridContext.Provider value={{ state, dispatch }}>
                    {/* <h1>pixel data</h1> */}
                    {/* lorem*100 */}
                    <ToolBox
                        changeCurrentColor={changeCurrentColor}
                        socket={socketRef.current}
                        currentColor={currentColor}
                    ></ToolBox>
                    <PixelGrid
                        onPickColor={changeCurrentColor}
                        currentColor={currentColor}
                        onPixelClick={handlePixelClick}
                        socket={socketRef.current}
                    ></PixelGrid>
                </PixelGridContext.Provider>
            </div>
        </React.StrictMode>
    );
}

export default App;
