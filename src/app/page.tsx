import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LOGIN_ROUTE } from "@/constants/routes";

export default function IndexPage() {
  // temp redirect to login page
  redirect(LOGIN_ROUTE);
}

export const metadata: Metadata = {
  title: "My HRM",
};
