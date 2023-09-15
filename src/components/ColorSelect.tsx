// import React, { Component } from "react";
import React, { PropsWithChildren } from "react";

const colors = [
  "#ffffff",
  "#000000",
  "#ff0000",
  "#ffa500",
  "#ffff00",
  "#00ff00",
  "#00ffff",
  "#0000ff",
  "#800080",
];

const ulStyle: any = {
  margin: 0,
  padding: 0,
  marginLeft: "20px",
  marginRight: "20px",
  float: "left",
};

const liStyle: any = {
  float: "left",
  listStyle: "none",
};
const btnStyle: any = {
  width: "1em",
  height: "1em",
};

interface ColorSelectProps {
  color: string;
  onChange: (color: string) => void;
}

function ColorSelect(props: PropsWithChildren<ColorSelectProps>) {
  return (
    <div>
      <input
        type="color"
        value={props.color}
        onChange={(e) => props.onChange(e.target.value)}
      />
      <ul style={ulStyle}>
        {colors.map((color) => (
          <li style={liStyle} key={color}>
            <button
              onClick={() => props.onChange(color)}
              style={{ ...btnStyle, backgroundColor: color }}
            ></button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ColorSelect;
