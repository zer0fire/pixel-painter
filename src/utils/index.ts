export function createImageFromArrayBuffer(buf): Promise<any> {
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

export function getMousePos(e) {
    let layerX = e.layerX;
    let layerY = e.layerY;
    let zoom = e.target.style.transform.match(/scale\((.*?)\)/)[1];
    return [Math.floor(layerX / zoom), Math.floor(layerY / zoom)];
}

export function makeCursor(color) {
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

export function transRGBTo16(color: string): string {
    const list = color.split(",");
    return `#${parseInt(list[0]).toString(16)}${parseInt(list[1]).toString(
        16
    )}${parseInt(list[2]).toString(16)}`;
}
export function transColorToRGB(hexColor: string): string {
    const matchRes = hexColor.match(/#(..)(..)(..)/);
    if (!matchRes) return `rbg(0, 0, 0)`;
    const r = parseInt(matchRes[1], 16);
    const g = parseInt(matchRes[2], 16);
    const b = parseInt(matchRes[3], 16);
    return `rbg(${r}, ${g}, ${b})`;
}
