import React, {Component} from 'react';
// import React from 'react';
import ReactDOM from "react-dom";


const canvasStyle = {
  display: 'block',
  boxShadow: '0px 0px 3px black',
  
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

function getMousePose(e) {
  var layerX = e.layerX
  var layerY = e.layerY
  var zoom = e.target.style.transform.match(/scale\((.*?)\)/)[1]
  return [
    Math.floor(layerX / zoom), 
    Math.floor(layerY / zoom)
  ]
}


class PixelGrid extends Component {
  constructor (props) {
    super(props)

    this.state = {
      zoomLevel: 1,
      dotHoveX: -1,
      dotHoveY: -1,
      isPickingColor: false,
      width: 0,
      height: 0,
    }

    this.socket = this.props.socket
    this.canvas = null
    // this.zoomLevel = 1
  }

  handleDotClick = (e) => {
    // console.log("click")
    var layerX = e.layerX
    var layerY = e.layerY
    // e.nativeEvent.offsetX  也能解决点不准问题
    var row = Math.floor(layerY / this.state.zoomLevel)
    var col = Math.floor(layerX /this.state.zoomLevel)

    // console.log(row, col)
    this.socket.emit('draw-dot', {row, col, color: this.props.currentColor})
  }

  setUpZoomHandler = () => {
    this.canvas.addEventListener('mousewheel', (e) => {
      // console.log(e)

      var mouseLayerX = e.layerX
      var mouseLayerY = e.layerY
      var newZoomLevel
      var oldZoomLevel = this.state.zoomLevel

      if (e.deltaY < 0) {
        newZoomLevel = this.state.zoomLevel + 1
      } else {
        newZoomLevel = this.state.zoomLevel - 1
      }

      // var zoomRatio = newZoomLevel / oldZoomLevel

      // l2 = ((a / b - 1) * x + l1 * a ) / b

      var a = oldZoomLevel
      var b = newZoomLevel
      var x = mouseLayerX
      var y = mouseLayerY
      // 用zoom，需要重排和计算放大倍数给left和top的影响
      // var l1 = parseFloat(this.canvas.style.left)
      // var l2 = (-(b / a - 1) * x + l1 * a ) / b
      // var t1 = parseFloat(this.canvas.style.top) 
      // var t2 = (-(b / a - 1) * y + t1 * a ) / b

      // 用transform，不必重排
      var l1 = parseFloat(this.canvasWrapper.style.left)
      var l2 = l1 -(b / a - 1) * x 
      var t1 = parseFloat(this.canvasWrapper.style.top) 
      var t2 = t1 -(b / a - 1) * y

      if (newZoomLevel < 1) { // 缩放系数小于1时复位
        newZoomLevel = 1
        l2 = 0;
        t2 = 0;
      }

      this.canvasWrapper.style.left = l2 + 'px'
      this.canvasWrapper.style.top = t2 + 'px'

      
      this.setState({
          zoomLevel: newZoomLevel
      })

      e.preventDefault()
    })
    
  }
 
  setUpDragHandler = () => {
    var initialLeft
    var initialTop
    var mouseInitialX
    var mouseInitialY
    var mouseMoveX
    var mouseMoveY
    var dragging = false
    this.canvasWrapper.addEventListener('mousedown', e => {
      initialLeft = parseFloat(this.canvasWrapper.style.left)
      initialTop = parseFloat(this.canvasWrapper.style.top)
      mouseInitialX = e.clientX
      mouseInitialY = e.clientY
      dragging = true
    })
    this.canvas.addEventListener("mousemove", e => {
      var x = Math.floor(e.layerX / this.state.zoomLevel)
      var y = Math.floor(e.layerY / this.state.zoomLevel)
      this.setState({
        dotHoveX: x,
        dotHoveY: y,
      })
    })
    window.addEventListener('mousemove', e => {
      if(dragging) {
        var mouseX = e.clientX
        var mouseY = e.clientY
        mouseMoveX = mouseX - mouseInitialX
        mouseMoveY = mouseY - mouseInitialY
        var left = initialLeft + mouseMoveX
        var top = initialTop + mouseMoveY
        this.canvasWrapper.style.left = left + 'px'
        this.canvasWrapper.style.top = top + 'px'
      }
    })
    window.addEventListener("mouseup", e => {
      dragging = false
    })
    this.canvasWrapper.addEventListener('mouseup', e => {
      dragging = false
      var mouseMoveDistance = Math.sqrt(mouseMoveX ** 2 + mouseMoveY ** 2)
      if(mouseMoveDistance < 3 && !this.state.isPickingColor) {
        this.handleDotClick(e)
      }
    })
  }
  setUpPickColorHandler = () => {
    function makeCursor(color) {
      var cursor = document.createElement('canvas');
      var ctx = cursor.getContext('2d');
      cursor.width = 41;
      cursor.height = 41;

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#000000';
      ctx.moveTo(0, 6);
      ctx.lineTo(12, 6);
      ctx.moveTo(6, 0);
      ctx.lineTo(6, 12);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(25, 25, 14, 0, 2 * Math.PI, false);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#000000';
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(25, 25, 13.4, 0, 2 * Math.PI, false);
      ctx.fillStyle = color;
      ctx.fill();
      return cursor.toDataURL()
    }

    this.canvas.addEventListener('mousemove', e => {
      if(this.state.isPickingColor) {
        var [x, y] = getMousePose(e) 
        // console.log(x, y)
        var pixelColor = Array.from(this.ctx.getImageData(x, y, 1, 1).data)
        var pixelColorCss = 'rgba(' + pixelColor + ')'
        // console.log(pixelColor, pixelColorCss)
        var cursorUrl = makeCursor(pixelColorCss)
        this.canvas.style.cursor = `url(${cursorUrl}) 6 6, crosshair`
      }
    })
    this.canvas.addEventListener('click', e => {
      if(this.state.isPickingColor) {
        var [x, y] = getMousePose(e) 
        var pixelColor = Array.from(this.ctx.getImageData(x, y, 1, 1).data)
        var hexColor = '#' + pixelColor.slice(0, 3).map(it => {
          return it.toString(16).padStart(2, '0')
        }).join('')
        this.props.onPickColor(hexColor)
        this.setState({
          isPickingColor: false,
        })
        this.canvas.style.cursor = ''
      }
    })
  }

  setPickColor = () => {
    this.setState({
      isPickingColor: true
    })
  } 

  componentDidMount () {
    this.setUpZoomHandler()
    this.setUpDragHandler()
    this.setUpPickColorHandler()
    
    this.canvas.style.imageRendering = 'pixelated'
    this.ctx = this.canvas.getContext('2d')

    this.socket.on('initial-pixel-data', async (pixelData) => {
      // console.log(pixelData)
      var image = await createImageFromArrayBuffer(pixelData)

      this.canvas.width = image.width
      this.canvas.height = image.height

      this.setState({
        width: image.width,
        height: image.height,
      })

      this.ctx.drawImage(image, 0, 0)
      this.forceUpdate()

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

  renderPickColorBtn() {
    var el = document.getElementById('color-pick-placeholder')
    if(el) {
      return ReactDOM.createPortal((
        <button onClick={this.setPickColor}>{
          this.state.isPickingColor ? '正在取色' : '取色'
        }</button>
      ), el)
    } else {
      return null
    }
  }



  render () {
    console.log("PixelGrid render")
    return (
      <div style={{
        width: this.state.width,
        height: this.state.height,
        overflow: "hidden",
        margin: '120px',
        display: 'inline-block',
        border: '1px solid',
        position: "relative",
      }}>
        {this.renderPickColorBtn()}
        <div ref={el => this.canvasWrapper = el} className="canvas-wrapper" style={{
          position: "absolute",
          left: 0,
          top: 0,
        }}>
          <span className="dot-hover-box" style={{
            boxShadow: '0 0 1px black',
            width: this.state.zoomLevel + 'px',
            height: this.state.zoomLevel + 'px',
            position: 'absolute',
            left: this.state.dotHoveX * this.state.zoomLevel,
            top: this.state.dotHoveY * this.state.zoomLevel,
            zIndex: 8,
            pointerEvents: 'none',
          }}></span>
          <canvas 
          style={{
            ...canvasStyle,
            // zoom: this.state.zoomLevel
            transform: 'scale(' + this.state.zoomLevel +')',
            // 解决像素点不准的问题
            transformOrigin: 'top left',
          }} 
          ref={el => this.canvas = el}></canvas>
        </div>
      </div>
    )
  }
}

export default PixelGrid

