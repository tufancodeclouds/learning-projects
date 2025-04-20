import { useState } from "react";
import Parent from "./components/Parent";
import Label from "./components/Label";

function App() {
  const [data, setData] = useState("");
  const [todo, setTodo] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  

  const handleChange = (e) => {
    const newData = e.target.value;
    setData(newData);
    // console.log(newData); 
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if(!data.trim()) return;

    const newTodoItem = {
      id: Date.now(),
      text: data,
    };

    const newTodoList = [...todo, newTodoItem];
    setTodo(newTodoList);
    setData("");
    console.log("Updated list:", newTodoList);
  }

  const handleDelete = (id) => {
    const newTodoList = todo.filter((item) => item.id !== id);
    setTodo(newTodoList);
  }

  const handleEdit = (id, currentText) => {
    setEditId(id);
    setEditText(currentText);
  }

  const handleUpdate = (id) => {
    const updatedTodoList = todo.map((item) =>
      item.id === id ? { ...item, text: editText } : item
    );
    setTodo(updatedTodoList);
    setEditId(null);
    setEditText("");
  }

  // const [isChecked, setIsChecked] = useState(false);

  // const setIsCheckedFunc = (value) => {
  //   setIsChecked(value);
  // };

  // document.body.style.backgroundColor = isChecked ? "#ccc" : "#f5f5f5";

  return (
    <>
      {/* <Parent /> */}

      {/* <Label isChecked={isChecked} setIsCheckedFunc={setIsCheckedFunc} /> */}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={(e) => handleChange(e)}
          value={data}
          placeholder="Write a Todo"
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {todo.map((ntodo) => {
          return (
            <li key={ntodo.id}>
              {editId === ntodo.id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button onClick={() => handleUpdate(ntodo.id)}>Update</button>
                </>
              ) : (
                <>
                  <span>{ntodo.text}</span>
                  <button onClick={() => handleEdit(ntodo.id, ntodo.text)}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(ntodo.id)}>Delete</button>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default App;
