import React from "react";
import { getMousePos } from "../utils";
import {
    Zoom,
    WrapperMouseUp,
    WrapperMouseMove,
    WrapperMouseDown,
    PickColor,
    Offset,
} from "../utils/const";

export const initialState = {
    zoomLevel: 1,
    wrapperLeft: 0,
    wrapperTop: 0,
    dotHoveX: 0,
    dotHoveY: 0,
    isPickingColor: false,
    initialLeft: 0,
    initialTop: 0,
    mouseInitialX: 0,
    mouseInitialY: 0,
    draggingRef: null,
};

export const PixelGridContext = React.createContext({} as any);

export function reducer(state: any, action: any) {
    switch (action.type) {
        case Zoom: {
            const { zoomLevel } = state;
            const { oldLeft, oldTop, layerX, layerY, deltaY } = action.payload;

            let newZoomLevel = 0;
            let oldZoomLevel = zoomLevel;
            let mouseLayerX = layerX;
            let mouseLayerY = layerY;

            if (deltaY > 0) {
                newZoomLevel = oldZoomLevel - 1;
            } else {
                newZoomLevel = oldZoomLevel + 1;
            }

            // 用transform，不必重排
            const oldL = parseFloat(oldLeft);
            let newLeft =
                oldL - (newZoomLevel / oldZoomLevel - 1) * mouseLayerX;
            const oldT = parseFloat(oldTop);
            let newTop = oldT - (newZoomLevel / oldZoomLevel - 1) * mouseLayerY;

            if (newZoomLevel <= 1) {
                // 缩放系数小于1时复位
                newZoomLevel = 1;
                newLeft = 0;
                newTop = 0;
            }

            return {
                ...state,
                zoomLevel: newZoomLevel,
                wrapperLeft: newLeft,
                wrapperTop: newTop,
            };
        }
        case WrapperMouseUp: {
            console.log("wrapper mouseUp");
            let { mouseMoveX, mouseMoveY, isPickingColor } = state;
            const {
                event,
                socket,
                currentColor,
                ctx,
                onPickColor,
                canvas,
                onPixelClick,
            } = action.payload;
            let mouseMoveDistance = Math.sqrt(
                mouseMoveX ** 2 + mouseMoveY ** 2
            );

            if (!isPickingColor && mouseMoveDistance < 3 && !isPickingColor) {
                let layerX = event.layerX;
                let layerY = event.layerY;
                // e.nativeEvent.offsetX  也能解决点不准问题
                const zoomLevel = state.zoomLevel;
                let row = Math.floor(layerY / zoomLevel);
                let col = Math.floor(layerX / zoomLevel);

                onPixelClick({ row, col, color: currentColor });
                // console.log(row, col)
                socket &&
                    socket.emit("draw-dot", { row, col, color: currentColor });
                // console.log("click", "pick state", isPickingColor);
            } else if (isPickingColor) {
                if (isPickingColor && ctx.current) {
                    let [x, y] = getMousePos(event);
                    let pixelColor: number[] = Array.from(
                        ctx.current.getImageData(x, y, 1, 1).data
                    );
                    let hexColor =
                        "#" +
                        pixelColor
                            .slice(0, 3)
                            .map((it) => {
                                return it.toString(16).padStart(2, "0");
                            })
                            .join("");
                    onPickColor(hexColor);
                    if (canvas.current) {
                        canvas.current.style.cursor = "";
                    }
                    isPickingColor = false;
                }
            }
            mouseMoveX = 0;
            mouseMoveY = 0;
            return {
                ...state,
                isPickingColor,
                mouseMoveX,
                mouseMoveY,
            };
        }
        case WrapperMouseMove: {
            const zoomLevel = state.zoomLevel;
            const { layerX, layerY } = action.payload;
            let x = 0;
            if (layerX) {
                x = Math.floor(layerX / zoomLevel);
            }
            let y = Math.floor(layerY / zoomLevel);
            return {
                ...state,
                dotHoveX: x,
                dotHoveY: y,
            };
        }
        case WrapperMouseDown: {
            return {
                ...state,
                ...action.payload,
            };
        }
        case PickColor: {
            return {
                ...state,
                isPickingColor: !state.isPickingColor,
            };
        }
        case Offset: {
            const { mouseX, mouseY } = action.payload;
            const { mouseInitialX, mouseInitialY, initialX, initialY } = state;
            const mouseMoveX = mouseX - mouseInitialX;
            const mouseMoveY = mouseY - mouseInitialY;
            const left = initialX + mouseMoveX;
            const top = initialY + mouseMoveY;

            return {
                ...state,
                wrapperLeft: left,
                wrapperTop: top,
                mouseMoveX,
                mouseMoveY,
            };
        }
        // case SwitchRef: {
        //   return {
        //     ...state,
        //     ...action.payload,
        //   };
        // }
        default:
            break;
    }
}
