import React, { PureComponent } from "react";

interface Props {
  onClick: Function;
  row: number;
  col: number;
  color: any;
}

class Dot extends PureComponent<Props> {
  // debugger;
  render() {
    console.log("dot render");
    return (
      <td
        onClick={() => this.props.onClick(this.props.row, this.props.col)}
        style={{
          width: "5px",
          height: "5px",
          backgroundColor: this.props.color,
        }}
      ></td>
    );
  }
}

export default Dot;
