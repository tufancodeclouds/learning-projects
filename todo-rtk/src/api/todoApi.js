import axios from "axios";

import { nanoid } from "@reduxjs/toolkit";

const API_BASE_URL = "https://jsonplaceholder.typicode.com/todos";

export const fetchTodos = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data.slice(0, 5); // Fetch only first 5 for demo
};

export const addTodoApi = async (todo) => {
  const response = await axios.post(API_BASE_URL, todo);
  return { ...response.data, id: nanoid() }; // Generate unique ID for local handling
};

export const updateTodoApi = async (id, text) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, { title: text });
  return response.data;
};

export const deleteTodoApi = async (id) => {
  await axios.delete(`${API_BASE_URL}/${id}`);
  return id;
};
