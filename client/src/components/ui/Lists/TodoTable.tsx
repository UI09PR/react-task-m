import { memo, useEffect, useState } from "react";
import { Todo } from "../../../types/todo";
import TodoForm from "../Forms/TodoForm";
import { ToastType } from "../../../types/toast";

interface Props {
  todos: Todo[];
  deleteTodo: (id: number) => Promise<void>;
  updateTodo: (updatedTodo: Partial<Todo>) => Promise<void>;
  addToast: (message: string, type?: ToastType, time?: number) => void;
}
function TodoTable({ todos, updateTodo, deleteTodo, addToast }: Props) {
  const [checkTodos, setCheckTodos] = useState<Todo[]>([]);

  useEffect(() => {
    if (todos.length < 1) setCheckTodos([{ id: 0, text: "Let's create the first task!", ready: false }]);
    else setCheckTodos(todos);
  }, [todos]);

  return (
    <ul className="w-full flex-center flex-col gap-5 ">
      {checkTodos.map((todo, i) => (
        <li key={todo.id} className="w-full flex-center border-4 border-gray-300 p-5 rounded-xl bg-gray-300">
          <TodoForm
            todo={todo}
            noMock={todo.id > 0}
            updateTodo={updateTodo}
            deleteTodo={deleteTodo}
            addToast={addToast}
            index={i + 1}
          />
        </li>
      ))}
    </ul>
  );
}

export default memo(TodoTable);
