import {Button} from "../components"

const ClearAll = ({ setTask }) => {

  const handleAllTodoData = () => {
    setTask([]);
  };

  return <Button btnText="Clear All" handleAllTodoData={handleAllTodoData} />;
};

export default ClearAll