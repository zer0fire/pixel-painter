import React, { Component } from 'react';
// import React from 'react';
import io from 'socket.io-client'
import './App.css';
import PixelGrid from "./PixelGrid";
import ColorSelect from "./ColorSelect";
import { produce } from "immer";


class App extends Component {
  constructor () {
    super()
    this.state = {
      pixelData: [],
      currentColor: 'red',
    }
  }

  componentDidMount () {
    // 万一需要操作DOM，这边DOM以及渲染好了。如果执行setState等异步的set，可以显现出来，其他的立马render会显示不了数据
    this.socket = io('ws://localhost:3005/')
    this.socket.on('pixel-data', (data) => {
      console.log(data);
      this.setState({
        pixelData: data
      })
    })

    this.socket.on('update-dot', (info)=> {
      console.log(info)
      this.setState({
        pixelData: this.state.pixelData.map((row, rowIndex) => {
          if(rowIndex === info.row) {
            return row.map((color, colIdx) => {
              if (colIdx === info.col) {
                return info.color
              } else {
                return color
              }
            })
          } else {
            return row
          }
        })
      })
    })
  }

  handlePixelClick = (row, col) => {
    this.socket.emit('draw-dot', {
      row,
      col,
      color: this.state.currentColor,
    })
  }

  changeCurrentColor = (color) => {
    // console.log(color)
    this.setState({
      currentColor: color
    })
  }


  
  render() {
    return (
      <div>
        pixel data
        <PixelGrid onPixelClick={this.handlePixelClick} pixels={this.state.pixelData}></PixelGrid>
        <ColorSelect onChange={this.changeCurrentColor} color={this.state.currentColor}></ColorSelect>
      </div>
    );
  }
}

export default App;
