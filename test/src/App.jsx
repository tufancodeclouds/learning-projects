import { useState } from "react";
import Parent from "./components/Parent";
import Label from "./components/Label";

function App() {
  const [isChecked, setIsChecked] = useState(false);

  const setIsCheckedFunc = (value) => {
    setIsChecked(value);
  };

  document.body.style.backgroundColor = isChecked ? "#ccc" : "#f5f5f5";

  return (
    <>
      {/* <Parent /> */}

      <Label isChecked={isChecked} setIsCheckedFunc={setIsCheckedFunc} />
    </>
  );
}

export default App;
