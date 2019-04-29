import React, { Component } from 'react';
// import React from 'react';
import io from 'socket.io-client'
import './App.css';
import PixelGrid from "./PixelGrid";
import ColorSelect from "./ColorSelect";
import { produce } from "immer";
import _ from "lodash";
import OnlineCount from './OnlineCount'

/**
 * 放大、拖拽、取色、限制频率、人数、页面内实时聊天
 * 批量更新而不是单点更新
 * PureComponent
 * Hooks
 * ReactDOM.createPortal
 * socket.io
 * canvas
 * Jimp
 * ArrayBuffer to image
 */

class App extends Component {
  constructor () {
    super()
    this.state = {
      pixelData: [],
      currentColor: '#ff0000',
    }
    // this.socket = io('ws://10.0.0.168:3005/')
    this.socket = io()
  }

  componentDidMount () {

  }

  handlePixelClick = (row, col) => {
    
  }

  changeCurrentColor = (color) => {
    // console.log(color)
    this.setState({
      currentColor: color
    })
  }


  
  render() {
    // console.log(this.state.pixelData)
    return (
      <div>
        {/* <h1>pixel data</h1> */}
        <PixelGrid onPickColor={this.changeCurrentColor} width={200} height={200} currentColor={this.state.currentColor} onPixelClick={this.handlePixelClick} socket={this.socket}></PixelGrid>
        <ColorSelect onChange={this.changeCurrentColor} color={this.state.currentColor}></ColorSelect>
        <OnlineCount socket={this.socket}></OnlineCount>
        <span id="color-pick-placeholder"></span>
      </div>
    );
  }
}

export default App;
