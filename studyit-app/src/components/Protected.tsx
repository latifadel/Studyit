"use client";
/**
 * Protected route wrapper.
 *
 * Behavior
 * - Allows public routes `"/"` and `"/login"` without authentication.
 * - For any other route, if there is no authenticated user, redirects to `/login`.
 * - While redirecting, renders `null` to avoid flashing protected content.
 */

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";

/**
 * Guard component for authenticated sections of the app.
 * @param children Content to render when access is allowed.
 */
export function Protected({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const publicRoutes = ["/", "/login", "/signup"];

  useEffect(() => {
    if (!user && !publicRoutes.includes(pathname)) {
      window.location.href = "/login";
    }
  }, [user, pathname]);

  if (!user && !publicRoutes.includes(pathname)) return null;
  return <>{children}</>;
}
