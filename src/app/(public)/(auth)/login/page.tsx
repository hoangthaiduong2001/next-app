import { Metadata } from "next";
import LoginForm from "./formLogin";

export const metadata: Metadata = {
  title: "Foodie HTD Login",
  description: "Foodie HTD Login",
  icons: {
    icon: "https://cdn-icons-png.flaticon.com/512/17583/17583711.png",
  },
};
export default function Login() {
  return (
    <div className="min-h-full">
      <LoginForm />
    </div>
  );
}
