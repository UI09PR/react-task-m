import { Todo } from "../types/todo";

const API_URL = "/api/todos";

export const todoService = {
  async getTodos(limit: number, page: number): Promise<{data: Todo[], count: number}> {
    const response = await fetch(API_URL + `?limit=${limit}&page=${page}`);
    if (!response.ok) throw new Error("Ошибка загрузки списка задач");
    return response.json();
  },

  async createTodo(text: string): Promise<Todo> {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) throw new Error("Ошибка создания задачи");
    return response.json();
  },

  async deleteTodo(id: number) {
    const response = await fetch(API_URL + '/' + id, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Ошибка создания задачи");
  },

  async clearAll() {
    const response = await fetch(API_URL + '/clear/all', {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Ошибка создания задачи");
  },

  async updateTodo(todo: Partial<Todo>): Promise<Todo> {
    const response = await fetch(API_URL, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo),
    });    

    if (!response.ok) throw new Error("Ошибка создания задачи");
    return response.json();
  },
};
