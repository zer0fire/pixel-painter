import React from "react";

function Dot(props) {
  console.log('dot render')
  return <td onClick={props.onClick} 
             style={{
               width: '5px',
               height: '5px', 
               backgroundColor: props.color,}}>
         </td>
}

export default Dot