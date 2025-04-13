import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTodos, editTodo, removeTodo } from "../features/todoSlice";

const TodoList = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todo.todos);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    dispatch(getTodos()); // Fetch todos on mount
  }, [dispatch]);

  const handleSaveEdit = () => {
    if (editText.trim()) {
      dispatch(editTodo({ id: editId, text: editText }));
      setEditId(null);
      setEditText("");
    }
  };

  return (
    <ul className="mt-6">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="flex justify-between bg-gray-800 px-4 py-2 rounded mb-2"
        >
          {editId === todo.id ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="text-white px-2 py-1 rounded"
              autoFocus
            />
          ) : (
            <span className="text-white">{todo.title}</span>
          )}

          <div className="flex space-x-2">
            {editId === todo.id ? (
              <button
                onClick={handleSaveEdit}
                className="bg-blue-500 px-3 py-1 text-white rounded"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditId(todo.id);
                  setEditText(todo.title);
                }}
                className="bg-green-500 px-3 py-1 text-white rounded"
              >
                Edit
              </button>
            )}
            <button
              onClick={() => dispatch(removeTodo(todo.id))}
              className="bg-red-500 px-3 py-1 text-white rounded"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;

// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { editTodo, removeTodo } from "../features/todoSlice";

// const TodoList = () => {
//   const todos = useSelector((state) => state.todo.todos);
//   const dispatch = useDispatch();

//   // State to track which todo is being edited
//   const [editId, setEditId] = useState(null);
//   const [editText, setEditText] = useState("");

//   // Handle edit button click
//   const handleEditClick = (todo) => {
//     setEditId(todo.id);
//     setEditText(todo.text);
//   };

//   // Handle save after editing
//   const handleSaveEdit = () => {
//     if (editText.trim() === "") return; // Prevent empty edits
//     dispatch(editTodo({ id: editId, text: editText }));
//     setEditId(null);
//     setEditText("");
//   };

//   return (
//     <>
//       <ul className="list-none">
//         {todos.map((todo) => (
//           <li
//             className="mt-4 flex justify-between items-center bg-zinc-800 px-4 py-2 rounded"
//             key={todo.id}
//           >
//             {/* If editing, show input field, else show text */}
//             {editId === todo.id ? (
//               <input
//                 type="text"
//                 value={editText}
//                 onChange={(e) => setEditText(e.target.value)}
//                 className="text-white px-2 py-1 rounded"
//                 autoFocus
//               />
//             ) : (
//               <div className="text-white">{todo.text}</div>
//             )}

//             {/* Edit/Save Button */}
//             <div className="flex items-center space-x-2">
//               {editId === todo.id ? (
//                 <button
//                   onClick={handleSaveEdit}
//                   className="text-white bg-blue-500 border-0 py-1 px-4 focus:outline-none hover:bg-blue-600 rounded text-md"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth={1.5}
//                     stroke="currentColor"
//                     className="w-6 h-6"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M4 7V5a2 2 0 012-2h8m4 0h-4m4 0v4m0-4l-4 4M4 7h16M4 7v12a2 2 0 002 2h12a2 2 0 002-2V7m-6 6h-4m0 0v4m0-4h4m-4 0v-4"
//                     />
//                   </svg>
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => handleEditClick(todo)}
//                   className="text-white bg-green-500 border-0 py-1 px-4 focus:outline-none hover:bg-green-600 rounded text-md"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth={1.5}
//                     stroke="currentColor"
//                     className="w-6 h-6"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M16.862 3.487a1.5 1.5 0 012.121 0l1.53 1.53a1.5 1.5 0 010 2.122L7.755 19.397l-3.684.86a1 1 0 01-1.21-1.211l.86-3.684L16.862 3.487z"
//                     />
//                   </svg>
//                 </button>
//               )}

//               {/* Delete Button */}
//               <button
//                 onClick={() => dispatch(removeTodo(todo.id))}
//                 className="text-white bg-red-500 border-0 py-1 px-4 focus:outline-none hover:bg-red-600 rounded text-md"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={1.5}
//                   stroke="currentColor"
//                   className="w-6 h-6"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </>
//   );
// };

// export default TodoList;
