import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchTodos,
  addTodoApi,
  updateTodoApi,
  deleteTodoApi,
} from "../api/todoApi";

// Async Thunks for API Calls
export const getTodos = createAsyncThunk("todo/getTodos", async () => {
  return await fetchTodos();
});

export const addTodo = createAsyncThunk("todo/addTodo", async (text) => {
  return await addTodoApi({ title: text, completed: false });
});

export const editTodo = createAsyncThunk(
  "todo/editTodo",
  async ({ id, text }) => {
    return await updateTodoApi(id, text);
  }
);

export const removeTodo = createAsyncThunk("todo/removeTodo", async (id) => {
  return await deleteTodoApi(id);
});

const todoSlice = createSlice({
  name: "todo",
  initialState: { todos: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTodos.fulfilled, (state, action) => {
        state.todos = action.payload;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload);
      })
      .addCase(editTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex(
          (todo) => todo.id === action.payload.id
        );
        if (index !== -1) state.todos[index].text = action.payload.text;
      })
      .addCase(removeTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      });
  },
});

export default todoSlice.reducer;

// import { createSlice, nanoid } from "@reduxjs/toolkit";

// // Load todos from localStorage (if available)
// const loadTodos = () => {
//   const storedTodos = localStorage.getItem("todos");
//   return storedTodos
//     ? JSON.parse(storedTodos)
//     : [{ id: 1, text: "Hello world", completed: false }];
// };

// // Save todos to localStorage
// const saveTodos = (todos) => {
//   localStorage.setItem("todos", JSON.stringify(todos));
// };

// const initialState = {
//   todos: loadTodos(),
// };

// export const todoSlice = createSlice({
//   name: "todo",
//   initialState,
//   reducers: {
//     addTodo: (state, action) => {
//       const todo = {
//         id: nanoid(),
//         text: action.payload,
//         completed: false,
//       };
//       state.todos.push(todo);
//       saveTodos(state.todos); // Save to localStorage
//     },
//     editTodo: (state, action) => {
//       const { id, text } = action.payload;
//       const todo = state.todos.find((todo) => todo.id === id);
//       if (todo) {
//         todo.text = text;
//         saveTodos(state.todos); // Save to localStorage
//       }
//     },
//     removeTodo: (state, action) => {
//       state.todos = state.todos.filter((todo) => todo.id !== action.payload);
//       saveTodos(state.todos); // Save to localStorage
//     },
//     toggleTodo: (state, action) => {
//       const todo = state.todos.find((todo) => todo.id === action.payload);
//       if (todo) {
//         todo.completed = !todo.completed;
//         saveTodos(state.todos); // Save to localStorage
//       }
//     },
//   },
// });

// export const { addTodo, editTodo, removeTodo, toggleTodo } = todoSlice.actions;
// export default todoSlice.reducer;
