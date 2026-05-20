"use client";

import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { AuthPanel } from "./account/AuthPanel";
import { Dashboard } from "./account/Dashboard";

export default function AccountView() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="pb-20">
      {!isAuthenticated ? <AuthPanel /> : <Dashboard />}
    </div>
  );
}
