import React from "react";
import Cart from "./Cart";

function App() {
  const wrappedBox = React.createElement(
    "div",
    { className: "bg-gray-100 p-8" },
    React.createElement(Cart, null)
  );
  return wrappedBox;
}

export default App;
