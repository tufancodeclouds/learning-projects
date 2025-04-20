import { useState, useEffect } from "react";
import { TodoForm, DateTime, TodoList, ClearAll } from "./components";
import "./App.css";

function App() {
  const [task, setTask] = useState([]);
  const [updateComponent, setUpdateComponent] = useState(false);

  // Load from localStorage on first render
  useEffect(() => {
    const localStorageSavedTask =
      JSON.parse(localStorage.getItem("Tasklist")) || [];
    setTask(localStorageSavedTask);
    setUpdateComponent(true);
  }, []);

  // Save to localStorage whenever task changes
  useEffect(() => {
    updateComponent && localStorage.setItem("Tasklist", JSON.stringify(task));
  }, [task]);

  return (
    <section className="todo-container">
      <header>
        <h1>Task List</h1>
        <DateTime />
      </header>
      <main>
        <TodoForm task={task} setTask={setTask} />
        <TodoList task={task} setTask={setTask} />
      </main>
      <footer>{task.length > 1 ? <ClearAll setTask={setTask} /> : null}</footer>
    </section>
  );
}

export default App;
