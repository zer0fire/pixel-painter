// import React, {Component} from 'react';
import React from 'react';
import Dot from './Dot'


function PixelGrid(props) {
  if(!props.pixels) {
    return null
  } else {
    // console.log(props.pixels)
    return (
      <table>
        <tbody>
          {
            props.pixels.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {
                  row.map((color, colIdx) => (
                    <Dot onClick={() => props.onPixelClick(rowIdx, colIdx)} color={color}></Dot>
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

export default PixelGrid

