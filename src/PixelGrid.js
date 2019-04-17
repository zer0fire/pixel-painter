import React, {Component} from 'react';
// import React from 'react';


const canvasStyle = {
  zoom: 15,
}

class PixelGrid extends Component {
  constructor (props) {
    super(props)

    this.socket = this.props.socket
    this.canvas = null
    this.zoomLevel = 15
  }

  setUpDragHandler = () => {

    var dragging = false
    this.canvas.addEventListener('mousedown', e => {
      dragging = true
    })
    this.canvas.addEventListener('mousemove', e => {

    })
    this.canvas.addEventListener('mouseup', e => {
      dragging = false
    })
  }

  componentDidMount () {
    this.canvas.style.imageRendering = 'pixelated'
    this.ctx = this.canvas.getContext('2d')

    this.socket.on('initial-pixel-data', (pixelData) => {
      this.canvas.height = pixelData.length
      this.canvas.width = pixelData[0].length
      // console.log('Initial')
      // console.log(pixelData)
      pixelData.forEach((row, rowIdx) => {
        row.forEach((color, colIdx) => {
          // console.log({color})
          this.draw(rowIdx, colIdx, color)
        })
      })
    })

    this.socket.on('update-dot', ({row, col, color}) =>{
      // console.log({row, col, color})
      this.draw(col, row, color)
    })
  }

  draw = (row, col, color) => {
    this.ctx.fillStyle = color
    this.ctx.fillRect(row, col, 1, 1)
  }

  handleDotClick = (e) => {
    var layerX = e.nativeEvent.layerX
    var layerY = e.nativeEvent.layerY

    var row = Math.floor(layerY / 15)
    var col = Math.floor(layerX / 15)

    // console.log(row, col)
    this.socket.emit('draw-dot', {row, col, color: this.props.currentColor})
  }

  render () {
    // console.log(this.props.pixels)
    return (
      <div>
        <canvas onClick={this.handleDotClick} style={canvasStyle} ref={el => this.canvas = el}></canvas>
      </div>
    )
  }
}

export default PixelGrid

