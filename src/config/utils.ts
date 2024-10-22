import { toast } from "@/hooks/use-toast";
import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error.response.data.error) {
    error.response.data.error.forEach((item: any) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    toast({
      title: "Error",
      description: error.response.data.message ?? "Error not identify",
      variant: "destructive",
      duration: duration ?? 5000,
    });
  }
};
