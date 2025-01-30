import { useReducer, useCallback } from "react";
import { Toast, ToastType } from "../types/toast";

type ToastAction =
  | { type: "ADD"; toast: Toast }
  | { type: "REMOVE"; id: number };

const toastReducer = (state: Toast[], action: ToastAction): Toast[] => {
  switch (action.type) {
    case "ADD":
      return [...state, action.toast];

    case "REMOVE":
      return state.filter((toast) => toast.id !== action.id);

    default:
      return state;
  }
};

export const useToast = () => {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  const addToast = useCallback((message: string, type: ToastType = "info", time: number = 3000) => {
    const id = Date.now();
    dispatch({ type: "ADD", toast: { id, message, type, fadeOut: false, time } });
  
    setTimeout(() => {
      document.getElementById(`toast-${id}`)?.classList.add("fade-out");
    }, time - 200);
  
    setTimeout(() => {
      dispatch({ type: "REMOVE", id });
    }, time);
  }, []);

  return { toasts, addToast };
};
