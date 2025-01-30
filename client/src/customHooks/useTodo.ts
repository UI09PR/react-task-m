import { useState, useEffect, useMemo } from "react";
import { Todo } from "../types/todo";
import { todoService } from "../services/todo.service";

type DeleteQueue = number[];
type UpdateQueue = Partial<Todo>[];
type CreateQueue = { id: number; text: string }[];

export const useTodo = () => {
  const [todosData, setTodos] = useState<Todo[]>([]);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [countTodos, setCountTodos] = useState<number>(10);
  const [loadingTodo, setLoadingTodo] = useState(true);
  const [errorTodo, setErrorTodo] = useState(false);

  const [deleteQueue, setDeleteQueue] = useState<DeleteQueue>([]);
  const [updateQueue, setUpdateQueue] = useState<UpdateQueue>([]);
  const [createQueue, setCreateQueue] = useState<CreateQueue>([]);

  useEffect(() => {
    setLoadingTodo(true);
    setErrorTodo(false);
    const localTodos = localStorage.getItem("todos");

    if (localTodos) {
      setTodos(JSON.parse(localTodos));
      setLoadingTodo(false);
    }

    todoService
      .getTodos(limit, page)
      .then((res) => {
        setTodos((prevTodos) => {
          if (JSON.stringify(prevTodos) === JSON.stringify(res.data)) return prevTodos;
          return res.data;
        });
        setCountTodos(res.count);
        localStorage.setItem("todos", JSON.stringify(res.data));
      })
      .catch(() => setErrorTodo(true))
      .finally(() => setLoadingTodo(false));
  }, [page, limit]);

  const todos = useMemo(() => todosData, [todosData]);

  const processOfflineQueue = async () => {
    if (!navigator.onLine) return;

    try {
      const remainingCreateQueue = createQueue.filter((item) => !deleteQueue.includes(item.id));
      const remainingUpdateQueue = updateQueue.filter((todo) => !deleteQueue.includes(todo.id as number));

      for (const id of deleteQueue) {
        await todoService.deleteTodo(id);
      }
      setDeleteQueue([]);
      localStorage.removeItem("deleteQueue");

      const offlineIdMap: Record<number, number> = {};

      for (const { id, text } of remainingCreateQueue) {
        const relatedUpdate = remainingUpdateQueue.find((todo) => todo.id === id);
        const finalTodo = relatedUpdate ? { ...relatedUpdate, text } : { text, ready: false };

        const newTodo = await todoService.createTodo(finalTodo.text);
        offlineIdMap[id] = newTodo.id;
      }
      setCreateQueue([]);
      localStorage.removeItem("createQueue");

      const finalUpdates = remainingUpdateQueue
        .filter((todo) => !offlineIdMap[todo.id as number])
        .map((todo) => ({
          ...todo,
          id: offlineIdMap[todo.id as number] || todo.id,
        }));

      for (const todo of finalUpdates) {
        await todoService.updateTodo(todo);
      }
      setUpdateQueue([]);
      localStorage.removeItem("updateQueue");
    } catch (error) {
      console.error("Ошибка при обработке оффлайн-очереди", error);
    }
  };

  useEffect(() => {
    window.addEventListener("online", processOfflineQueue);
    return () => {
      window.removeEventListener("online", processOfflineQueue);
    };
  }, [deleteQueue, updateQueue, createQueue]);

  const deleteTodo = async (id: number) => {
    if (navigator.onLine) {
      await todoService.deleteTodo(id);
      setTodos((prev) => prev.filter((el) => el.id !== id));
    } else {
      setDeleteQueue((prev) => [...prev, id]);
      localStorage.setItem("deleteQueue", JSON.stringify([...deleteQueue, id]));
      setTodos((prev) => prev.filter((el) => el.id !== id));
    }
  };

  const updateTodo = async (todo: Partial<Todo>) => {
    if (navigator.onLine) {
      const newTodo = await todoService.updateTodo(todo);
      setTodos((prev) => prev.map((el) => (el.id === newTodo.id ? newTodo : el)));
    } else {
      setUpdateQueue((prev) => [...prev, todo]);
      localStorage.setItem("updateQueue", JSON.stringify([...updateQueue, todo]));
      setTodos((prev) => prev.map((el) => (el.id === todo.id ? { ...el, ...todo } : el)));
    }
  };

  const createTodo = async (text: string) => {
    if (!text.trim()) return;
    const offlineId = Date.now();

    if (navigator.onLine) {
      try {
        const savedTodo = await todoService.createTodo(text);
        setTodos((prev) => [...prev.filter((t) => t.id !== offlineId), savedTodo]);
      } catch (error) {
        console.error("Ошибка при создании задачи", error);
      }
    } else {
      setCreateQueue((prev) => [...prev, { id: offlineId, text }]);
      localStorage.setItem("createQueue", JSON.stringify([...createQueue, { id: offlineId, text }]));
      setTodos((prev) => [...prev, { id: offlineId, text, ready: false }]);
    }
  };

  const clearAll = async () => {
    await todoService.clearAll();
    setTodos([]);
    localStorage.removeItem("todos");
    setDeleteQueue([]);
    setUpdateQueue([]);
    setCreateQueue([]);
    localStorage.removeItem("deleteQueue");
    localStorage.removeItem("updateQueue");
    localStorage.removeItem("createQueue");
  };

  return {
    todos,
    createTodo,
    deleteTodo,
    updateTodo,
    clearAll,
    loadingTodo,
    errorTodo,
    limit,
    setLimit,
    setPage,
    countTodos,
    page,
  };
};
