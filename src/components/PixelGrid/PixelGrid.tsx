import {
    useRef,
    useState,
    useEffect,
    useContext,
    MouseEvent as ReactMouseEvent,
} from "react";
import ReactDOM from "react-dom";
import { PixelGridContext } from "../../stores/store";
import {
    createImageFromArrayBuffer,
    getMousePos,
    makeCursor,
} from "../../utils";
import {
    Offset,
    PickColor,
    TOP_LAYER,
    WrapperMouseDown,
    WrapperMouseMove,
    WrapperMouseUp,
    Zoom,
} from "../../utils/const";
import { Socket } from "socket.io-client";

const canvasStyle = {
    display: "block",
    boxShadow: "0px 0px 3px black",
};

interface Props {
    onPickColor: Function;
    currentColor: string;
    onPixelClick: Function;
    socket?: Socket | null;
}

function PixelGrid({ onPickColor, currentColor, onPixelClick, socket }: Props) {
    const [canvasWidth, setCanvasWidth] = useState(100);
    const [canvasHeight, setCanvasHeight] = useState(100);
    const [el, setEl] = useState<HTMLElement | null>(null);
    const { state, dispatch } = useContext(PixelGridContext);

    const canvas = useRef<HTMLCanvasElement | null>(null);
    const canvasWrapper = useRef<HTMLDivElement | null>(null);
    const ctx = useRef<CanvasRenderingContext2D | null>(null);
    const draggingRef = useRef<boolean>(false);

    const {
        wrapperLeft,
        wrapperTop,
        isPickingColor,
        zoomLevel,
        dotHoveX,
        dotHoveY,
    } = state;

    const handleWrapperMouseup = (e: ReactMouseEvent) => {
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

    const handleWrapperMousedown = (e: ReactMouseEvent) => {
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
                    initialX: wrapperLeft,
                    initialY: wrapperTop,
                    draggingRef,
                },
            });
        }
    };

    const handleWrapperMouseMove = (e: any) => {
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
        draggingRef.current = false;
        // const e = ev.nativeEvent;
        const e = ev;
        // 通过 body overflow=hidden 可以避免滚动
        if (e.target === canvas.current) {
            e.preventDefault();
        }
        e.stopPropagation();
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
                    width: canvasWrapper.current.clientWidth || 0,
                    height: canvasWrapper.current.clientHeight || 0,
                },
            });
        }
    }

    function mouseMoveOnWindow(e: MouseEvent) {
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
    }

    const initialPixelData = async (pixelData: Buffer) => {
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
    };

    const mouseUpOnWindow = () => {
        // e: MouseEvent
        console.log("window mouseUp");
        draggingRef.current = false;
        if (canvas.current) {
            canvas.current.style.cursor = "";
        }
    };

    const updateDot = ({ row, col, color }: any) => {
        // console.log({row, col, color})
        draw(col, row, color);
    };

    useEffect(() => {
        if (!canvasWrapper.current || !canvas.current) {
            return;
        }
        canvas.current.focus();
        canvas.current.addEventListener("wheel", handleZoom);
        window.addEventListener("mousemove", mouseMoveOnWindow);
        window.addEventListener("mouseup", mouseUpOnWindow);

        if (canvas.current) {
            canvas.current.style.imageRendering = "pixelated";
            ctx.current = canvas.current.getContext("2d");
        }

        socket && socket.on("initial-pixel-data", initialPixelData);
        socket && socket.on("update-dot", updateDot);
        return () => {
            socket && socket.off();
            window.removeEventListener("mousemove", mouseMoveOnWindow);
            window.removeEventListener("mouseup", mouseUpOnWindow);
        };
    }, []);

    const draw = (row: number, col: number, color: string) => {
        if (ctx.current) {
            ctx.current.fillStyle = color;
            ctx.current.fillRect(row, col, 1, 1);
        }
    };

    useEffect(() => {
        setEl(document.getElementById("color-pick-placeholder"));
    }, []);

    const handleCanvasMouseMove = (e: ReactMouseEvent) => {
        if (isPickingColor && ctx.current && canvas.current) {
            const [x, y] = getMousePos(e.nativeEvent);
            // console.log(x, y)
            const pixelColor = Array.from(
                ctx.current.getImageData(x, y, 1, 1).data
            );
            const pixelColorCss = `rgba(${pixelColor})`;
            // console.log(pixelColor, pixelColorCss)
            const cursorUrl = makeCursor(pixelColorCss);
            if (canvas) {
                canvas.current.style.cursor = `url(${cursorUrl}) 6 6, crosshair`;
            }
        }
    };

    return (
        <div
            style={{
                width: canvasWidth,
                height: canvasHeight,
                overflow: "hidden",
                display: "inline-block",
                border: "1px solid",
                position: "relative",
            }}
        >
            {el &&
                ReactDOM.createPortal(
                    <button
                        style={{ marginLeft: "20px" }}
                        onClick={setPickColor}
                    >
                        {isPickingColor ? "正在取色" : "取色"}
                    </button>,
                    el
                )}
            <div
                ref={canvasWrapper}
                className="canvas-wrapper"
                style={{
                    position: "absolute",
                    left: wrapperLeft,
                    top: wrapperTop,
                }}
                onMouseDown={handleWrapperMousedown}
                onMouseMove={handleWrapperMouseMove}
                onMouseUp={handleWrapperMouseup}
            >
                <span
                    className="dot-hover-box"
                    style={{
                        boxShadow: "0 0 1px black",
                        width: `${zoomLevel}px`,
                        height: `${zoomLevel}px`,
                        position: "absolute",
                        left: dotHoveX * zoomLevel,
                        top: dotHoveY * zoomLevel,
                        zIndex: TOP_LAYER,
                        pointerEvents: "none",
                    }}
                ></span>
                <canvas
                    style={{
                        ...canvasStyle,
                        transform: `scale(${zoomLevel})`,
                        transformOrigin: "top left",
                    }}
                    // onWheel={handleZoom}
                    ref={canvas}
                    onMouseMove={handleCanvasMouseMove}
                ></canvas>
            </div>
        </div>
    );
}

export default PixelGrid;
