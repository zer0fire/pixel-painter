import React, { useRef, useState, useEffect, useReducer } from "react";
import ReactDOM from "react-dom";

const WrapperMouseUp = "WrapperMouseUp";
// const SwitchRef = "SwitchRef";
const Zoom = "Zoom";

const WrapperMouseMove = "wrapperMouseMove";
const WrapperMouseDown = "wrapperMouseDown";
const PickColor = "pickColor";
const Offset = "offset";

const canvasStyle = {
  display: "block",
  boxShadow: "0px 0px 3px black",
};

const initialState = {
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

function reducer(state, action) {
  switch (action.type) {
    case Zoom: {
      const { zoomLevel } = state;
      const { oldLeft, oldTop, layerX, layerY, deltaY } = action.payload;

      let newZoomLevel = 0;
      let oldZoomLevel = zoomLevel;
      let mouseLayerX = layerX;
      let mouseLayerY = layerY;

      const a = oldZoomLevel;
      const b = newZoomLevel;
      const x = mouseLayerX;
      const y = mouseLayerY;

      // 用transform，不必重排
      const oldL = parseFloat(oldLeft);
      let newLeft = oldL - (b / a - 1) * x;
      const oldT = parseFloat(oldTop);
      let newTop = oldT - (b / a - 1) * y;

      if (deltaY > 0) {
        newZoomLevel = oldZoomLevel - 1;
      } else {
        newZoomLevel = oldZoomLevel + 1;
      }

      if (newZoomLevel <= 1) {
        // 缩放系数小于1时复位
        newZoomLevel = 1;
        newLeft = 0;
        newTop = 0;
      }
      console.log(newLeft, newTop);

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
      let mouseMoveDistance = Math.sqrt(mouseMoveX ** 2 + mouseMoveY ** 2);

      if (!isPickingColor && mouseMoveDistance < 3 && !isPickingColor) {
        let layerX = event.layerX;
        let layerY = event.layerY;
        // e.nativeEvent.offsetX  也能解决点不准问题
        const zoomLevel = state.zoomLevel;
        let row = Math.floor(layerY / zoomLevel);
        let col = Math.floor(layerX / zoomLevel);

        onPixelClick({ row, col, color: currentColor });
        // console.log(row, col)
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

function createImageFromArrayBuffer(buf): Promise<any> {
  return new Promise((resolve) => {
    let blob = new Blob([buf], { type: "image/jpeg" });
    let image = new Image();
    let url = URL.createObjectURL(blob);
    image.onload = function () {
      resolve(image);
    };
    image.src = url;
    // return image
  });
}

function getMousePos(e) {
  let layerX = e.layerX;
  let layerY = e.layerY;
  let zoom = e.target.style.transform.match(/scale\((.*?)\)/)[1];
  return [Math.floor(layerX / zoom), Math.floor(layerY / zoom)];
}
interface Props {
  onPickColor: Function;
  currentColor: string;
  onPixelClick: Function;
  socket: any;
}

// TODO:
// 1. 解决 socket 如何和 useState 通信问题
// 2. 解决放大问题
// 3. 解决取色问题

function PixelGrid({ onPickColor, currentColor, onPixelClick, socket }: Props) {
  const [canvasWidth, setCanvasWidth] = useState(100);
  const [canvasHeight, setCanvasHeight] = useState(100);

  const [state, dispatch] = useReducer(reducer, initialState);

  const canvas = useRef<HTMLCanvasElement | null>(null);
  const canvasWrapper = useRef<HTMLDivElement | null>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const draggingRef = useRef<boolean>(false);

  const handleWrapperMouseup = (e) => {
    const event = e.nativeEvent;
    // draggingRef.current = false;
    dispatch({
      type: WrapperMouseUp,
      payload: {
        event,
        currentColor,
        socket,
        onPickColor,
        onPixelClick,
        canvas,
        ctx,
        draggingRef,
      },
    });
  };

  const handleWrapperMousedown = (e) => {
    const event = e.nativeEvent;
    if (canvasWrapper.current) {
      draggingRef.current = true;
      dispatch({
        type: WrapperMouseDown,
        payload: {
          initialTop: parseFloat(canvasWrapper.current.style.top),
          initialLeft: parseFloat(canvasWrapper.current.style.left),
          mouseInitialX: event.clientX,
          mouseInitialY: event.clientY,
          initialX: state.wrapperLeft,
          initialY: state.wrapperTop,
          draggingRef,
        },
      });
    }
  };

  const handleWrapperMouseMove = (e: any) => {
    // const zoomLevel = canvasRef.current.zoomLevel;
    // let x = 0;
    // if (e && e.layerX) {
    //   x = Math.floor(e.layerX / zoomLevel);
    // }
    // let y = Math.floor(e.layerY / zoomLevel);
    // canvasRef.current.dotHoveX = x;
    // canvasRef.current.dotHoveY = y;
    const event = e.nativeEvent;
    dispatch({
      type: WrapperMouseMove,
      payload: {
        layerX: event.layerX,
        layerY: event.layerY,
      },
    });
  };

  const setPickColor = () => {
    dispatch({
      type: PickColor,
    });
  };

  function handleZoom(ev: any) {
    const e = ev.nativeEvent;
    // e.preventDefault();
    // 用transform，不必重排
    if (canvasWrapper && canvasWrapper.current) {
      dispatch({
        type: Zoom,
        payload: {
          deltaY: e.deltaY || 0,
          oldLeft: canvasWrapper.current.style.left || 0,
          oldTop: canvasWrapper.current.style.top || 0,
          layerX: e.layerX || 0,
          layerY: e.layerY || 0,
        },
      });
    }
  }

  useEffect(() => {
    if (!canvasWrapper.current || !canvas.current) {
      return;
    }
    window.addEventListener("mousemove", (e) => {
      if (draggingRef.current) {
        console.log("window.mousemove");
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        if (canvasWrapper.current) {
          dispatch({
            type: Offset,
            payload: {
              mouseX,
              mouseY,
            },
          });
        }
      }
    });

    window.addEventListener("mouseup", (e) => {
      console.log("window mouseUp");

      draggingRef.current = false;
      if (canvas.current) {
        canvas.current.style.cursor = "";
      }
    });

    if (canvas.current) {
      canvas.current.style.imageRendering = "pixelated";
      ctx.current = canvas.current.getContext("2d");
    }

    socket.on("initial-pixel-data", async (pixelData) => {
      // console.log(pixelData)
      const image = await createImageFromArrayBuffer(pixelData);

      if (canvas.current) {
        canvas.current.width = image.width;
        canvas.current.height = image.height;
      }

      if (ctx.current) {
        ctx.current.drawImage(image, 0, 0);
      }
      console.log(image.width, image.height);

      // canvasRef.current.width = image.width;
      // canvasRef.current.height = image.height;

      setCanvasWidth(image.width);
      setCanvasHeight(image.height);
    });
    socket.on("update-dot", ({ row, col, color }) => {
      // console.log({row, col, color})
      draw(col, row, color);
    });
    return () => {
      socket.off();
    };
  }, []);

  const draw = (row, col, color) => {
    if (ctx.current) {
      ctx.current.fillStyle = color;
      ctx.current.fillRect(row, col, 1, 1);
    }
  };

  const renderPickColorBtn = () => {
    let el = document.getElementById("color-pick-placeholder");
    if (el) {
      return ReactDOM.createPortal(
        <button style={{ marginLeft: "20px" }} onClick={setPickColor}>
          {state.isPickingColor ? "正在取色" : "取色"}
        </button>,
        el
      );
    }
    return null;
  };

  function makeCursor(color) {
    let cursor = document.createElement("canvas");
    let ctx = cursor.getContext("2d");
    cursor.width = 41;
    cursor.height = 41;
    if (ctx) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#000000";
      ctx.moveTo(0, 6);
      ctx.lineTo(12, 6);
      ctx.moveTo(6, 0);
      ctx.lineTo(6, 12);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(25, 25, 14, 0, 2 * Math.PI, false);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#000000";
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(25, 25, 13.4, 0, 2 * Math.PI, false);
      ctx.fillStyle = color;
      ctx.fill();
    }
    return cursor.toDataURL();
  }

  const handleCanvasMouseMove = (e) => {
    if (state.isPickingColor && ctx.current && canvas.current) {
      let [x, y] = getMousePos(e.nativeEvent);
      // console.log(x, y)
      let pixelColor = Array.from(ctx.current.getImageData(x, y, 1, 1).data);
      let pixelColorCss = "rgba(" + pixelColor + ")";
      // console.log(pixelColor, pixelColorCss)
      let cursorUrl = makeCursor(pixelColorCss);
      if (canvas) {
        canvas.current.style.cursor = `url(${cursorUrl}) 6 6, crosshair`;
      }
    }
  };

  // console.log("PixelGrid render")
  // useEffect(() => {
  //   console.log(state.wrapperLeft, state.wrapperTop);
  // }, [state.wrapperLeft, state.wrapperTop]);
  return (
    <div
      style={{
        width: canvasWidth,
        height: canvasHeight,
        overflow: "hidden",
        margin: "20px",
        display: "inline-block",
        border: "1px solid",
        position: "relative",
      }}
    >
      {renderPickColorBtn()}
      <div
        ref={canvasWrapper}
        className="canvas-wrapper"
        style={{
          position: "absolute",
          left: state.wrapperLeft,
          top: state.wrapperTop,
        }}
        onMouseDown={handleWrapperMousedown}
        onMouseMove={handleWrapperMouseMove}
        onMouseUp={handleWrapperMouseup}
      >
        <span
          className="dot-hover-box"
          style={{
            boxShadow: "0 0 1px black",
            width: state.zoomLevel + "px",
            height: state.zoomLevel + "px",
            position: "absolute",
            left: state.dotHoveX * state.zoomLevel,
            top: state.dotHoveY * state.zoomLevel,
            zIndex: 8,
            pointerEvents: "none",
          }}
        ></span>
        <canvas
          style={{
            ...canvasStyle,
            transform: "scale(" + state.zoomLevel + ")",
            transformOrigin: "top left",
          }}
          onWheel={handleZoom}
          ref={canvas}
          onMouseMove={handleCanvasMouseMove}
        ></canvas>
      </div>
    </div>
  );
}

export default PixelGrid;
