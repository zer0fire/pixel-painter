import React, { Component } from "react";

class ZoomAble extends Component<{ children: React.ReactElement }> {
  canvas: HTMLCanvasElement | null;
  el: HTMLElement | null;
  constructor(props) {
    super(props);
    this.canvas = null;
    this.el = null;
  }

  handleMouseWheel = (e) => {
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

  render() {
    let Child = this.props.children.type;
    return (
      <Child
        ref={(el) => {
          this.el = el;
        }}
        onWheel={this.handleMouseWheel}
        {...this.props.children.props}
      />
    );
  }
}

export default ZoomAble;
