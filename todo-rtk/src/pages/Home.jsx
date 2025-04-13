import React from "react";
import AddTodo from "../components/AddTodo";
import TodoList from "../components/TodoList";
import { useSelector } from "react-redux";

const Home = () => {
  const todos = useSelector((state) => state.todo.todos);
  return (
    <div className="w-lg mx-auto">
      <AddTodo />
      <TodoList />
    </div>
  );
};

export default Home;
