import { useState } from "react";

const TodoForm = ({ task, setTask }) => {

    const [inputValue, setInputValue] = useState("");
    const [hasInputValue, setHasInputValue] = useState(false);
    const [inputValidate, setInputValidate] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();

      const trimmedValue = inputValue.trim();

      if (!trimmedValue) {
        setHasInputValue(true);
        return;
      }

      const duplicateTask = task.find(
        (prevTask) => prevTask.text.toLowerCase() === trimmedValue.toLowerCase() // prevTask is an object from the task array
      );

      const newTask = {
        id: Date.now(),
        text: trimmedValue,
        checked: false,
      };

      if (!duplicateTask) {
        setInputValidate(false);

        // setTask([...task, newTask]);
        setTask((prev) => [...prev, newTask]);

        setInputValue("");
      } else {
        setInputValidate(true);
      }

    }

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            className="todo-input"
            autoComplete="off"
            placeholder="Write Task Here"
            value={inputValue}
            onChange={(e) => {
              return setInputValue(e.target.value), setHasInputValue(false);
            }}
          />
          {hasInputValue && (
            <p className="error">Please add a task name</p>
          )}
          {inputValidate && (
            <p className="error">Please add a different task name</p>
          )}
        </div>
        <div>
          <button type="submit" className="todo-btn">
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TodoForm;