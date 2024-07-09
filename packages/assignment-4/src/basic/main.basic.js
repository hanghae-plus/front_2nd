import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

function main() {
  const app = document.getElementById("app");
  ReactDOM.render(React.createElement(App), app);
}

main();
