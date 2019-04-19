import React, { Component } from 'react'


class Zoomable extends Component {
  constructor(props) {
    super(props)
    this.canvas = null
  }

  handleMouseWheel = e => {
    var deltaY = e.deltaY
    try {
      var currentZoomLevel = parseFloat(e.target.style.transform.match(/scale\((.*?)\)/)[1])
    } catch(e) {
      currentZoomLevel = 1
    }

    if (currentZoomLevel !== currentZoomLevel) {
      currentZoomLevel = 1
    }

    
    if (deltaY < 0) {
      currentZoomLevel *= 1.25
    } else {
      currentZoomLevel *= 0.8
    }
    e.target.style.transform = `scale(${currentZoomLevel})`
  }

  render(){
    var Comp = this.props.children.type
    return <Comp 
      ref={el => {
        this.el = el
      }}
      {...this.props.children.props}
      onWheel={this.handleMouseWheel}
    />
  }
}



export default Zoomable
