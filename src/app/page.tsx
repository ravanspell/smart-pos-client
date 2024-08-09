import type { Metadata } from "next";
import { Counter } from "@/app/components/counter/Counter";

export default function IndexPage() {
  return <Counter />;
}

export const metadata: Metadata = {
  title: "Redux Toolkit",
};
