import { Socket } from "socket.io-client";
import ColorSelect from "../ColorSelect/ColorSelect";
import OnlineCount from "../OnlineCount/OnlineCount";
import "./index.scss";
import { useCallback, useState } from "react";
import UpIcon from "@mui/icons-material/KeyboardArrowUp";

interface Props {
    changeCurrentColor: any;
    currentColor: string;
    socket?: Socket;
}

export default function ToolBox({
    changeCurrentColor,
    currentColor,
    socket,
}: Props) {
    const [stateClass, setClass] = useState("modal hide");
    const toggle = useCallback(function () {
        setClass((className) => {
            return className === "modal" ? "modal hide" : "modal";
        });
    }, []);

    return (
        <div className="tool-box">
            <div className={stateClass}>
                <ColorSelect
                    onChange={changeCurrentColor}
                    color={currentColor}
                ></ColorSelect>
                {/* <RecentColor></RecentColor> */}
                <OnlineCount socket={socket}></OnlineCount>
                <span id="color-pick-placeholder"></span>
            </div>
            <button onClick={toggle} className="btn">
                <UpIcon />
            </button>
        </div>
    );
}
