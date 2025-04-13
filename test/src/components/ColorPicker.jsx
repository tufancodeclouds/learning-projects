import React from "react";

const ColorPicker = ({ onColorChange }) => {
  return (
    <div>
      <button onClick={() => onColorChange("Red")}>Red</button>
      <button onClick={() => onColorChange("Blue")}>Blue</button>
      <button onClick={() => onColorChange("Green")}>Green</button>
    </div>
  );
};

export default ColorPicker;
