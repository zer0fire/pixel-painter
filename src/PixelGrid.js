import React, {Component} from 'react';
// import React from 'react';


const canvasStyle = {
  display: 'block',
}

function createImageFromArrayBuffer(buf) {
  return new Promise(resolve => {
    var blob = new Blob([buf], {type: 'image/jpeg'})
    var image = new Image()
    var url = URL.createObjectURL(blob)
    image.onload = function () {
      resolve(image)
    }
    image.src = url
    // return image
  })
}

class PixelGrid extends Component {
  constructor (props) {
    super(props)

    this.state = {
      zoomLevel: 1
    }

    this.socket = this.props.socket
    this.canvas = null
    // this.zoomLevel = 1
  }

  setUpZoomHandler = () => {
    this.canvas.addEventListener('mousewheel', (e) => {
      console.log(e)

      // var mouseLayerX = e.nativeEvent.layerX
      // var mouseLayerY = e.nativeEvent.layerY
      // var newZoomLevel
      // var oldZoomLevel = this.state.zoomLevel

      // if (e.deltaY < 0) {
      //   newZoomLevel = this.state.zoomLevel + 1
      // } else {
      //   newZoomLevel = this.state.zoomLevel - 1
      // }

      if (e.deltaY < 0) {
        this.setState({
          zoomLevel: this.state.zoomLevel + 1
        })
      } else {
        this.setState({
          zoomLevel: this.state.zoomLevel - 1
        })
      }
      e.preventDefault()
    })
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
    this.setUpZoomHandler()
    this.canvas.style.imageRendering = 'pixelated'
    this.ctx = this.canvas.getContext('2d')

    this.socket.on('initial-pixel-data', async (pixelData) => {
      // console.log(pixelData)
      var image = await createImageFromArrayBuffer(pixelData)

      // document.body.append(image)
      // console.log(image.width)
      // console.log(image.height)
      this.canvas.width = image.width
      this.canvas.height = image.height
      this.ctx.drawImage(image, 0, 0)
      // this.canvas.height = pixelData.length
      // this.canvas.width = pixelData[0].length
      // console.log('Initial')
      // console.log(pixelData)
      // pixelData.forEach((row, rowIdx) => {
      //   row.forEach((color, colIdx) => {
      //     // console.log({color})
      //     this.draw(rowIdx, colIdx, color)
      //   })
      // })
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

    var row = Math.floor(layerY / this.state.zoomLevel)
    var col = Math.floor(layerX /this.state.zoomLevel)

    // console.log(row, col)
    this.socket.emit('draw-dot', {row, col, color: this.props.currentColor})
  }

  render () {
    // console.log(this.props.pixels)
    return (
      <div style={{
        display: 'inline-block',
        border: '1px solid',
      }}>
        <canvas onClick={this.handleDotClick} 
        style={{
          ...canvasStyle,
          zoom: this.state.zoomLevel
        }} 
        ref={el => this.canvas = el}></canvas>
      </div>
    )
  }
}

export default PixelGrid

