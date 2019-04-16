import React, {Component} from 'react';
// import React from 'react';
import Dot from './Dot'


class PixelGrid extends Component {

  handleDotClick = (row, col) => {
    // console.log('click')
    this.props.onPixelClick(row, col)
  }

  render () {
    if(!this.props.pixels) {
      return null
    } else {
      // console.log(this.props.pixels)
      return (
        <table style={{tableLayout: 'fixed'}}>
          <tbody>
            {
              this.props.pixels.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {
                    row.map((color, colIdx) => (
                      <Dot key={colIdx} onClick={this.handleDotClick} row={rowIdx} col={colIdx} color={color}></Dot>
                    ))
                  }
                </tr>
              ))
            }
          </tbody>
        </table>
      )
    }
  }
}

export default PixelGrid

