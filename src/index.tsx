import ReactDOM from "react-dom";
import React from "react";
import "./index.css";
import App from "./components/App/App";
// import * as serviceWorker from './serviceWorker';

// class App extends React.Component {
//   socket
//   constructor (){
//     super()
//     this.socket = io()
//   }
//   render() {
//     return <div>1</div>
//   }
// }

ReactDOM.render(React.createElement(App), document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
