import { memo } from "react";
import { Toast } from "../../types/toast";

const getToastClass = (type: "info" | "error" | "success") => {
    switch (type) {
      case "error":
        return "border border-red-500 text-red-500";
      case "success":
        return "border border-green-500 text-green-500";
      default:
        return "border border-gray-500 text-gray-500";
    }
  };
   const ToastContainer = memo(({toasts}: {toasts: Toast[]}) => {
  
    return (
      <div className="fixed bottom-4 right-4 w-[300px] space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className={`toast p-4 rounded-lg shadow flex items-center justify-between w-full gap-2 
              ${getToastClass(toast.type)} ${toast.fadeOut ? "fade-out" : "fade-in"}`}
          >
            <p className="text-gray-400 text-xs">{toast.time / 1000 + 's'}</p>
            <div className="w-full flex flex-row items-start">
              <p className="whitespace-normal break-all">{toast.message}</p>
            </div>
          </div>
        ))}
      </div>
    );
  });

  export default ToastContainer