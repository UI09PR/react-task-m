export type ToastType = "info" | "error" | "success";

export interface Toast {
    id: number;
    message: string;
    type: ToastType;
    fadeOut: boolean;
    time: number;
  }