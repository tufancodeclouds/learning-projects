import React, { useState } from "react";
import ColorPicker from "./ColorPicker";

const Parent = () => {
  const [color, setColor] = useState("none");

  const handleColorChange = (newColor) => {
    setColor(newColor);
  };

  return (
    <div>
      <h2>Selected Color: {color}</h2>
      <ColorPicker onColorChange={handleColorChange} />
    </div>
  );
};

export default Parent;
