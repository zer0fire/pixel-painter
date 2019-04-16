// import React, { Component } from "react";
import React from "react";

var colors = ['red', 'orange', 'yellow', 'green', 'aqua', 'blue', 'purple']

var ulStyle = {
  margin: 0,
  padding: 0,
}

var liStyle = {
  float: 'left',
  listStyle: 'none',
}
var btnStyle = {
  width: '1em',
  height: '1em',
}

function ColorSelect(props) {
  return (
    <div>
      {/* <input type="color" value={props.color}/> */}
      <ul style={ulStyle}>
        {
          colors.map(color => (
            <li style={liStyle} key={color}>
              <button onClick={() => props.onChange(color)} style={{...btnStyle, backgroundColor: color}}></button>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default ColorSelect
