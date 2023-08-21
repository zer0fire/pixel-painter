import React, { useRef, useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";

const canvasStyle = {
  display: "block",
  boxShadow: "0px 0px 3px black",
};

function createImageFromArrayBuffer(buf): Promise<any> {
  return new Promise((resolve) => {
    var blob = new Blob([buf], { type: "image/jpeg" });
    var image = new Image();
    var url = URL.createObjectURL(blob);
    image.onload = function () {
      resolve(image);
    };
    image.src = url;
    // return image
  });
}

function getMousePose(e) {
  var layerX = e.layerX;
  var layerY = e.layerY;
  var zoom = e.target.style.transform.match(/scale\((.*?)\)/)[1];
  return [Math.floor(layerX / zoom), Math.floor(layerY / zoom)];
}
interface Props {
  onPickColor: Function;
  currentColor: string;
  onPixelClick: Function;
  socket: any;
}

function PixelGrid({ onPickColor, currentColor, onPixelClick, socket }: Props) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [dotHoveX, setDotHoveX] = useState(-1);
  const [dotHoveY, setDotHoveY] = useState(-1);
  const [isPickingColor, setIsPickingColor] = useState(false);
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(200);

  // const [, update] = useState(null);
  // const forceUpdate = useCallback(() => update(Object.create(null)), []);

  const canvas = useRef<HTMLCanvasElement | null>(null);
  const canvasWrapper = useRef<HTMLDivElement | null>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);

  const handleDotClick = (e) => {
    var layerX = e.layerX;
    var layerY = e.layerY;
    // e.nativeEvent.offsetX  也能解决点不准问题
    var row = Math.floor(layerY / zoomLevel);
    var col = Math.floor(layerX / zoomLevel);

    // console.log(row, col)
    socket.emit("draw-dot", { row, col, color: currentColor });
  };

  const setUpZoomHandler = useCallback(() => {
    canvas &&
      canvas.current &&
      canvas.current.addEventListener("mousewheel", (e: any) => {
        // console.log(e)

        let mouseLayerX = e.layerX;
        let mouseLayerY = e.layerY;
        let newZoomLevel;
        let oldZoomLevel = zoomLevel;

        if (e.deltaY < 0) {
          newZoomLevel = zoomLevel + 1;
        } else {
          newZoomLevel = zoomLevel - 1;
        }

        // var zoomRatio = newZoomLevel / oldZoomLevel

        // l2 = ((a / b - 1) * x + l1 * a ) / b

        let a = oldZoomLevel;
        let b = newZoomLevel;
        let x = mouseLayerX;
        let y = mouseLayerY;
        // 用zoom，需要重排和计算放大倍数给left和top的影响
        // var l1 = parseFloat(this.canvas.style.left)
        // var l2 = (-(b / a - 1) * x + l1 * a ) / b
        // var t1 = parseFloat(this.canvas.style.top)
        // var t2 = (-(b / a - 1) * y + t1 * a ) / b

        // 用transform，不必重排
        if (canvasWrapper && canvasWrapper.current) {
          var l1 = parseFloat(canvasWrapper.current.style.left);
          var l2 = l1 - (b / a - 1) * x;
          var t1 = parseFloat(canvasWrapper.current.style.top);
          var t2 = t1 - (b / a - 1) * y;

          if (newZoomLevel < 1) {
            // 缩放系数小于1时复位
            newZoomLevel = 1;
            l2 = 0;
            t2 = 0;
          }

          canvasWrapper.current.style.left = l2 + "px";
          canvasWrapper.current.style.top = t2 + "px";

          setZoomLevel(() => newZoomLevel);

          e.preventDefault();
        }
      });
  }, [canvas.current, canvasWrapper.current, ctx.current]);

  const setUpDragHandler = useCallback(() => {
    let initialLeft;
    let initialTop;
    let mouseInitialX;
    let mouseInitialY;
    let mouseMoveX = 0;
    let mouseMoveY = 0;
    let dragging = false;
    if (!canvasWrapper.current || !canvas.current) {
      return;
    }
    canvasWrapper.current.addEventListener("mousedown", (e) => {
      if (canvasWrapper.current) {
        initialLeft = parseFloat(canvasWrapper.current.style.left);
        initialTop = parseFloat(canvasWrapper.current.style.top);
        mouseInitialX = e.clientX;
        mouseInitialY = e.clientY;
        dragging = true;
      }
    });
    canvas.current.addEventListener("mousemove", (e: any) => {
      let x = 0;
      if (e && e.layerX) {
        x = Math.floor(e.layerX / zoomLevel);
      }
      var y = Math.floor(e.layerY / zoomLevel);

      setDotHoveX(x);
      setDotHoveY(y);
    });
    window.addEventListener("mousemove", (e) => {
      if (dragging) {
        var mouseX = e.clientX;
        var mouseY = e.clientY;
        mouseMoveX = mouseX - mouseInitialX;
        mouseMoveY = mouseY - mouseInitialY;
        var left = initialLeft + mouseMoveX;
        var top = initialTop + mouseMoveY;
        if (canvasWrapper.current) {
          canvasWrapper.current.style.left = left + "px";
          canvasWrapper.current.style.top = top + "px";
        }
      }
    });
    window.addEventListener("mouseup", (e) => {
      dragging = false;
    });
    canvasWrapper.current &&
      canvasWrapper.current.addEventListener("mouseup", (e) => {
        dragging = false;
        let mouseMoveDistance = Math.sqrt(mouseMoveX ** 2 + mouseMoveY ** 2);

        if (mouseMoveDistance < 3 && !isPickingColor) {
          handleDotClick(e);
          console.log("click", "pick state", isPickingColor);
        }
        mouseMoveX = 0;
        mouseMoveY = 0;
      });
  }, [canvas.current, canvasWrapper.current, ctx.current]);
  const setUpPickColorHandler = useCallback(() => {
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

    canvas.current &&
      canvas.current.addEventListener("mousemove", (e) => {
        if (isPickingColor && ctx.current && canvas.current) {
          var [x, y] = getMousePose(e);
          // console.log(x, y)
          var pixelColor = Array.from(
            ctx.current.getImageData(x, y, 1, 1).data
          );
          var pixelColorCss = "rgba(" + pixelColor + ")";
          // console.log(pixelColor, pixelColorCss)
          var cursorUrl = makeCursor(pixelColorCss);
          if (canvas) {
            canvas.current.style.cursor = `url(${cursorUrl}) 6 6, crosshair`;
          }
        }
      });
    canvas.current &&
      canvas.current.addEventListener("click", (e) => {
        if (isPickingColor && ctx.current) {
          var [x, y] = getMousePose(e);
          var pixelColor = Array.from(
            ctx.current.getImageData(x, y, 1, 1).data
          );
          var hexColor =
            "#" +
            pixelColor
              .slice(0, 3)
              .map((it) => {
                return it.toString(16).padStart(2, "0");
              })
              .join("");
          onPickColor(hexColor);
          setIsPickingColor(false);
          if (canvas.current) {
            canvas.current.style.cursor = "";
          }
        }
      });
  }, [canvas.current, canvasWrapper.current, ctx.current]);

  const setPickColor = () => {
    setIsPickingColor(true);
  };

  useEffect(() => {
    setUpZoomHandler();
    setUpDragHandler();
    setUpPickColorHandler();

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
      setWidth(() => image.width);
      setHeight(() => image.height);
    });

    socket.on("update-dot", ({ row, col, color }) => {
      // console.log({row, col, color})
      draw(col, row, color);
    });
    return () => {
      socket.off();
    };
  }, [canvas.current, canvasWrapper.current, ctx.current]);

  const draw = (row, col, color) => {
    if (ctx.current) {
      ctx.current.fillStyle = color;
      ctx.current.fillRect(row, col, 1, 1);
    }
  };

  const renderPickColorBtn = () => {
    var el = document.getElementById("color-pick-placeholder");
    if (el) {
      return ReactDOM.createPortal(
        <button style={{ marginLeft: "20px" }} onClick={setPickColor}>
          {isPickingColor ? "正在取色" : "取色"}
        </button>,
        el
      );
    } else {
      return null;
    }
  };

  // console.log("PixelGrid render")
  return (
    <div
      style={{
        width: width,
        height: height,
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
          left: 0,
          top: 0,
        }}
      >
        <span
          className="dot-hover-box"
          style={{
            boxShadow: "0 0 1px black",
            width: zoomLevel + "px",
            height: zoomLevel + "px",
            position: "absolute",
            left: dotHoveX * zoomLevel,
            top: dotHoveY * zoomLevel,
            zIndex: 8,
            pointerEvents: "none",
          }}
        ></span>
        <canvas
          style={{
            ...canvasStyle,
            // zoom: this.state.zoomLevel
            transform: "scale(" + zoomLevel + ")",
            // 解决像素点不准的问题
            transformOrigin: "top left",
          }}
          ref={canvas}
        ></canvas>
      </div>
    </div>
  );
}

export default PixelGrid;
