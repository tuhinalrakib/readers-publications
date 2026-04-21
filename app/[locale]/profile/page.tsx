// app/profile/page.tsx
import { redirect } from "next/navigation";

export default function ProfilePage() {
  // Redirect to orders by default
  redirect("/profile/orders");
}