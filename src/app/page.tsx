"use client";

import { Button } from "@/components/atoms/Button";
import { LOGIN_ROUTE } from "@/constants/routes";
import { useRouter } from "next/navigation";

export default function IndexPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Welcome to My HRM</h1>
        <Button
          onClick={() => router.push(LOGIN_ROUTE)}
          size="lg"
        >
          Login to Dashboard
        </Button>
      </div>
    </div>
  );
}