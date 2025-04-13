import React from "react";

const Label = ({ isChecked, setIsCheckedFunc }) => {
  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => setIsCheckedFunc(!isChecked)}
      />
      <span className="slider round"></span>
    </label>
  );
};

export default Label;
