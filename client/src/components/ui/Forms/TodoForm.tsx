import { memo, useState } from "react";
import { Todo } from "../../../types/todo";
import Loader from "../../../HOC/Loader";
import { ToastType } from "../../../types/toast";

interface Props {
  todo: Todo;
  noMock: boolean;
  deleteTodo: (id: number) => Promise<void>;
  updateTodo: (updatedTodo: Partial<Todo>) => Promise<void>;
  addToast: (message: string, type?: ToastType, time?: number) => void;
  index: number;
}

const checkClass =
  "w-8 h-8 cursor-pointer appearance-none border-2 rounded-md checked:bg-green-600 border-green-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

function TodoForm({ todo, noMock, updateTodo, deleteTodo, addToast, index }: Props): JSX.Element {
  const [load, setLoad] = useState<boolean>(false);

  const handleCheckboxChange = () => {
    updateTodo({ id: todo.id, ready: !todo.ready })
      .then(() => addToast("The todo has been updated", "success", 2000))
      .catch(() => addToast("The todo could not be updated", "error", 2000))
      .finally(() => setLoad(false));
  };

  const handleDelete = () => {
    deleteTodo(todo.id)
      .then(() => addToast("The todo has been deleted", "success", 2000))
      .catch(() => addToast("The todo could not be deleted", "error", 2000))
      .finally(() => setLoad(false));
  };

  return (
    <div className="w-full flex-between gap-5 ">
      <div
        className="flex justify-start items-center gap-3 whitespace-normal break-all cursor-pointer"
        onClick={() => addToast(todo.text, "info", 2000)}
      >
        <p className="whitespace-nowrap">{index}.</p>
        <p className="text-md md:text-base">{todo.text.slice(0, 50) + (todo.text.length > 49 ? "..." : "")}</p>
      </div>
      <div className="flex gap-2 items-center">
        {load && <Loader type="mini" />}
        <input
          type="checkbox"
          checked={todo.ready}
          onChange={() => {
            handleCheckboxChange();
            setLoad(true);
          }}
          name="ready"
          disabled={!noMock}
          className={checkClass}
        />
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
          onClick={() => {
            handleDelete();
            setLoad(true);
          }}
          disabled={!noMock}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
export default memo(TodoForm);
