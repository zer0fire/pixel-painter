import React, { useRef } from "react";

function ZoomAble({ children }: { children: React.ReactElement }) {
  const el = useRef(null);
  const canvas = useRef(null);

  const handleMouseWheel = (e) => {
    var deltaY = e.deltaY;
    try {
      var currentZoomLevel = parseFloat(
        e.target.style.transform.match(/scale\((.*?)\)/)[1]
      );
    } catch (e) {
      currentZoomLevel = 1;
    }

    if (currentZoomLevel !== currentZoomLevel) {
      currentZoomLevel = 1;
    }

    if (deltaY < 0) {
      currentZoomLevel *= 1.25;
    } else {
      currentZoomLevel *= 0.8;
    }
    e.target.style.transform = `scale(${currentZoomLevel})`;
  };

  let Child = children.type;
  return (
    <Child
      ref={(ele) => {
        el.current = ele;
      }}
      onWheel={handleMouseWheel}
      {...children.props}
    />
  );
}

export default ZoomAble;
