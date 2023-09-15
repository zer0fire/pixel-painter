import React from "react";

interface Props {
  onClick: Function;
  row: number;
  col: number;
  color: any;
}

function Dot(props: Props) {
  // debugger;
  console.log("dot render");
  return (
    <td
      onClick={() => props.onClick(props.row, props.col)}
      style={{
        width: "5px",
        height: "5px",
        backgroundColor: props.color,
      }}
    ></td>
  );
}

export default React.memo(Dot);
