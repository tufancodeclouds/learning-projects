import { useState } from "react";
import {
  MdCheck,
  MdEdit,
  MdCancel,
  MdSave,
  MdDeleteForever,
} from "react-icons/md";

const TodoList = ({ task, setTask }) => {

  const [currentText, setCurrentText] = useState("");
  const [hasCurrentText, setHasCurrentText] = useState(false);
  const [editId, setEditId] = useState("");

  const handleDelete = (id) => {
    const afterDeleteTask = task.filter((currentTask) => currentTask.id !== id); // currentTask is an object from the task array
    setTask(afterDeleteTask);
  };

  const handleCheck = (id) => {
    const afterToggleCheckTask = task.map((taskItem) =>
      taskItem.id === id
        ? { ...taskItem, checked: !taskItem.checked }
        : taskItem
    );
    setTask(afterToggleCheckTask);
  };

  const handleEdit = (text, id) => {
    setCurrentText(text);
    setEditId(id);
  };

  const handlleEditTextChange = (e) => {
    const checkCurrentText = e.target.value;
    setCurrentText(checkCurrentText);

    if (checkCurrentText.trim() === "") {
      setHasCurrentText(true);
    } else {
      setHasCurrentText(false);
    }
  }

  const handleCancel = () => {
    setEditId("");
  };

  const handleSave = (id) => {
    const afterEditTask = task.map((taskItem) =>
      taskItem.id === id ? { ...taskItem, text: currentText } : taskItem
    );
    
    setTask(afterEditTask);
    setEditId("");
  };

    return (
      <div className="myUnOrdList">
        <ul className="todo-list">
          {task.map((newTask) => {
            return (
              <li className="todo-item" key={newTask.id}>
                {newTask.id === editId ? (
                  <>
                    <input
                      type="text"
                      value={currentText}
                      onChange={(e) => handlleEditTextChange(e)}
                    />

                    <button
                      className="save-btn"
                      disabled={hasCurrentText}
                      onClick={() => handleSave(newTask.id)}
                    >
                      <MdSave />
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancel()}
                    >
                      <MdCancel />
                    </button>
                  </>
                ) : (
                  <>
                    <span
                      className={newTask.checked ? "checkList" : "notCheckList"}
                    >
                      {newTask.text}
                    </span>
                    <button
                      className="check-btn"
                      onClick={() => handleCheck(newTask.id)}
                    >
                      <MdCheck />
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(newTask.text, newTask.id)}
                    >
                      <MdEdit />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(newTask.id)}
                    >
                      <MdDeleteForever />
                    </button>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
}

export default TodoList;