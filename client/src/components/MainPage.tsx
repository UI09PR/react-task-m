import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "../customHooks/useToast";
import { useTodo } from "../customHooks/useTodo";
import TodoTable from "./ui/Lists/TodoTable";
import ToastContainer from "./ui/ToastContainer";
import Loader from "../HOC/Loader";
import Pagination from "./ui/PagePagination";

function MainPage(): JSX.Element {
  const {
    todos,
    createTodo,
    updateTodo,
    clearAll,
    deleteTodo,
    loadingTodo,
    errorTodo,
    limit,
    setLimit,
    setPage,
    countTodos,
    page,
  } = useTodo();

  const [newTodoText, setNewTodoText] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const { addToast, toasts } = useToast();

  const memoizedSetPage = useCallback(setPage, []);
  const memoizedTodos = useMemo(() => todos, [todos]);
  const memoizedUpdateTodo = useCallback(updateTodo, []);
  const memoizedDeleteTodo = useCallback(deleteTodo, []);
  const memoizedAddToast = useCallback(addToast, []);

  const handleCreate = async () => {
    if (!newTodoText.trim()) return;
    setLoading(true);
    try {
      await createTodo(newTodoText);
      setNewTodoText("");
      addToast("Task has been created", "success", 3000);
    } catch {
      addToast("Error creating task", "error", 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    setLoading(true);
    try {
      await clearAll();
      addToast("Cleaning was successful", "success", 3000);
    } catch {
      addToast("cleaning failed", "error", 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (errorTodo) {
      addToast("Error loading Todo", "error", 3000);
    }
    if (!loadingTodo && !errorTodo) {
      addToast("Todo has been loaded", "success", 3000);
    }
  }, [loadingTodo, errorTodo, addToast]);

  useEffect(() => {
    addToast("Welcome!");
  }, [addToast]);

  return (
    <div className="flex-start flex-col min-h-screen bg-gray-100 w-full p-5 text-[#000] text-center">
      {(loadingTodo || loading) && <Loader type="global" />}
      <h1 className="text-2xl font-bold">Todo List</h1>
      <div className="flex-between mt-3 w-full">
        <div className="flex justify-start items-center gap-3 w-full">
          <input
            type="number"
            value={limit}
            className="w-[18%] md:w-[10%] rounded-lg p-2 border-2 border-gray-700"
            onChange={(e) => setLimit(Math.max(1, Number(e.target.value)))}
          />
          <p>Limit</p>
        </div>
        <button
          onClick={() => handleClearAll()}
          className="px-4 py-2 bg-red-400 text-white rounded-lg border-2 border-gray-700 whitespace-nowrap"
        >
          Clear all
        </button>
      </div>

      <div className="flex-between gap-4 mt-4 w-full">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Enter a description..."
          className="border p-2 rounded-lg w-full border-2 border-gray-700"
        />
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-green-400 text-white rounded-lg border-2 border-gray-700"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      <div className="mt-5 w-full">
        {!loadingTodo && (
          <TodoTable
            todos={memoizedTodos}
            updateTodo={memoizedUpdateTodo}
            deleteTodo={memoizedDeleteTodo}
            addToast={memoizedAddToast}
          />
        )}
      </div>
      <div className="w-full flex-center">
        <Pagination currentPage={page} totalPages={Math.ceil(countTodos / limit)} onPageChange={memoizedSetPage} />
      </div>
      <ToastContainer toasts={toasts} />
    </div>
  );
}

export default memo(MainPage);
