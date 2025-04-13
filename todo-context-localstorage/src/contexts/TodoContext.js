import { createContext, useContext } from "react";

export const TodoContext = createContext({
  todos: [
    {
      id: 1,
      title: "Todo 1",
      completed: false,
    },
  ],
  addTodo: () => {},
  updateTodo: () => {},
  deleteTodo: () => {},
  toggleCompleted: () => {},
});

export const useTodo = () => useContext(TodoContext);

export const TodoProvider = TodoContext.Provider;
